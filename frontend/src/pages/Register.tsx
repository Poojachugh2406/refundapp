


// import React, { useState } from 'react';
// import { useForm, FormProvider } from 'react-hook-form';
// import { useNavigate, Link } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { 
//   // Package, 
//   Lock, 
//   Mail, 
//   ArrowRight, 
//   User, 
//   Phone, 
//   CheckCircle,
//   ArrowLeft
// } from 'lucide-react';
// import bblogo from "../assets/bblogog.png"
// import { authAPI } from '@/utils/api';
// import Alert from '@/components/UI/Alert';
// import Input from '@/components/UI/Input';
// import Button from '@/components/UI/Button';
// import OtpInput from '@/components/UI/OtpInput';

// // Types
// interface RegisterFormData {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
//   confirmPassword: string;
//   nickName?: string;
// }

// interface VerifyFormData {
//   email: string;
//   otp: string[];
// }

// // Branding Panel Component
// const BrandingPanel: React.FC = () => (
//   <div className="relative hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-orange-700 to-indigo-600 text-white">
//     <div className="flex items-center space-x-3 z-10">
//       <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-lg">
//         {/* <Package className="h-7 w-7 text-white" /> */}
//         <img width="70" src = {bblogo} alt = "Logo"/>
//       </div>
//       <h1 className="text-3xl font-bold">Hawk Agency</h1>
//     </div>
    
//     <div className="z-10 max-w-lg">
//       <h2 className="text-5xl font-bold leading-tight mb-4">
//         Start your journey with us.
//       </h2>
//       <p className="text-lg text-indigo-100 font-light">
//         Create an account to get access to your dashboard and manage your orders and refund forms.
//       </p>
//     </div>

//     <div className="z-10 text-sm text-indigo-200">
//       &copy; {new Date().getFullYear()} Hawk Agency. All rights reserved.
//     </div>

//     <div className="absolute top-0 left-0 w-full h-full opacity-10 overflow-hidden">
//       <svg className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] text-sky-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M100 0C44.77 0 0 44.77 0 100s44.77 100 100 100c55.23 0 100-44.77 100-100S155.23 0 100 0z" clipRule="evenodd"/>
//       </svg>
//       <svg className="absolute -top-1/4 -right-1/4 w-[700px] h-[700px] text-indigo-300" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
//         <path fillRule="evenodd" d="M170.7 50c9.4 12.5 14.3 28.3 14.3 45 0 16.7-4.9 32.5-14.3 45s-23.3 20-38.2 20c-14.9 0-28.8-7.5-38.2-20s-14.3-28.3-14.3-45 4.9-32.5 14.3-45 23.3-20 38.2-20c14.9 0 28.8 7.5 38.2 20z" clipRule="evenodd"/>
//       </svg>
//     </div>
//   </div>
// );

// // Mobile Header Component
// const MobileHeader: React.FC = () => (
//   <div className="flex items-center space-x-3 mb-8 lg:hidden">
//     <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
//       {/* <Package className="h-6 w-6 text-white" /> */}
//       <img width="70" src = {bblogo} alt = "Logo"/>
//     </div>
//     <h1 className="text-2xl font-bold text-gray-900">Hawk Agency</h1>
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
//         Create your Account
//       </h2>
//       <p className="mt-2 text-gray-600">
//         Already have an account?{' '}
//         <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
//           Log in
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
//             label="Nick Name (Optional)"
//             type="text"
//             icon={<User className="h-5 w-5" />}
//             placeholder="Enter a nick name"
//             {...form.register('nickName')}
//             error={form.formState.errors.nickName?.message}
//           />
//         </div>

//         <Input
//           label="Email Address"
//           type="email"
//           icon={<Mail className="h-5 w-5" />}
//           placeholder="you@gmail.com"
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
//           placeholder="Create a password"
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
//           placeholder="Confirm your password"
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
//           style={{ backgroundColor: '#4F46E5', color: 'white' }}
//           isLoading={isLoading}
//         >
//           {isLoading ? 'Creating Account...' : (
//             <>
//               Create Account
//               <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
//             </>
//           )}
//         </Button>
//       </form>
//     </div>
//   );
// };

// // Verification Form Component
// interface VerificationFormProps {
//   form: any;
//   onSubmit: (data: VerifyFormData) => Promise<void>;
//   onResendOTP: () => Promise<void>;
//   onBackToRegister: () => void;
//   registeredEmail: string;
//   isLoading: boolean;
//   error: string | null;
// }

// const VerificationForm: React.FC<VerificationFormProps> = ({
//   form,
//   onSubmit,
//   onResendOTP,
//   onBackToRegister,
//   registeredEmail,
//   isLoading,
//   error
// }) => {
//   return (
//     <div>
//       <h2 className="text-3xl font-bold text-gray-900">
//         Check your Email
//       </h2>
//       <p className="mt-2 text-gray-600">
//         We've sent a 6-digit verification code to your email address.
//       </p>

