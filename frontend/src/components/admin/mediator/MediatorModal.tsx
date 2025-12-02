// // import React, { useState, useEffect } from 'react';
// // import toast from 'react-hot-toast';
// // import { X } from 'lucide-react';
// // import Button from '@/components/UI/Button';
// // import Input from '@/components/UI/Input';
// // import type { User } from '@/types/auth';

// // interface MediatorModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   mediator?: User | null;
// //   onSave: (data: any) => Promise<void>;
// // }

// // const MediatorModal: React.FC<MediatorModalProps> = ({ isOpen, onClose, mediator, onSave }) => {
// //   const [formData, setFormData] = useState({
// //     name: '',
// //     email: '',
// //     phone: '',
// //     password: '',
// //     nickName: '',
// //     role: 'mediator' as 'mediator'
// //   });
// //   const [isSaving, setIsSaving] = useState(false);

// //   useEffect(() => {
// //     if (mediator) {
// //       setFormData({
// //         name: mediator.name || '',
// //         email: mediator.email || '',
// //         phone: mediator.phone || '',
// //         password: '',
// //         nickName: mediator.nickName || '',
// //         role: 'mediator'
// //       });
// //     } else {
// //       setFormData({
// //         name: '',
// //         email: '',
// //         phone: '',
// //         password: '',
// //         nickName: '',
// //         role: 'mediator'
// //       });
// //     }
// //   }, [mediator, isOpen]);

// //   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();

// //     if (!mediator && !formData.password) {
// //       toast.error('Password is required for new mediators');
// //       return;
// //     }

// //     setIsSaving(true);

// //     try {
// //       await onSave(formData);
// //       onClose();
// //     } catch (error: any) {
// //       toast.error(error.message || 'Failed to save mediator');
// //     } finally {
// //       setIsSaving(false);
// //     }
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
// //       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
// //         <div className="flex items-center justify-between p-6 border-b">
// //           <h2 className="text-2xl font-bold text-gray-900">
// //             {mediator ? 'Edit Mediator' : 'Create New Mediator'}
// //           </h2>
// //           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
// //             <X className="w-6 h-6" />
// //           </button>
// //         </div>

// //         <form onSubmit={handleSubmit} className="p-6">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //             <Input
// //               label="Name"
// //               name="name"
// //               value={formData.name}
// //               onChange={handleChange}
// //               required
// //               placeholder="Enter mediator name"
// //             />

// //             <Input
// //               label="Email"
// //               name="email"
// //               type="email"
// //               value={formData.email}
// //               onChange={handleChange}
// //               required
// //               placeholder="Enter email address"
// //               disabled={!!mediator}
// //             />

// //             <Input
// //               label="Phone"
// //               name="phone"
// //               value={formData.phone}
// //               onChange={handleChange}
// //               required
// //               placeholder="Enter phone number"
// //             />

// //             <Input
// //               label="Nick Name"
// //               name="nickName"
// //               value={formData.nickName}
// //               onChange={handleChange}
// //               placeholder="Enter nick name (optional)"
// //             />

// //             {!mediator && (
// //               <Input
// //                 label="Password"
// //                 name="password"
// //                 type="password"
// //                 value={formData.password}
// //                 onChange={handleChange}
// //                 required
// //                 placeholder="Enter password"
// //               />
// //             )}
// //           </div>

// //           <div className="flex justify-end space-x-3 mt-6">
// //             <Button type="button" variant="outline" onClick={onClose}>
// //               Cancel
// //             </Button>
// //             <Button type="submit" isLoading={isSaving}>
// //               {mediator ? 'Update Mediator' : 'Create Mediator'}
// //             </Button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default MediatorModal;









// import React, { useState, useEffect } from 'react';
// import toast from 'react-hot-toast';
// import { X } from 'lucide-react';
// import Button from '@/components/UI/Button';
// import Input from '@/components/UI/Input';
// import type { User } from '@/types/auth';

// interface MediatorModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   mediator?: User | null;
//   onSave: (data: any) => Promise<void>;
//   isSaving?: boolean;
// }

// const MediatorModal: React.FC<MediatorModalProps> = ({ 
//   isOpen, 
//   onClose, 
//   mediator, 
//   onSave,
//   isSaving = false 
// }) => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     nickName: '',
//     role: 'mediator' as 'mediator'
//   });

//   useEffect(() => {
//     if (mediator) {
//       setFormData({
//         name: mediator.name || '',
//         email: mediator.email || '',
//         phone: mediator.phone || '',
//         password: '',
//         nickName: mediator.nickName || '',
//         role: 'mediator'
//       });
//     } else {
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         password: '',
//         nickName: '',
//         role: 'mediator'
//       });
//     }
//   }, [mediator, isOpen]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!mediator && !formData.password) {
//       toast.error('Password is required for new mediators');
//       return;
//     }

//     try {
//       await onSave(formData);
//     } catch (error: any) {
//       toast.error(error.message || 'Failed to save mediator');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-2xl font-bold text-gray-900">
//             {mediator ? 'Edit Mediator' : 'Create New Mediator'}
//           </h2>
//           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               label="Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               placeholder="Enter mediator name"
//             />

//             <Input
//               label="Email"
//               name="email"
//               type="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               placeholder="Enter email address"
//               disabled={!!mediator}
//             />

