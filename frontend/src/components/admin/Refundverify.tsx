// src/components/admin/RefundTable.tsx
import React, { useState } from 'react';
import { ScanText, Loader2, ShieldCheck, ShieldAlert} from 'lucide-react';
// Ensure the file name matches exactly (ocrService vs ocrservice)
// import { checkImageVerification } from '@/utils/ocrService';
import { toast } from 'react-hot-toast';

export interface Refund {
  id: string;
  customerName: string;
  screenshot: string;
  status: string;
}

const RefundTable: React.FC = () => {
  // Mock Data
  const [refunds] = useState<Refund[]>([
    { 
      id: '1', 
      customerName: 'Alice', 
      // 🟢 CHANGE 1: Use a reliable, public receipt image that definitely works
      screenshot: 'https://res.cloudinary.com/demo/image/upload/v1680000000/sample_receipt.jpg', 
      status: 'Pending' 
    },
    { 
      id: '2', 
      customerName: 'Bob', 
      // 🔴 CHANGE 2: A generic image that will fail the "verified" keyword check
      screenshot: 'https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png', 
      status: 'Pending' 
    },
  ]);

  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  // Use a map to store results: { '1': true, '2': false }
  const [verifiedIds, setVerifiedIds] = useState<Record<string, boolean | null>>({});

  const handleVerify = async (id: string, url: string) => {
    setLoadingIds(prev => [...prev, id]);
    
    // Clear previous status for this row
    setVerifiedIds(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });

    console.log(`Verifying ID: ${id} with URL: ${url}`);

    // Call the service
    const result = await checkImageVerification(url);

    if (result.success) {
      // Update state based on verification result
      setVerifiedIds(prev => ({ ...prev, [id]: result.isVerified }));
      
      if (result.isVerified) {
        toast.success(`Row ${id}: Verified Successfully!`);
      } else {
        console.log("OCR Text Found:", result.extractedText); // Debugging
        toast.error(`Row ${id}: Keyword "verified" not found.`);
      }
    } else {
      // 🟡 CHANGE 3: Show the actual error message from the backend
      console.error("Verification failed:", result.error);
      toast.error(`Scan failed: ${result.error || "Unknown error"}`);
    }

    setLoadingIds(prev => prev.filter(item => item !== id));
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Proof Image</th>
            <th className="px-6 py-3 text-center">OCR Status</th>
            <th className="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {refunds.map((refund) => (
            <tr key={refund.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">{refund.customerName}</td>
              
              <td className="px-6 py-4">
                {/* Thumbnail with link */}
                <a href={refund.screenshot} target="_blank" rel="noreferrer" className="block w-12 h-12">
                  <img 
                    src={refund.screenshot} 
                    className="w-full h-full object-cover rounded border hover:opacity-75 transition-opacity" 
                    alt="Proof" 
                  />
                </a>
              </td>
              
              {/* Status Badge */}
              <td className="px-6 py-4 text-center">
                {verifiedIds[refund.id] === true && (
                  <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                    <ShieldCheck className="w-3 h-3" /> VERIFIED
                  </span>
                )}
                {verifiedIds[refund.id] === false && (
                  <span className="inline-flex items-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                    <ShieldAlert className="w-3 h-3" /> INVALID
                  </span>
                )}
                {verifiedIds[refund.id] === undefined && (
                  <span className="text-gray-400 text-xs italic">Not Scanned</span>
                )}
              </td>

              {/* Verify Button */}
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => handleVerify(refund.id, refund.screenshot)}
                  disabled={loadingIds.includes(refund.id)}
                  className="inline-flex items-center justify-center p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Verify Proof with OCR"
                >
                  {loadingIds.includes(refund.id) ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2 px-1">
                      <ScanText className="w-4 h-4" />
                      <span className="text-xs font-semibold">Verify</span>
                    </div>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RefundTable;