//       <FormProvider {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
//           {error && <Alert type="error" message={error} />}

//           <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
//             <p className="text-sm text-indigo-800 text-center">
//               Code sent to <strong>{registeredEmail}</strong>
//             </p>
//           </div>
          
//           <Input
//             label="Email"
//             type="email"
//             icon={<Mail className="h-5 w-5" />}
//             placeholder="Enter your email"
//             {...form.register('email', {
//               required: 'Email is required',
//               pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
//             })}
//             error={form.formState.errors.email?.message}
//             disabled
//             className="bg-gray-100 cursor-not-allowed"
//           />

//           <OtpInput
//             name="otp"
//             length={6}
//             required={true}
//             error={form.formState.errors.otp?.message as string}
//           />

//           <Button
//             type="submit"
//             variant="primary"
//             className="w-full py-3 font-semibold text-base flex items-center justify-center group"
//             style={{ backgroundColor: '#4F46E5', color: 'white' }}
//             isLoading={isLoading}
//           >
//             {isLoading ? 'Verifying...' : (
//               <>
//                 Verify Account
//                 <CheckCircle className="h-5 w-5 ml-2" />
//               </>
//             )}
//           </Button>

//           <div className="flex items-center justify-between pt-2">
//             <button
//               type="button"
//               onClick={onResendOTP}
//               className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
//             >
//               Resend Code
//             </button>
//             <button
//               type="button"
//               onClick={onBackToRegister}
//               className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 font-medium cursor-pointer"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               <span>Back to Register</span>
//             </button>
//           </div>
//         </form>
//       </FormProvider>
//     </div>
//   );
// };

// // Main Register Component
// const Register: React.FC = () => {
//   const navigate = useNavigate();
//   const [step, setStep] = useState<'register' | 'verify'>('register');
//   const [registeredEmail, setRegisteredEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const registerForm = useForm<RegisterFormData>();
//   const verifyForm = useForm<VerifyFormData>({
//     defaultValues: {
//       otp: Array(6).fill('')
//     }
//   });

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
//         nickName: data.nickName
//       });

//       if (response.success) {
//         toast.success('Registration successful! Please check your email for verification code.');
//         setRegisteredEmail(data.email);
        
//         // Reset and initialize verification form
//         verifyForm.reset({
//           email: data.email,
//           otp: Array(6).fill('')
//         });
//         setStep('verify');
//       }
//     } catch (error: any) {
//       console.error('Registration error:', error);
//       const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onSubmitVerify = async (data: VerifyFormData) => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       // Convert array to string for API
//       const otpString = data.otp.join('');
//       const response = await authAPI.verify({
//         email: data.email,
//         otp: otpString
//       });
      
//       if (response.success) {
//         toast.success('Account verified successfully!');
//         navigate('/login');
//       }
//     } catch (error: any) {
//       console.error('Verification error:', error);
//       const errorMessage = error.response.data.message ||error.message || 'Verification failed';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResendOTP = async () => {
//     try {
//       const email = registeredEmail || verifyForm.getValues('email');
//       if (!email) {
//         toast.error('Email address not found.');
//         return;
//       }
      
//       toast.loading('Sending new code...');
//       const response = await authAPI.resendVerification(email);
//       toast.dismiss();
      
//       if (response.success) {
//         toast.success('Verification code sent successfully!');
//       }
//     } catch (error: any) {
//       toast.dismiss();
//       toast.error(error.message || 'Failed to resend verification code');
//     }
//   };

//   const handleBackToRegister = () => {
//     setStep('register');
//     setError(null);
//   };

//   return (
//     <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white">
//       <BrandingPanel />
      
//       <div className="flex flex-col justify-center py-12 px-6 sm:px-10 lg:px-16 overflow-y-auto">
//         <div className="w-full max-w-md mx-auto">
//           <MobileHeader />
          
//           {step === 'register' ? (
//             <RegistrationForm
//               form={registerForm}
//               onSubmit={onSubmitRegister}
//               isLoading={isLoading}
//               error={error}
//             />
//           ) : (
//             <VerificationForm
//               form={verifyForm}
//               onSubmit={onSubmitVerify}
//               onResendOTP={handleResendOTP}
//               onBackToRegister={handleBackToRegister}
//               registeredEmail={registeredEmail}
//               isLoading={isLoading}
//               error={error}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Register;

//pooja chugh login animation
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  User, 
  Phone, 
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import bblogo from "../assets/bblogog.png";
import { authAPI } from '@/utils/api';
import Alert from '@/components/UI/Alert';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import OtpInput from '@/components/UI/OtpInput';

// Types
interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  nickName?: string;
}

