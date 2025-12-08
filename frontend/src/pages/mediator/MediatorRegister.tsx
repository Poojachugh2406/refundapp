// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { 
//   Package, 
//   Lock, 
//   Mail, 
//   ArrowRight, 
//   User, 
//   Phone, 
// } from 'lucide-react';
// import { authAPI } from '@/utils/api';
// import Alert from '@/components/UI/Alert';
// import Input from '@/components/UI/Input';
// import Button from '@/components/UI/Button';

// // Types
// interface RegisterFormData {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
//   nickName?: string;
// }
// // Branding Panel Component - Mediator Theme
// const BrandingPanel: React.FC = () => (
//   <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
//     {/* Logo */}
//     <div className="flex items-center space-x-3 z-10">
//       <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg">
//         <Package className="h-7 w-7 text-white" />
//       </div>
//       <h1 className="text-3xl font-bold">Hawk Agency</h1>
//     </div>
    
//     {/* Welcome Message */}
//     <div className="z-10 max-w-lg">
//       <h2 className="text-5xl font-bold leading-tight mb-4">
//         Welcome to Mediator Portal
//       </h2>
//       <p className="text-lg text-teal-100 font-light">
//         Access your mediator dashboard to manage Orders and Refunds.
//       </p>
//     </div>

//     {/* Footer Text */}
//     <div className="z-10 text-sm text-teal-200">
//       &copy; {new Date().getFullYear()} Brand Mediators. All rights reserved.
//     </div>

//     {/* Abstract background shapes - Mediator Theme */}
//     <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
//       {/* Circular shapes */}
//       <svg className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] text-emerald-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M100 0C44.77 0 0 44.77 0 100s44.77 100 100 100c55.23 0 100-44.77 100-100S155.23 0 100 0z" clipRule="evenodd"/>
//       </svg>
//       <svg className="absolute -top-1/4 -right-1/4 w-[700px] h-[700px] text-teal-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M170.7 50c9.4 12.5 14.3 28.3 14.3 45 0 16.7-4.9 32.5-14.3 45s-23.3 20-38.2 20c-14.9 0-28.8-7.5-38.2-20s-14.3-28.3-14.3-45 4.9-32.5 14.3-45 23.3-20 38.2-20c14.9 0 28.8 7.5 38.2 20z" clipRule="evenodd"/>
//       </svg>
//     </div>
//   </div>
// );

// // Mobile Header Component
// const MobileHeader: React.FC = () => (
//   <div className="flex items-center space-x-3 mb-8 lg:hidden">
//     <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
//       <Package className="h-6 w-6 text-white" />
//     </div>
//     <h1 className="text-2xl font-bold text-gray-900">Brand Mediators</h1>
//   </div>
// );

// // Registration Form Component
// interface RegistrationFormProps {
//   form: any;
//   onSubmit: (data: RegisterFormData) => Promise<void>;
//   isLoading: boolean;
//   error: string | null;
// }

// const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
//   form, 
//   onSubmit, 
//   isLoading, 
//   error 
// }) => {
//   return (
//     <div>
//       <h2 className="text-3xl font-bold text-gray-900">
//         Mediator Registration
//       </h2>
//       <p className="mt-2 text-gray-600">
//         Already have a mediator account?{' '}
//         <Link to="/mediator/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
//           Log in here
//         </Link>
//       </p>

//       <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
//         {error && <Alert type="error" message={error} />}
        
//         <div className='grid md:grid-cols-2 gap-3'>
//           <Input
//             label="Full Name"
//             type="text"
//             icon={<User className="h-5 w-5" />}
//             placeholder="Enter your full name"
//             required
//             {...form.register('name', {
//               required: 'Name is required',
//               minLength: { value: 2, message: 'Name must be at least 2 characters' }
//             })}
//             error={form.formState.errors.name?.message}
//           />
//           <Input
//             label="Nick Name"
//             required
//             type="text"
//             icon={<User className="h-5 w-5" />}
//             placeholder="Enter your nick name"
//             {...form.register('nickName')}
//             error={form.formState.errors.nickName?.message}
//           />
//         </div>