//             <Input
//               label="Phone"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               required
//               placeholder="Enter phone number"
//             />

//             <Input
//               label="Nick Name"
//               name="nickName"
//               value={formData.nickName}
//               onChange={handleChange}
//               placeholder="Enter nick name (optional)"
//             />

//             {!mediator && (
//               <Input
//                 label="Password"
//                 name="password"
//                 type="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 placeholder="Enter password"
//               />
//             )}
//           </div>

//           <div className="flex justify-end space-x-3 mt-6">
//             <Button type="button" variant="outline" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button type="submit" isLoading={isSaving}>
//               {mediator ? 'Update Mediator' : 'Create Mediator'}
//             </Button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MediatorModal;

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, User as UserIcon, CreditCard, FileText, Users } from 'lucide-react';
import Button from '@/components/UI/Button';
import Input from '@/components/UI/Input';
import type { User } from '@/types/auth';

interface MediatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediator?: User | null;
  onSave: (data: any) => Promise<void>;
  isSaving?: boolean;
}

const MediatorModal: React.FC<MediatorModalProps> = ({ 
  isOpen, 
  onClose, 
  mediator, 
  onSave,
  isSaving = false 
}) => {
  // Initialize state with all new fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    nickName: '',
    role: 'mediator',
    // New Fields
    aadhaarNumber: '',
    panNumber: '',
    upiId: '',
    communityLink: '',
    // Bank Details (Flattened for form handling)
    bankName: '',
    ifscCode: '',
    accountNumber: ''
  });

  useEffect(() => {
    if (mediator) {
      // Populate form for Edit Mode
      setFormData({
        name: mediator.name || '',
        email: mediator.email || '',
        phone: mediator.phone || '',
        password: '', // Keep password empty on edit unless changing
        nickName: mediator.nickName || '',
        role: 'mediator',
        aadhaarNumber: mediator.aadhaarNumber || '',
        panNumber: mediator.panNumber || '',
        upiId: mediator.upiId || '',
        communityLink: mediator.communityLink || '',
        // Handle nested bankDetails safely
        bankName: mediator.bankName || '',
        ifscCode: mediator.ifscCode || '',
        accountNumber: mediator.accountNumber || ''
      });
    } else {
      // Reset for Create Mode
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        nickName: '',
        role: 'mediator',
        aadhaarNumber: '',
        panNumber: '',
        upiId: '',
        communityLink: '',
        bankName: '',
        ifscCode: '',
        accountNumber: ''
      });
    }
  }, [mediator, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation for new user
    if (!mediator && !formData.password) {
      toast.error('Password is required for new mediators');
      return;
    }

    try {
      // Structure data back to what API expects (nesting bankDetails)
      const submissionData = {
        ...formData,
        bankDetails: {
          bankName: formData.bankName,
          ifscCode: formData.ifscCode,
          accountNumber: formData.accountNumber
        }
      };

      // Remove flat bank fields from root object to keep it clean
      // @ts-ignore
      delete submissionData.bankName;
      // @ts-ignore
      delete submissionData.ifscCode;
      // @ts-ignore
      delete submissionData.accountNumber;

      await onSave(submissionData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save mediator');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">
            {mediator ? 'Edit Mediator Details' : 'Create New Mediator'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          
          {/* Section 1: Personal Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600 border-b pb-2">
              <UserIcon className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Personal Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Full Name" />
              <Input label="Nick Name" name="nickName" value={formData.nickName} onChange={handleChange} placeholder="Nick Name" />
              <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={!!mediator} placeholder="Email Address" />
              <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone Number" />
              
              {!mediator && (
                <Input label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="Password" />
              )}
            </div>
          </div>

          {/* Section 2: Identity Proofs */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600 border-b pb-2">
              <FileText className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Identity Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Aadhaar Number" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="12-digit Aadhaar" />
              <Input label="PAN Number" name="panNumber" value={formData.panNumber} onChange={handleChange} placeholder="PAN Number" />
            </div>
            {/* If checking an existing mediator with an image, you might want to show a link here */}
            {mediator?.aadhaarImageUrl && (
              <div className="text-sm text-blue-600 underline">
                 <a href={mediator.aadhaarImageUrl} target="_blank" rel="noreferrer">View Uploaded Aadhaar Card</a>
              </div>
            )}
          </div>

          {/* Section 3: Bank Details */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600 border-b pb-2">
              <CreditCard className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Banking & Payment</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="Bank Name" name="bankName" value={formData.bankName} onChange={handleChange} placeholder="Bank Name" />
              <Input label="IFSC Code" name="ifscCode" value={formData.ifscCode} onChange={handleChange} placeholder="IFSC Code" />
              <Input label="Account Number" name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Account No." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="UPI ID" name="upiId" value={formData.upiId} onChange={handleChange} placeholder="UPI ID" />
            </div>
          </div>

          {/* Section 4: Community */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-blue-600 border-b pb-2">
              <Users className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Community</h3>
            </div>
            <div className="grid grid-cols-1">
              <Input label="Group/Community Link" name="communityLink" value={formData.communityLink} onChange={handleChange} placeholder="WhatsApp/Telegram Group Link" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {mediator ? 'Update Mediator' : 'Create Mediator'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MediatorModal;