interface VerifyFormData {
  email: string;
  otp: string[];
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  // Animation State
  const [isActive, setIsActive] = useState(false); // false = Register Form, true = Redirecting
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forms
  const registerForm = useForm<RegisterFormData>();
  const verifyForm = useForm<VerifyFormData>({
    defaultValues: { otp: Array(6).fill('') }
  });

  // --- HANDLERS ---

  // 1. Handle Navigation Animation
  const handleLoginClick = () => {
    setIsActive(true); // Trigger slide
    setTimeout(() => {
        navigate('/login');
    }, 1800); // Wait for animation
  };

  // 2. Submit Registration
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
        nickName: data.nickName
      });

      if (response.success) {
        toast.success('Registration successful! Check email for code.');
        setRegisteredEmail(data.email);
        verifyForm.reset({ email: data.email, otp: Array(6).fill('') });
        setStep('verify');
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

  // 3. Submit OTP
  const onSubmitVerify = async (data: VerifyFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const otpString = data.otp.join('');
      const response = await authAPI.verify({
        email: data.email,
        otp: otpString
      });
      
      if (response.success) {
        toast.success('Account verified successfully!');
        // Trigger the animation to go to login automatically upon success
        handleLoginClick();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Verification failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const email = registeredEmail || verifyForm.getValues('email');
      if (!email) { toast.error('Email address not found.'); return; }
      
      toast.loading('Sending new code...');
      const response = await authAPI.resendVerification(email);
      toast.dismiss();
      
      if (response.success) toast.success('Verification code sent successfully!');
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Failed to resend code');
    }
  };

  const handleBackToRegister = () => {
    setStep('register');
    setError(null);
  };

  return (
    <div className="auth-body">
      <Toaster />
      
      {/* Main Container */}
      <div className={`container ${isActive ? 'active' : ''}`}>
        
        {/* Animated Background Shapes */}
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>

        {/* --- LEFT PANEL (Default Visible) --- */}
        {/* Contains the Registration / Verification Logic */}
        <div className="form-box Login"> {/* Class 'Login' keeps it on the Left side per CSS */}
            
            {/* Header */}
            <div className="logo-container animation" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>
                 <img src={bblogo} alt="Logo" className="w-16 mx-auto mb-2" />
            </div>
            
            <h2 className="animation" style={{ '--D': 0, '--S': 21 } as React.CSSProperties}>
                {step === 'register' ? 'Create Account' : 'Verification'}
            </h2>

            <div className="w-full px-4 overflow-y-auto max-h-[550px] scrollbar-hide">
                {error && !isActive && <Alert type="error" message={error} />}

                {/* --- FORM 1: REGISTER --- */}
                {step === 'register' && (
                    <form onSubmit={registerForm.handleSubmit(onSubmitRegister)}>
                        
                        <div className="flex gap-4 animation" style={{ '--D': 1, '--S': 22 } as React.CSSProperties}>
                            <div className="input-box flex-1">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    icon={<User className="h-5 w-5" />}
                                    required
                                    {...registerForm.register('name', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' } })}
                                    error={registerForm.formState.errors.name?.message}
                                />
                            </div>
                            <div className="input-box flex-1">
                                <Input
                                    label="Nick Name"
                                    type="text"
                                    icon={<User className="h-5 w-5" />}
                                    {...registerForm.register('nickName')}
                                    error={registerForm.formState.errors.nickName?.message}
                                />
                            </div>
                        </div>

                        <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
                            <Input
                                label="Email"
                                type="email"
                                icon={<Mail className="h-5 w-5" />}
                                required
                                {...registerForm.register('email', { required: 'Required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })}
                                error={registerForm.formState.errors.email?.message}
                            />
                        </div>

                        <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
                            <Input
                                label="Phone"
                                type="tel"
                                icon={<Phone className="h-5 w-5" />}
                                required
                                {...registerForm.register('phone', { required: 'Required', pattern: { value: /^[0-9]{10}$/, message: '10 digits' } })}
                                error={registerForm.formState.errors.phone?.message}
                            />
                        </div>

                        <div className="flex gap-4 animation" style={{ '--D': 3, '--S': 24 } as React.CSSProperties}>
                            <div className="input-box flex-1">
                                <Input
                                    label="Password"
                                    type="password"
                                    icon={<Lock className="h-5 w-5" />}
                                    required
                                    {...registerForm.register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                                    error={registerForm.formState.errors.password?.message}
                                />
                            </div>
                            <div className="input-box flex-1">
                                <Input
                                    label="Confirm"
                                    type="password"
                                    icon={<Lock className="h-5 w-5" />}
                                    required
                                    {...registerForm.register('confirmPassword', { required: 'Required' })}
                                    error={registerForm.formState.errors.confirmPassword?.message}
                                />
                            </div>
                        </div>

                        <div className="btn" style={{ '--D': 4, '--S': 25 } as React.CSSProperties}>
                            <Button
                                type="submit"
                                variant="primary"
                                 style={{ backgroundColor: '#e46033', color: 'white' }}
                                className="w-full py-3 font-semibold text-base flex items-center justify-center group bg-[#e46033] text-white hover:bg-[#e46033]"
                                isLoading={isLoading}
                            >
                                {isLoading ? 'Creating...' : (
                                <>
                                    Create Account
                                    <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
                                </>
                                )}
                            </Button>
                        </div>

                        <div className="regi-link animation" style={{ '--D': 5, '--S': 26 } as React.CSSProperties}>
                            <p>
                                Already have an account? <br />
                                <span className="SignUpLink text-[#e46033] font-bold hover:underline cursor-pointer" onClick={handleLoginClick}>Sign In</span>
                            </p>
                        </div>
                    </form>
                )}

                {/* --- FORM 2: VERIFY OTP --- */}
                {step === 'verify' && (
                    <FormProvider {...verifyForm}>
                        <form onSubmit={verifyForm.handleSubmit(onSubmitVerify)}>
                            <p className="text-gray-300 text-center mb-6 animation" style={{ '--D': 1, '--S': 22 } as React.CSSProperties}>
                                Code sent to <span className="text-[#e46033] font-semibold">{registeredEmail}</span>
                            </p>

                            {/* OTP Input wrapper to handle dark theme styling */}
                            <div className="mb-6 animation flex justify-center otp-dark-theme" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
                                <OtpInput
                                    name="otp"
                                    length={6}
                                    required={true}
                                    error={verifyForm.formState.errors.otp?.message as string}
                                />
                            </div>

                            <div className="input-box animation" style={{ '--D': 3, '--S': 24 } as React.CSSProperties}>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full py-3 font-semibold text-base flex items-center justify-center group bg-[#e46033] text-white hover:bg-[#c9522b]"
                                    isLoading={isLoading}
                                >
                                    {isLoading ? 'Verifying...' : (
                                    <>
                                        Verify Account
                                        <CheckCircle className="h-5 w-5 ml-2" />
                                    </>
                                    )}
                                </Button>
                            </div>

                            <div className="flex justify-between items-center mt-4 animation" style={{ '--D': 4, '--S': 25 } as React.CSSProperties}>
                                <button
                                    type="button"
                                    onClick={handleBackToRegister}
                                    className="text-gray-400 hover:text-white flex items-center text-sm transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    className="text-[#e46033] hover:text-[#c9522b] text-sm font-semibold transition-colors"
                                >
                                    Resend Code
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                )}
            </div>
        </div>

        {/* --- RIGHT PANEL (Info Panel Default) --- */}
        <div className="info-content Login">
          <h2 className="animation" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>HAWK AGENCY</h2>
          <p className="animation" style={{ '--D': 1, '--S': 21 } as React.CSSProperties}>
             Start your journey with us. Create an account to access your dashboard.
          </p>
        </div>

        {/* --- HIDDEN PANEL (Redirecting... appears when active) --- */}
        <div className="form-box Register"> 
          <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>Redirecting...</h2>
          <div className="w-full px-8 text-center flex flex-col items-center">
             <p className="animation mb-8 text-gray-200" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
               Please wait while we take you to the Login page.
             </p>
          </div>
        </div>

        {/* --- HIDDEN INFO (Join Us... appears on left when active) --- */}
        <div className="info-content Register">
          <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>Have an Account?</h2>
          <p className="animation" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
            Redirecting you to the sign in page...
          </p>
        </div>

      </div>

      {/* --- CSS STYLES --- */}
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
          background: #25252b
          ; 
        }

        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        /* Container Height adjusted for Registration fields */
        .container {
          position: relative;
          width: 750px;
          height: 450px;
          border: 2px solid #e46033;
          box-shadow: 0 0 25px #e46033;
          overflow: hidden;
        }

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
        
        /* Input Styles */
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

        /* OTP Specific Styling override for dark theme */
        .otp-dark-theme input {
            background-color: transparent !important;
            border: 1px solid #4b5563 !important;
            color: white !important;
        }
        .otp-dark-theme input:focus {
            border-color: #e46033 !important;
            outline: none;
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

        /* Curved Shapes */
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
          
        .btn {
          position: relative;
          width: 100%;
          height: 45px;
          background: transparent;
          border-radius: 40px;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          border: 2px solid #e46033;
          overflow: hidden;
          z-index: 1;
          color: #fff;
          margin-top: 10px;
        }

        .btn::before {
          content: "";
          position: absolute;
          height: 300%;
          width: 100%;
          background: linear-gradient(#25252b, #e46033, #25252b, #e46033);
          top: -100%;
          left: 0;
          z-index: -1;
          transition: .5s;
        }

        .btn:hover::before {
          top: 0;
        }

      `}</style>
    </div>
  );
};

export default Register;