//         <Input
//           label="Email"
//           type="email"
//           icon={<Mail className="h-5 w-5" />}
//           placeholder="mediator@example.com"
//           required
//           {...form.register('email', {
//             required: 'Email is required',
//             pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i , message: 'Invalid email address' }
//           })}
//           error={form.formState.errors.email?.message}
//         />

//         <Input
//           label="Phone Number"
//           type="tel"
//           icon={<Phone className="h-5 w-5" />}
//           placeholder="e.g., 9725512345"
//           required
//           {...form.register('phone', {
//             required: 'Phone number is required',
//             pattern: { value: /^[0-9]{10}$/, message: 'Must be a 10-digit phone number' }
//           })}
//           error={form.formState.errors.phone?.message}
//         />

//         <Input
//           label="Password"
//           type={'password'}
//           icon={<Lock className="h-5 w-5" />}
//           placeholder="Password"
//           required
        
//           {...form.register('password', {
//             required: 'Password is required',
//             minLength: { value: 6, message: 'Password must be at least 6 characters' }
//           })}
//           error={form.formState.errors.password?.message}
//         />

//         <Input
//           label="Confirm Password"
//           type={'password'}
//           icon={<Lock className="h-5 w-5" />}
//           placeholder="Password"
//           required
         
//           {...form.register('confirmPassword', {
//             required: 'Please confirm your password'
//           })}
//           error={form.formState.errors.confirmPassword?.message}
//         />

//         <Button
//           type="submit"
//           variant="primary"
//           className="w-full py-3 font-semibold text-base flex items-center justify-center group"
//           style={{ backgroundColor: '#059669', color: 'white' }} // Emerald-600
//           isLoading={isLoading}
//         >
//           {isLoading ? 'Creating Mediator Account...' : (
//             <>
//               Register as Mediator
//               <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
//             </>
//           )}
//         </Button>
//       </form>
//     </div>
//   );
// };


// // Main MediatorRegister Component
// const MediatorRegister: React.FC = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const registerForm = useForm<RegisterFormData>();


