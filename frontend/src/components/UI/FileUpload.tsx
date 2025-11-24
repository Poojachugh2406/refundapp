
// import { FileText, Lock, Upload } from "lucide-react";



// // File Upload Component
// const FileUpload: React.FC<{
//   label: string;
//   accept: string;
//   value: File | null;
//   onChange: (file: File | null) => void;
//   required?: boolean;
//   disabled?:boolean;
// }> = ({ label, accept, value, onChange, required = false , disabled}) => (
//   <div className="space-y-2">
//     <label className="flex items-center text-sm font-medium text-gray-700">
//       <Upload className="w-4 h-4 mr-2 text-gray-500" />
//       {label}
//       {required && <span className="ml-1 text-red-500">*</span>}
//     </label>
//     <div className="relative">
//       <input
//         type="file"
//         disabled ={disabled}
//         accept={accept}
//         onChange={(e) => onChange(e.target.files?.[0] || null)}
//         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//       />
//       <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${value
//           ? "border-green-300 bg-green-50"
//           : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
//         }`}>
//         <div className="flex flex-col items-center gap-2">
//           {value ? (
//             <>
//               <FileText className="w-8 h-8 text-green-600" />
//               <p className="text-sm font-medium text-green-700">{value.name}</p>
//               <p className="text-xs text-green-600">File uploaded successfully</p>
//             </>
//           ) : (
//             <>
//             {disabled ? <Lock className="w-8 h-8 text-gray-600" /> : <Upload className="w-8 h-8 text-gray-400" />}
              
//               <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
//               <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default FileUpload;




import { FileText, Lock, Upload, AlertCircle } from "lucide-react";
// 1. Import 'ReactNode' to allow JSX in our error state
import { useState, type ReactNode } from "react";

// Define constants for validation
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// File Upload Component
const FileUpload: React.FC<{
  label: string;
  value: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  disabled?: boolean;
}> = ({ label, value, onChange, required = false, disabled }) => {
  
  // 2. Update the error state to accept a string OR a ReactNode
  const [error, setError] = useState<string | ReactNode | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    setError(null);

    if (!file) {
      onChange(null); 
      return;
    }

    if (!file.type.startsWith("image/")) {
      const typeError = "File must be an image (PNG, JPG, etc.).";
      setError(typeError);
      onChange(null);
      e.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      // 3. Create a JSX error message with a clickable link
      const sizeError = (
        <>
          File is too large (Max: {MAX_FILE_SIZE_MB}MB). You can resize it&nbsp;
          <a
            href="https://www.reduceimages.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium text-blue-500 hover:text-blue-700"
          >
            here
          </a>
          .
        </>
      );
      setError(sizeError);
      onChange(null);
      e.target.value = "";
      return;
    }
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <Upload className="w-4 h-4 mr-2 text-gray-500" />
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="file"
          disabled={disabled}
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
            value
              ? "border-green-300 bg-green-50"
              : error
              ? "border-red-400 bg-red-50"
              : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          {/* ...omitted internal content for brevity, no changes here... */}
           <div className="flex flex-col items-center gap-2">
            {value ? (
              <>
                <FileText className="w-8 h-8 text-green-600" />
                <p className="text-sm font-medium text-green-700">{value.name}</p>
                <p className="text-xs text-green-600">File uploaded successfully</p>
              </>
            ) : (
              <>
                {disabled ? (
                  <Lock className="w-8 h-8 text-gray-600" />
                ) : error ? (
                  <AlertCircle className="w-8 h-8 text-red-600" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
                <p className="text-sm font-medium text-gray-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF (MAX. {MAX_FILE_SIZE_MB}MB)
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* 4. This div now correctly renders either the string or the JSX error */}
      {error && (
        <div className="flex items-center pt-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;