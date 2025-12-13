// import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useNavigate, Link } from 'react-router-dom';
// import { toast, Toaster } from 'react-hot-toast';
// import { 
//   Lock, 
//   Mail, 
//   ArrowRight, 
//   User, 
//   Phone,
//   CheckCircle,
//   Clock,
//   ArrowLeft
// } from 'lucide-react';
// import bblogo from "../../assets/bblogog.png";
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
//     <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
//       <div className="bg-[#1f2937] border border-[#e46033] rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all relative">
//         <div className="text-center">
//           {/* Success Icon */}
//           <div className="w-16 h-16 bg-[#e46033]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e46033]">
//             <CheckCircle className="h-8 w-8 text-[#e46033]" />
//           </div>
          
//           {/* Title */}
//           <h3 className="text-xl font-bold text-white mb-2">
//             Registration Successful!
//           </h3>
          
//           {/* Message */}
//           <p className="text-gray-300 mb-4">
//             Your mediator account has been created successfully. Please wait for admin approval before you can access your account.
//           </p>
          
//           {/* Countdown */}
//           <div className="flex items-center justify-center space-x-2 text-sm text-[#e46033] mb-6">
//             <Clock className="h-4 w-4" />
//             <span>Redirecting to login in {countdown} seconds...</span>
//           </div>
          