//   const onSubmitRegister = async (data: RegisterFormData) => {
//     if (data.password !== data.confirmPassword) {
//       registerForm.setError('confirmPassword', { message: 'Passwords do not match' });
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await authAPI.register({
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         password: data.password,
//         nickName: data.nickName,
//         role: 'mediator' 
//       });

//       if (response.success) {
//         toast.success('Mediator registration successful! Please wait for Admin to approve your account.');
//         // setRegisteredEmail(data.email);
//         // Reset and initialize verification form
//       }else{
//         throw new Error(response.message);
//       }
//     } catch (error: any) {
//       console.error('Mediator registration error:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Mediator registration failed';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

 


//   return (
//     <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
//       <BrandingPanel />
      
//       <div className="flex flex-col justify-center py-12 px-6 sm:px-10 lg:px-16 overflow-y-auto">
//         <div className="w-full max-w-md mx-auto">
//           <MobileHeader />
          
//             <RegistrationForm
//               form={registerForm}
//               onSubmit={onSubmitRegister}
//               isLoading={isLoading}
//               error={error}
//             />
     
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MediatorRegister;



// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import bblogo from "../../assets/bblogog.png"
// import { 
//   // Package, 
//   Lock, 
//   Mail, 
//   ArrowRight, 
//   User, 
//   Phone,
//   CheckCircle,
//   Clock
// } from 'lucide-react';
// import { authAPI } from '@/utils/api';
// import Alert from '@/components/UI/Alert';
// import Input from '@/components/UI/Input';
// import Button from '@/components/UI/Button';

// // Types
// interface RegisterFormData {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
//   nickName?: string;
// }

// // Success Modal Component
// interface SuccessModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
//   const [countdown, setCountdown] = useState(10);
  
//   React.useEffect(() => {
//     if (isOpen) {
//       const timer = setInterval(() => {
//         setCountdown((prev) => {
//           if (prev <= 1) {
//             clearInterval(timer);
//             onClose();
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
      
//       return () => clearInterval(timer);
//     }
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
//         <div className="text-center">
//           {/* Success Icon */}
//           <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <CheckCircle className="h-8 w-8 text-emerald-600" />
//           </div>
          
//           {/* Title */}
//           <h3 className="text-xl font-bold text-gray-900 mb-2">
//             Registration Successful!
//           </h3>
          
//           {/* Message */}
//           <p className="text-gray-600 mb-4">
//             Your mediator account has been created successfully. Please wait for admin approval before you can access your account.
//           </p>
          
//           {/* Countdown */}
//           <div className="flex items-center justify-center space-x-2 text-sm text-emerald-600 mb-6">
//             <Clock className="h-4 w-4" />
//             <span>Redirecting to login in {countdown} seconds...</span>
//           </div>
          
//           {/* Action Button */}
//           <Button
//             onClick={onClose}
//             variant="primary"
//             className="w-full py-3 font-semibold"
//             style={{ backgroundColor: '#059669', color: 'white' }}
//           >
//             Go to Login Now
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Branding Panel Component - Mediator Theme
// const BrandingPanel: React.FC = () => (
//   <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
//     {/* Logo */}
//     <div className="flex items-center space-x-3 z-10">
//       <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg">
//         {/* <Package className="h-7 w-7 text-white" /> */}
//         <img width="70" src = {bblogo} alt = "Logo"/>
//       </div>
//       <h1 className="text-3xl font-bold">Hawk Agency</h1>
//     </div>
    
//     {/* Welcome Message */}
//     <div className="z-10 max-w-lg">
//       <h2 className="text-5xl font-bold leading-tight mb-4">
//         Welcome to Mediator Portal
//       </h2>
//       <p className="text-lg text-teal-100 font-light">
//         Access your mediator dashboard to manage Orders and Refunds.
//       </p>
//     </div>

//     {/* Footer Text */}
//     <div className="z-10 text-sm text-teal-200">
//       &copy; {new Date().getFullYear()} Brand Mediators. All rights reserved.
//     </div>

//     {/* Abstract background shapes - Mediator Theme */}
//     <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
//       {/* Circular shapes */}
//       <svg className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] text-emerald-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M100 0C44.77 0 0 44.77 0 100s44.77 100 100 100c55.23 0 100-44.77 100-100S155.23 0 100 0z" clipRule="evenodd"/>
//       </svg>
//       <svg className="absolute -top-1/4 -right-1/4 w-[700px] h-[700px] text-teal-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M170.7 50c9.4 12.5 14.3 28.3 14.3 45 0 16.7-4.9 32.5-14.3 45s-23.3 20-38.2 20c-14.9 0-28.8-7.5-38.2-20s-14.3-28.3-14.3-45 4.9-32.5 14.3-45 23.3-20 38.2-20c14.9 0 28.8 7.5 38.2 20z" clipRule="evenodd"/>
//       </svg>
//     </div>
//   </div>
// );

// // Mobile Header Component
// const MobileHeader: React.FC = () => (
//   <div className="flex items-center space-x-3 mb-8 lg:hidden">
//     <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
//       {/* <Package className="h-6 w-6 text-white" /> */}
//       <img width="70" src = {bblogo} alt = "Logo"/>
//     </div>
//     <h1 className="text-2xl font-bold text-gray-900">Brand Mediators</h1>
//   </div>
// );

// // Registration Form Component
// interface RegistrationFormProps {
//   form: any;
//   onSubmit: (data: RegisterFormData) => Promise<void>;
//   isLoading: boolean;
//   error: string | null;
// }

// const RegistrationForm: React.FC<RegistrationFormProps> = ({ 
//   form, 
//   onSubmit, 
//   isLoading, 
//   error 
// }) => {
//   return (
//     <div>
//       <h2 className="text-3xl font-bold text-gray-900">
//         Mediator Registration
//       </h2>
//       <p className="mt-2 text-gray-600">
//         Already have a mediator account?{' '}
//         <Link to="/mediator/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
//           Log in here
//         </Link>
//       </p>

//       <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-5">
//         {error && <Alert type="error" message={error} />}
        
//         <div className='grid md:grid-cols-2 gap-3'>
//           <Input
//             label="Full Name"
//             type="text"
//             icon={<User className="h-5 w-5" />}
//             placeholder="Enter your full name"
//             required
//             {...form.register('name', {
//               required: 'Name is required',
//               minLength: { value: 2, message: 'Name must be at least 2 characters' }
//             })}
//             error={form.formState.errors.name?.message}
//           />
//           <Input
//             label="Nick Name"
//             required
//             type="text"
//             icon={<User className="h-5 w-5" />}
//             placeholder="Enter your nick name"
//             {...form.register('nickName')}
//             error={form.formState.errors.nickName?.message}
//           />
//         </div>

//         <Input
//           label="Email"
//           type="email"
//           icon={<Mail className="h-5 w-5" />}
//           placeholder="mediator@example.com"
//           required
//           {...form.register('email', {
//             required: 'Email is required',
//             pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i , message: 'Invalid email address' }
//           })}
//           error={form.formState.errors.email?.message}
//         />

//         <Input
//           label="Phone Number"
//           type="tel"
//           icon={<Phone className="h-5 w-5" />}
//           placeholder="e.g., 9725512345"
//           required
//           {...form.register('phone', {
//             required: 'Phone number is required',
//             pattern: { value: /^[0-9]{10}$/, message: 'Must be a 10-digit phone number' }
//           })}
//           error={form.formState.errors.phone?.message}
//         />

//         <Input
//           label="Password"
//           type={'password'}
//           icon={<Lock className="h-5 w-5" />}
//           placeholder="Password"
//           required
        
//           {...form.register('password', {
//             required: 'Password is required',
//             minLength: { value: 6, message: 'Password must be at least 6 characters' }
//           })}
//           error={form.formState.errors.password?.message}
//         />

//         <Input
//           label="Confirm Password"
//           type={'password'}
//           icon={<Lock className="h-5 w-5" />}
//           placeholder="Password"
//           required
         
//           {...form.register('confirmPassword', {
//             required: 'Please confirm your password'
//           })}
//           error={form.formState.errors.confirmPassword?.message}
//         />

//         <Button
//           type="submit"
//           variant="primary"
//           className="w-full py-3 font-semibold text-base flex items-center justify-center group"
//           style={{ backgroundColor: '#059669', color: 'white' }} // Emerald-600
//           isLoading={isLoading}
//         >
//           {isLoading ? 'Creating Mediator Account...' : (
//             <>
//               Register as Mediator
//               <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
//             </>
//           )}
//         </Button>
//       </form>
//     </div>
//   );
// };

// // Main MediatorRegister Component
// const MediatorRegister: React.FC = () => {
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);

//   const registerForm = useForm<RegisterFormData>();

//   const onSubmitRegister = async (data: RegisterFormData) => {
//     if (data.password !== data.confirmPassword) {
//       registerForm.setError('confirmPassword', { message: 'Passwords do not match' });
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await authAPI.register({
//         name: data.name,
//         email: data.email,
//         phone: data.phone,
//         password: data.password,
//         nickName: data.nickName,
//         role: 'mediator' 
//       });

//       if (response.success) {
//         // toast.success('Mediator registration successful! Please wait for Admin to approve your account.');
//         setShowSuccessModal(true);
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error: any) {
//       console.error('Mediator registration error:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Mediator registration failed';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleModalClose = () => {
//     setShowSuccessModal(false);
//     navigate('/mediator/login');
//   };

//   return (
//     <>
//       <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
//         <BrandingPanel />
        
//         <div className="flex flex-col justify-center py-12 px-6 sm:px-10 lg:px-16 overflow-y-auto">
//           <div className="w-full max-w-md mx-auto">
//             <MobileHeader />
            
//             <RegistrationForm
//               form={registerForm}
//               onSubmit={onSubmitRegister}
//               isLoading={isLoading}
//               error={error}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Success Modal */}
//       <SuccessModal 
//         isOpen={showSuccessModal} 
//         onClose={handleModalClose} 
//       />
//     </>
//   );
// };

// export default MediatorRegister;


//to add bank and other details
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import bblogo from "../../assets/bblogog.png"
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  User, 
  Phone,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Building,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { authAPI } from '@/utils/api';
import Alert from '@/components/UI/Alert';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

// 1. Updated Interface to include new fields
interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  nickName?: string;
  // New Fields
  aadhaarNumber: string;
  aadhaarImage: FileList; // Capture file input
  panNumber: string;
  upiId: string;
  bankName: string;
  ifscCode: string;
  accountNumber: string;
  confirmAccountNumber: string;
  communityLink: string;
}

// Success Modal Component
interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  const [countdown, setCountdown] = useState(10);
  
  React.useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
          <p className="text-gray-600 mb-4">
            Your mediator account has been created. Please wait for admin approval before you can access your account.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-emerald-600 mb-6">
            <Clock className="h-4 w-4" />
            <span>Redirecting to login in {countdown} seconds...</span>
          </div>
          <Button onClick={onClose} variant="primary" className="w-full py-3 font-semibold" style={{ backgroundColor: '#059669', color: 'white' }}>
            Go to Login Now
          </Button>
        </div>
      </div>
    </div>
  );
};