//           {/* Action Button */}
//           <Button
//             onClick={onClose}
//             variant="primary"
//             className="w-full py-3 font-semibold bg-[#e46033] text-white hover:bg-[#c9522b]"
//           >
//             Go to Login Now
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MediatorRegister: React.FC = () => {
//   const navigate = useNavigate();
//   // State for animation toggle (false = Register Form, true = Go To Login Info)
//   const [isActive, setIsActive] = useState(false);
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

//   const handleLoginClick = () => {
//     setIsActive(true); // Slide to the "Go To Login" info panel
//   };

//   const handleBackToRegister = () => {
//     setIsActive(false); // Slide back to Register form
//   };

//   const handleGoToLogin = () => {
//     navigate('/mediator/login');
//   };

//   return (
//     <div className="auth-body">
//       <Toaster />
      
//       {/* Container Height increased to 750px to accommodate the larger form */}
//       <div className={`container ${isActive ? 'active' : ''}`}>
        
//         {/* Animated Shapes - Orange/Emerald Theme */}
//         <div className="curved-shape"></div>
//         <div className="curved-shape2"></div>

//         {/* --- PANEL 1: REGISTER FORM (Visible by default on Left) --- */}
//         {/* We use class 'Login' for the default view to match the CSS animation logic provided, but put Register content inside */}
//         <div className="form-box Login">
//           <div className="logo-container animation" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>
//              <img src={bblogo} alt="Logo" className="w-16 mx-auto mb-2" />
//           </div>
//           <h2 className="animation" style={{ '--D': 0, '--S': 21 } as React.CSSProperties}>Create Account</h2>
          
//           <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="w-full px-4 overflow-y-auto max-h-[500px] scrollbar-hide">
//             {error && !isActive && <Alert type="error" message={error} />}
            
//             {/* Grid for Name & Nickname */}
//             <div className="flex gap-4 animation" style={{ '--D': 1, '--S': 22 } as React.CSSProperties}>
//                 <div className="input-box flex-1">
//                     <Input
//                         label="Full Name"
//                         type="text"
//                         icon={<User className="h-5 w-5" />}
//                         placeholder="John Doe"
//                         required
//                         {...registerForm.register('name', {
//                         required: 'Required',
//                         minLength: { value: 2, message: 'Min 2 chars' }
//                         })}
//                         error={registerForm.formState.errors.name?.message}
//                     />
//                 </div>
//                 <div className="input-box flex-1">
//                     <Input
//                         label="Nick Name"
//                         required
//                         type="text"
//                         icon={<User className="h-5 w-5" />}
//                         placeholder="Johnny"
//                         {...registerForm.register('nickName')}
//                         error={registerForm.formState.errors.nickName?.message}
//                     />
//                 </div>
//             </div>

//             <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
//               <Input
//                 label="Email Address"
//                 type="email"
//                 icon={<Mail className="h-5 w-5" />}
//                 placeholder="mediator@example.com"
//                 required
//                 {...registerForm.register('email', {
//                   required: 'Email is required',
//                   pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i , message: 'Invalid email' }
//                 })}
//                 error={registerForm.formState.errors.email?.message}
//               />
//             </div>

//             <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
//                 <Input
//                     label="Phone"
//                     type="tel"
//                     icon={<Phone className="h-5 w-5" />}
//                     placeholder="9876543210"
//                     required
//                     {...registerForm.register('phone', {
//                     required: 'Phone is required',
//                     pattern: { value: /^[0-9]{10}$/, message: '10 digits' }
//                     })}
//                     error={registerForm.formState.errors.phone?.message}
//                 />
//             </div>

//             <div className="flex gap-4 animation" style={{ '--D': 3, '--S': 24 } as React.CSSProperties}>
//                 <div className="input-box flex-1">
//                     <Input
//                         label="Password"
//                         type={'password'}
//                         icon={<Lock className="h-5 w-5" />}
//                         placeholder="••••••"
//                         required
//                         {...registerForm.register('password', {
//                         required: 'Required',
//                         minLength: { value: 6, message: 'Min 6 chars' }
//                         })}
//                         error={registerForm.formState.errors.password?.message}
//                     />
//                 </div>
//                 <div className="input-box flex-1">
//                     <Input
//                         label="Confirm"
//                         type={'password'}
//                         icon={<Lock className="h-5 w-5" />}
//                         placeholder="••••••"
//                         required
//                         {...registerForm.register('confirmPassword', {
//                         required: 'Required'
//                         })}
//                         error={registerForm.formState.errors.confirmPassword?.message}
//                     />
//                 </div>
//             </div>

//             <div className="input-box animation mt-2" style={{ '--D': 4, '--S': 25 } as React.CSSProperties}>
//               <Button
//                 type="submit"
//                 variant="primary"
//                 className="w-full py-3 font-semibold text-base flex items-center justify-center group bg-[#e46033] text-white hover:bg-[#c9522b]"
//                 isLoading={isLoading}
//               >
//                 {isLoading ? 'Creating...' : (
//                   <>
//                     Register as Mediator
//                     <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
//                   </>
//                 )}
//               </Button>
//             </div>

//             <div className="regi-link animation" style={{ '--D': 5, '--S': 26 } as React.CSSProperties}>
//               <p>
//                 Already have an account? <br />
//                 <span className="SignUpLink text-[#e46033] font-bold hover:underline cursor-pointer" onClick={handleLoginClick}>Sign In</span>
//               </p>
//             </div>
//           </form>
//         </div>

//         {/* --- INFO PANEL 1: REGISTER WELCOME (Visible on right when Register is active) --- */}
//         <div className="info-content Login">
//           <h2 className="animation" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>HAWK AGENCY</h2>
//           <p className="animation" style={{ '--D': 1, '--S': 21 } as React.CSSProperties}>
//             Join our network of mediators. Create an account to manage orders, process refunds, and track your performance.
//           </p>
//         </div>

//         {/* --- PANEL 2: GO TO LOGIN (Hidden until active - Right Side) --- */}
//         {/* We use class 'Register' for the secondary view */}
//         <div className="form-box Register"> 
//           <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>Welcome Back</h2>
          
//           <div className="w-full px-8 text-center">
//              <p className="animation mb-6 text-gray-200" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
//                To access your dashboard, please login with your personal info.
//              </p>

//              <div className="input-box animation" style={{ '--li': 19, '--S': 2 } as React.CSSProperties}>
//                 <Button 
//                     onClick={handleGoToLogin}
//                     className="w-full py-3 font-semibold text-base flex items-center justify-center group bg-[#e46033] text-white hover:bg-[#c9522b]"
//                 >
//                     Go to Login Page
//                     <ArrowRight className="h-5 w-5 ml-2" />
//                 </Button>
//              </div>

//              <div className="regi-link animation mt-6" style={{ '--li': 20, '--S': 3 } as React.CSSProperties}>
//                 <p>
//                   Need to register? <br />
//                   <span className="SignInLink text-[#e46033] font-bold hover:underline cursor-pointer flex items-center justify-center gap-1" onClick={handleBackToRegister}>
//                     <ArrowLeft size={16}/> Back to Register
//                   </span>
//                 </p>
//              </div>
//           </div>
//         </div>

//         {/* --- INFO PANEL 2: LOGIN INFO (Visible on left when Login info is active) --- */}
//         <div className="info-content Register">
//           <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>Have an Account?</h2>
//           <p className="animation" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
//              If you are already a registered mediator, click the button to sign in.
//           </p>
//         </div>

//       </div>

//       <SuccessModal 
//         isOpen={showSuccessModal} 
//         onClose={handleModalClose} 
//       />

//       {/* --- CSS STYLES --- */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

//         .auth-body {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//           font-family: 'Poppins', sans-serif;
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           min-height: 100vh;
//           background: #fff; 
//         }

//         /* Hide scrollbar for form but allow scroll */
//         .scrollbar-hide::-webkit-scrollbar {
//             display: none;
//         }
//         .scrollbar-hide {
//             -ms-overflow-style: none;
//             scrollbar-width: none;
//         }

//         .container {
//           position: relative;
//           width: 850px;
//           height: 750px; /* Increased height for registration form */
//           background: #1f2937; 
//           border: 2px solid #e46033;
//           box-shadow: 0 0 25px #e46033;
//           overflow: hidden;
//           border-radius: 20px;
//         }

//         .container .form-box {
//           position: absolute;
//           top: 0;
//           width: 50%;
//           height: 100%;
//           display: flex;
//           justify-content: center;
//           flex-direction: column;
//           align-items: center;
//         }

//         .form-box.Login {
//           left: 0;
//           padding: 0 40px;
//         }

//         /* Animation Logic */
//         .form-box.Login .animation {
//           transform: translateX(0%);
//           transition: .7s;
//           opacity: 1;
//           transition-delay: calc(.1s * var(--S));
//         }

//         .container.active .form-box.Login .animation {
//           transform: translateX(-120%);
//           opacity: 0;
//           transition-delay: calc(.1s * var(--D));
//         }

//         .form-box.Register {
//           right: 0;
//           padding: 0 60px;
//         }

//         .form-box.Register .animation {
//           transform: translateX(120%);
//           transition: .7s ease;
//           opacity: 0;
//           filter: blur(10px);
//           transition-delay: calc(.1s * var(--S));
//         }

//         .container.active .form-box.Register .animation {
//           transform: translateX(0%);
//           opacity: 1;
//           filter: blur(0);
//           transition-delay: calc(.1s * var(--li));
//         }

//         .form-box h2 {
//           font-size: 32px;
//           text-align: center;
//           margin-bottom: 20px;
//           color: white;
//         }

//         .form-box .input-box {
//           position: relative;
//           width: 100%;
//           margin-bottom: 20px;
//         }
        
//         /* Overriding input styles for this theme */
//         .input-box input {
//           width: 100%;
//           height: 100%;
//           background: transparent;
//           border: none;
//           outline: none;
//           font-size: 16px;
//           color: #f4f4f4;
//           font-weight: 600;
//           border-bottom: 2px solid #fff;
//           padding-right: 23px;
//           transition: .5s;
//         }

//         .input-box input:focus {
//             border-bottom: 2px solid #e46033 !important;
//         }
//         .input-box label {
//             color: #9ca3af !important;
//         }
//         .input-box input:focus ~ label,
//         .input-box input:valid ~ label {
//             color: #e46033 !important;
//         }

//         .regi-link {
//           font-size: 14px;
//           text-align: center;
//           margin-top: 10px;
//           color: #d1d5db;
//         }

//         .regi-link a, .regi-link span {
//           text-decoration: none;
//           color: #e46033;
//           font-weight: 600;
//           cursor: pointer;
//         }

//         .regi-link a:hover, .regi-link span:hover {
//           text-decoration: underline;
//         }

//         /* Info Content Styles */
//         .info-content {
//           position: absolute;
//           top: 0;
//           height: 100%;
//           width: 50%;
//           display: flex;
//           justify-content: center;
//           flex-direction: column;
//           color: white;
//         }

//         .info-content.Login {
//           right: 0;
//           text-align: right;
//           padding: 0 40px 60px 150px;
//         }

//         .info-content.Login .animation {
//           transform: translateX(0);
//           transition: .7s ease;
//           transition-delay: calc(.1s * var(--S));
//           opacity: 1;
//           filter: blur(0px);
//         }

//         .container.active .info-content.Login .animation {
//           transform: translateX(120%);
//           opacity: 0;
//           filter: blur(10px);
//           transition-delay: calc(.1s * var(--D));
//         }

//         .info-content.Register {
//           left: 0;
//           text-align: left;
//           padding: 0 150px 60px 38px;
//           pointer-events: none;
//         }

//         .info-content.Register .animation {
//           transform: translateX(-120%);
//           transition: .7s ease;
//           opacity: 0;
//           filter: blur(10px);
//           transition-delay: calc(.1s * var(--S));
//         }

//         .container.active .info-content.Register .animation {
//           transform: translateX(0%);
//           opacity: 1;
//           filter: blur(0);
//           transition-delay: calc(.1s * var(--li));
//         }

//         .info-content h2 {
//           text-transform: uppercase;
//           font-size: 36px;
//           line-height: 1.3;
//           font-weight: 700;
//         }

//         .info-content p {
//           font-size: 16px;
//           margin-top: 10px;
//         }

//         /* Curved Shapes - Orange Theme */
//         .container .curved-shape {
//           position: absolute;
//           right: 0;
//           top: -5px;
//           height: 800px;
//           width: 850px;
//           background: linear-gradient(45deg, #111827, #e46033);
//           transform: rotate(10deg) skewY(40deg);
//           transform-origin: bottom right;
//           transition: 1.5s ease;
//           transition-delay: 1.6s;
//         }

//         .container.active .curved-shape {
//           transform: rotate(0deg) skewY(0deg);
//           transition-delay: .5s;
//         }
        
//         .container .curved-shape2 {
//           position: absolute;
//           left: 250px;
//           top: 100%;
//           height: 900px;
//           width: 850px;
//           background: #25252b;
//           border-top: 3px solid #e46033;
//           transform: rotate(0deg) skewY(0deg);
//           transform-origin: bottom left;
//           transition: 1.5s ease;
//           transition-delay: .5s;
//         }

//         .container.active .curved-shape2 {
//           transform: rotate(-11deg) skewY(-41deg);
//           transition-delay: 1.2s;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MediatorRegister;

// \\pooja 
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  User, 
  Phone,
  CheckCircle,
  Clock
} from 'lucide-react';
import bblogo from "../../assets/bblogog.png";
import { authAPI } from '@/utils/api';
import Alert from '@/components/UI/Alert';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