// Branding Panel Component
const BrandingPanel: React.FC = () => (
  <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
    <div className="flex items-center space-x-3 z-10">
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg">
        <img width="70" src = {bblogo} alt = "Logo"/>
      </div>
      <h1 className="text-3xl font-bold">Hawk Agency</h1>
    </div>
    <div className="z-10 max-w-lg">
      <h2 className="text-5xl font-bold leading-tight mb-4">Welcome to Mediator Portal</h2>
      <p className="text-lg text-teal-100 font-light">Access your dashboard to manage Orders and Refunds.</p>
    </div>
    <div className="z-10 text-sm text-teal-200">&copy; {new Date().getFullYear()} Brand Mediators. All rights reserved.</div>
    <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
      <svg className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] text-emerald-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" d="M100 0C44.77 0 0 44.77 0 100s44.77 100 100 100c55.23 0 100-44.77 100-100S155.23 0 100 0z" clipRule="evenodd"/>
      </svg>
    </div>
  </div>
);

// Mobile Header
const MobileHeader: React.FC = () => (
  <div className="flex items-center space-x-3 mb-8 lg:hidden">
    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
      <img width="70" src = {bblogo} alt = "Logo"/>
    </div>
    <h1 className="text-2xl font-bold text-gray-900">Brand Mediators</h1>
  </div>
);

// Registration Form
interface RegistrationFormProps {
  form: any;
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ form, onSubmit, isLoading, error }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900">Mediator Registration</h2>
      <p className="mt-2 text-gray-600">
        Already have an account?{' '}
        <Link to="/mediator/login" className="font-semibold text-emerald-600 hover:text-emerald-700">Log in here</Link>
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
        {error && <Alert type="error" message={error} />}
        
        {/* --- Section 1: Basic Info --- */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-4 uppercase tracking-wide">Personal Details</h3>
          <div className='grid md:grid-cols-2 gap-3 mb-3'>
            <Input
              label="Full Name"
              icon={<User className="h-5 w-5" />}
              placeholder="Enter full name"
              {...form.register('name', { required: 'Name is required' })}
              error={form.formState.errors.name?.message}
            />
            <Input
              label="Nick Name"
              icon={<User className="h-5 w-5" />}
              placeholder="Enter nick name"
              {...form.register('nickName')}
              error={form.formState.errors.nickName?.message}
            />
          </div>
          <Input
            label="Email"
            type="email"
            icon={<Mail className="h-5 w-5" />}
            placeholder="email@example.com"
            {...form.register('email', { required: 'Email is required' })}
            error={form.formState.errors.email?.message}
            className="mb-3"
          />
          <Input
            label="Phone Number"
            type="tel"
            icon={<Phone className="h-5 w-5" />}
            placeholder="9876543210"
            {...form.register('phone', { required: 'Phone required', pattern: { value: /^[0-9]{10}$/, message: '10 digits only' } })}
            error={form.formState.errors.phone?.message}
          />
        </div>

        {/* --- Section 2: Identity Proofs --- */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-4 uppercase tracking-wide">Identity Proofs</h3>
          <div className='grid md:grid-cols-2 gap-3'>
            <Input
              label="Aadhaar Number"
              icon={<FileText className="h-5 w-5" />}
              placeholder="12-digit Aadhaar"
              {...form.register('aadhaarNumber', { 
                required: 'Aadhaar is required',
                pattern: { value: /^[0-9]{12}$/, message: 'Must be 12 digits' } 
              })}
              error={form.formState.errors.aadhaarNumber?.message}
            />
            <Input
              label="PAN Number"
              icon={<FileText className="h-5 w-5" />}
              placeholder="ABCDE1234F"
              {...form.register('panNumber', { 
                required: 'PAN is required',
                pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: 'Invalid PAN format' }
              })}
              error={form.formState.errors.panNumber?.message}
            />
          </div>
          
          {/* File Upload for Aadhaar */}
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Aadhaar Card (Image/PDF)</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG or PDF</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*,application/pdf"
                  {...form.register('aadhaarImage', { required: 'Aadhaar image is required' })} 
                />
              </label>
            </div>
            {form.formState.errors.aadhaarImage && (
              <p className="mt-1 text-xs text-red-500">{form.formState.errors.aadhaarImage.message}</p>
            )}
            {form.watch('aadhaarImage') && form.watch('aadhaarImage')[0] && (
               <p className="mt-1 text-sm text-green-600">Selected: {form.watch('aadhaarImage')[0].name}</p>
            )}
          </div>
        </div>

        {/* --- Section 3: Bank Details --- */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-4 uppercase tracking-wide">Bank Details</h3>
          <div className='grid md:grid-cols-2 gap-3 mb-3'>
            <Input
              label="Bank Name"
              icon={<Building className="h-5 w-5" />}
              placeholder="e.g. HDFC Bank"
              {...form.register('bankName', { required: 'Bank Name is required' })}
              error={form.formState.errors.bankName?.message}
            />
            <Input
              label="IFSC Code"
              icon={<Building className="h-5 w-5" />}
              placeholder="HDFC0001234"
              {...form.register('ifscCode', { required: 'IFSC is required' })}
              error={form.formState.errors.ifscCode?.message}
            />
          </div>
          <div className='grid md:grid-cols-2 gap-3 mb-3'>
            <Input
              label="Account Number"
              type="text" // using text to avoid removing leading zeros
              icon={<CreditCard className="h-5 w-5" />}
              placeholder="Account No."
              {...form.register('accountNumber', { required: 'Account Number is required' })}
              error={form.formState.errors.accountNumber?.message}
            />
            {/* <Input
              label="Confirm Account Number"
              type="text"
              icon={<CreditCard className="h-5 w-5" />}
              placeholder="Re-enter Account No."
              {...form.register('accountNumber', { required: 'Please confirm account number' })}
              error={form.formState.errors.confirmAccountNumber?.message}
            /> */}
          </div>
          <Input
            label="UPI ID"
            icon={<CreditCard className="h-5 w-5" />}
            placeholder="username@upi"
            {...form.register('upiId', { required: 'UPI ID is required' })}
            error={form.formState.errors.upiId?.message}
          />
        </div>

        {/* --- Section 4: Professional --- */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-4 uppercase tracking-wide">Community</h3>
          <Input
            label="Group / Community Link"
            icon={<LinkIcon className="h-5 w-5" />}
            placeholder="e.g. WhatsApp/Telegram Group Link"
            {...form.register('communityLink', { required: 'Community link is required' })}
            error={form.formState.errors.communityLink?.message}
          />
        </div>

        {/* --- Section 5: Security --- */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
           <h3 className="text-md font-semibold text-gray-700 mb-4 uppercase tracking-wide">Security</h3>
           <div className='grid md:grid-cols-2 gap-3'>
            <Input
              label="Password"
              type={'password'}
              icon={<Lock className="h-5 w-5" />}
              placeholder="******"
              {...form.register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })}
              error={form.formState.errors.password?.message}
            />
            <Input
              label="Confirm Password"
              type={'password'}
              icon={<Lock className="h-5 w-5" />}
              placeholder="******"
              {...form.register('confirmPassword', { required: 'Confirm password' })}
              error={form.formState.errors.confirmPassword?.message}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-4 font-bold text-lg flex items-center justify-center group shadow-lg"
          style={{ backgroundColor: '#059669', color: 'white' }}
          isLoading={isLoading}
        >
          {isLoading ? 'Creating Mediator Account...' : (
            <>
              Register as Mediator
              <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

// Main Component
const MediatorRegister: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const registerForm = useForm<RegisterFormData>();

  const onSubmitRegister = async (data: RegisterFormData) => {
    // 1. Validation Checks
    if (data.password !== data.confirmPassword) {
      registerForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }
    if (data.accountNumber !== data.confirmAccountNumber) {
      registerForm.setError('confirmAccountNumber', { message: 'Account numbers do not match' });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 2. Prepare FormData for File Upload
      // We must use FormData because we are sending an Image + Text fields
      const formData = new FormData();
      
      // Append text fields
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('phone', data.phone);
      formData.append('password', data.password);
      formData.append('nickName', data.nickName || '');
      formData.append('role', 'mediator');
      
      // Append New Fields
      formData.append('aadhaarNumber', data.aadhaarNumber);
      formData.append('panNumber', data.panNumber);
      formData.append('upiId', data.upiId);
      formData.append('bankName', data.bankName);
      formData.append('ifscCode', data.ifscCode);
      formData.append('accountNumber', data.accountNumber);
      formData.append('communityLink', data.communityLink);

      // Append File (Check if file exists)
      if (data.aadhaarImage && data.aadhaarImage[0]) {
        formData.append('aadhaarImage', data.aadhaarImage[0]);
      }

      // 3. API Call
      // IMPORTANT: Your authAPI.register needs to handle FormData, 
      // or you should create a specific 'registerMediator' endpoint that accepts content-type: multipart/form-data
      const response = await authAPI.register(formData); 

      if (response.success) {
        setShowSuccessModal(true);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/mediator/login');
  };

  return (
    <>
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
        <BrandingPanel />
        <div className="flex flex-col justify-center py-12 px-6 sm:px-10 lg:px-16 overflow-y-auto">
          <div className="w-full max-w-xl mx-auto">
            <MobileHeader />
            <RegistrationForm
              form={registerForm}
              onSubmit={onSubmitRegister}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
      <SuccessModal isOpen={showSuccessModal} onClose={handleModalClose} />
    </>
  );
};

export default MediatorRegister;