// Types
interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  nickName?: string;
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[#1f2937] border border-[#e46033] rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all relative">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#e46033]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e46033]">
            <CheckCircle className="h-8 w-8 text-[#e46033]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Registration Successful!</h3>
          <p className="text-gray-300 mb-4">
            Your mediator account has been created successfully. Please wait for admin approval before you can access your account.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-[#e46033] mb-6">
            <Clock className="h-4 w-4" />
            <span>Redirecting to login in {countdown} seconds...</span>
          </div>
          <Button
            onClick={onClose}
            variant="primary"
            className="w-full py-3 font-semibold bg-[#e46033] text-white hover:bg-[#c9522b]"
          >
            Go to Login Now
          </Button>
        </div>
      </div>
    </div>
  );
};

const MediatorRegister: React.FC = () => {
  const navigate = useNavigate();
  // State for animation toggle
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const registerForm = useForm<RegisterFormData>();

  const onSubmitRegister = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      registerForm.setError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.register({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        nickName: data.nickName,
        role: 'mediator' 
      });

      if (response.success) {
        setShowSuccessModal(true);
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Mediator registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Mediator registration failed';
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

  // --- MODIFIED FUNCTION ---
  const handleLoginClick = () => {
    // 1. Trigger Animation
    setIsActive(true); 
    
    // 2. Wait for animation (700ms) then Navigate
    setTimeout(() => {
        navigate('/mediator/login');
    }, 1800);
  };

  return (
    <div className="auth-body">
      <Toaster />
      
      <div className={`container ${isActive ? 'active' : ''}`}>
        
        {/* Animated Shapes */}
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>

        {/* --- PANEL 1: REGISTER FORM (Visible by default on Left) --- */}
        <div className="form-box Login">
          <div className="logo-container animation" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>
             <img src={bblogo} alt="Logo" className="w-16 mx-auto mb-2" />
          </div>
          <h2 className="animation" style={{ '--D': 0, '--S': 21 } as React.CSSProperties}>Create Account</h2>
          
          <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="w-full px-4 overflow-y-auto max-h-[500px] scrollbar-hide">
            {error && !isActive && <Alert type="error" message={error} />}
            
            <div className="flex gap-4 animation" style={{ '--D': 1, '--S': 22 } as React.CSSProperties}>
                <div className="input-box flex-1">
                    <Input
                        label="Full Name"
                        type="text"
                        icon={<User className="h-5 w-5" />}
                        placeholder="John Doe"
                        required
                        {...registerForm.register('name', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' } })}
                        error={registerForm.formState.errors.name?.message}
                    />
                </div>
                <div className="input-box flex-1">
                    <Input
                        label="Nick Name"
                        required
                        type="text"
                        icon={<User className="h-5 w-5" />}
                        placeholder="Johnny"
                        {...registerForm.register('nickName')}
                        error={registerForm.formState.errors.nickName?.message}
                    />
                </div>
            </div>

            <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
              <Input
                label="Email Address"
                type="email"
                icon={<Mail className="h-5 w-5" />}
                placeholder="mediator@example.com"
                required
                {...registerForm.register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i , message: 'Invalid email' } })}
                error={registerForm.formState.errors.email?.message}
              />
            </div>

            <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
                <Input
                    label="Phone"
                    type="tel"
                    icon={<Phone className="h-5 w-5" />}
                    placeholder="9876543210"
                    required
                    {...registerForm.register('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{10}$/, message: '10 digits' } })}
                    error={registerForm.formState.errors.phone?.message}
                />
            </div>

            <div className="flex gap-4 animation" style={{ '--D': 3, '--S': 24 } as React.CSSProperties}>
                <div className="input-box flex-1">
                    <Input
                        label="Password"
                        type={'password'}
                        icon={<Lock className="h-5 w-5" />}
                        placeholder="••••••"
                        required
                        {...registerForm.register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                        error={registerForm.formState.errors.password?.message}
                    />
                </div>
                <div className="input-box flex-1">
                    <Input
                        label="Confirm"
                        type={'password'}
                        icon={<Lock className="h-5 w-5" />}
                        placeholder="••••••"
                        required
                        {...registerForm.register('confirmPassword', { required: 'Required' })}
                        error={registerForm.formState.errors.confirmPassword?.message}
                    />
                </div>
            </div>

            <div className="input-box animation mt-2" style={{ '--D': 4, '--S': 25 } as React.CSSProperties}>
              <Button
                type="submit"
                variant="primary"
                style={{ backgroundColor: '#e46033', color: 'white' }}
                className="w-full py-3 font-semibold text-base flex items-center justify-center group bg-[#e46033] text-white hover:bg-[#c9522b]"
                isLoading={isLoading}
              >
                {isLoading ? 'Creating...' : (
                  <>
                    Register as Mediator
                    <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>

            <div className="regi-link animation" style={{ '--D': 5, '--S': 26 } as React.CSSProperties}>
              <p>
                Already have an account? <br />
                {/* Triggers animation + redirection */}
                <span className="SignUpLink text-[#e46033] font-bold hover:underline cursor-pointer" onClick={handleLoginClick}>Sign In</span>
              </p>
            </div>
          </form>
        </div>

        {/* --- INFO PANEL 1: REGISTER WELCOME (Visible on right when Register is active) --- */}
        <div className="info-content Login">
          <h2 className="animation" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>HAWK AGENCY</h2>
          <p className="animation" style={{ '--D': 1, '--S': 21 } as React.CSSProperties}>
            Join our network of mediators. Create an account to manage orders, process refunds, and track your performance.
          </p>
        </div>

        {/* --- PANEL 2: REDIRECT (Hidden until active - Right Side) --- */}
        <div className="form-box Register"> 
          <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>Redirecting...</h2>
          
          <div className="w-full px-8 text-center">
             <p className="animation mb-6 text-gray-200" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
               Please wait while we take you to the Login page.
             </p>
          </div>
        </div>

        {/* --- INFO PANEL 2: LOGIN INFO (Visible on left when Login info is active) --- */}
        <div className="info-content Register">
          <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>Have an Account?</h2>
          <p className="animation" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
              Redirecting you to the sign in page...
          </p>
        </div>

      </div>

      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={handleModalClose} 
      />

      {/* --- CSS STYLES (No changes needed here, kept for completeness) --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        .auth-body {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #25252b;
          color: #fff;
        }

        .container {
          position: relative;
          width: 750px;
          height: 450px;
          border: 2px solid #e46033;
          box-shadow: 0 0 25px #e46033;
          overflow: hidden;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

      //  .container {
      //     position: relative;
      //     width: 850px;
      //     height: 550px;
      //     background: #1f2937;
      //     border: 2px solid #e46033;
      //     box-shadow: 0 0 25px #e46033;
      //     overflow: hidden;
      //     border-radius: 20px;
      //   }


        .container .form-box {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
        }

        .form-box.Login {
          left: 0;
          padding: 0 40px;
        }

        .form-box.Login .animation {
          transform: translateX(0%);
          transition: .7s;
          opacity: 1;
          transition-delay: calc(.1s * var(--S));
        }

        .container.active .form-box.Login .animation {
          transform: translateX(-120%);
          opacity: 0;
          transition-delay: calc(.1s * var(--D));
        }

        .form-box.Register {
          right: 0;
          padding: 0 60px;
        }

        .form-box.Register .animation {
          transform: translateX(120%);
          transition: .7s ease;
          opacity: 0;
          filter: blur(10px);
          transition-delay: calc(.1s * var(--S));
        }

        .container.active .form-box.Register .animation {
          transform: translateX(0%);
          opacity: 1;
          filter: blur(0);
          transition-delay: calc(.1s * var(--li));
        }

        .form-box h2 {
          font-size: 32px;
          text-align: center;
          margin-bottom: 20px;
          color: white;
        }

        .form-box .input-box {
          position: relative;
          width: 100%;
          margin-bottom: 20px;
        }
        
        .input-box input {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 16px;
          color: #f4f4f4;
          font-weight: 600;
          border-bottom: 2px solid #fff;
          padding-right: 23px;
          transition: .5s;
        }

        .input-box input:focus {
            border-bottom: 2px solid #e46033 !important;
        }
        .input-box label {
            color: #9ca3af !important;
        }
        .input-box input:focus ~ label,
        .input-box input:valid ~ label {
            color: #e46033 !important;
        }

        .regi-link {
          font-size: 14px;
          text-align: center;
          margin-top: 10px;
          color: #d1d5db;
        }

        .regi-link a, .regi-link span {
          text-decoration: none;
          color: #e46033;
          font-weight: 600;
          cursor: pointer;
        }

        .regi-link a:hover, .regi-link span:hover {
          text-decoration: underline;
        }

        .info-content {
          position: absolute;
          top: 0;
          height: 100%;
          width: 50%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          color: white;
        }

        .info-content.Login {
          right: 0;
          text-align: right;
          padding: 0 40px 60px 150px;
        }

        .info-content.Login .animation {
          transform: translateX(0);
          transition: .7s ease;
          transition-delay: calc(.1s * var(--S));
          opacity: 1;
          filter: blur(0px);
        }

        .container.active .info-content.Login .animation {
          transform: translateX(120%);
          opacity: 0;
          filter: blur(10px);
          transition-delay: calc(.1s * var(--D));
        }

        .info-content.Register {
          left: 0;
          text-align: left;
          padding: 0 150px 60px 38px;
          pointer-events: none;
        }

        .info-content.Register .animation {
          transform: translateX(-120%);
          transition: .7s ease;
          opacity: 0;
          filter: blur(10px);
          transition-delay: calc(.1s * var(--S));
        }

        .container.active .info-content.Register .animation {
          transform: translateX(0%);
          opacity: 1;
          filter: blur(0);
          transition-delay: calc(.1s * var(--li));
        }

        .info-content h2 {
          text-transform: uppercase;
          font-size: 36px;
          line-height: 1.3;
          font-weight: 700;
        }

        .info-content p {
          font-size: 16px;
          margin-top: 10px;
        }
.container .curved-shape {
          position: absolute;
          right: 0;
          top: -5px;
          height: 600px;
          width: 850px;
          background: linear-gradient(45deg, #25252b, #e46033);
          transform: rotate(10deg) skewY(40deg);
          transform-origin: bottom right;
          transition: 1.5s ease;
          transition-delay: 1.6s;
        }

        .container.active .curved-shape {
          transform: rotate(0deg) skewY(0deg);
          transition-delay: .5s;
        }

        .container .curved-shape2 {
          position: absolute;
          left: 250px;
          top: 100%;
          height: 700px;
          width: 850px;
          background: #25252b;
          border-top: 3px solid #e46033;
          transform: rotate(0deg) skewY(0deg);
          transform-origin: bottom left;
          transition: 1.5s ease;
          transition-delay: .5s;
        }

        .container.active .curved-shape2 {
          transform: rotate(-11deg) skewY(-41deg);
          transition-delay: 1.2s;
        }
      `}</style>
    </div>
  );
};

export default MediatorRegister;