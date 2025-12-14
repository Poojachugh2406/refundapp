
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { Package, Lock, Mail, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
// import { authAPI } from '@/utils/api';
// import Input from '@/components/UI/Input';
// import Button from '@/components/UI/Button';
// import Alert from '@/components/UI/Alert';

// interface ResetPasswordData {
//   email: string;
//   otp: string;
//   newPassword: string;
//   confirmPassword: string;
// }

// const ResetPassword: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [formData, setFormData] = useState<ResetPasswordData>({
//     email: '',
//     otp: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   // Get email from location state or allow manual entry
//   useEffect(() => {
//     if (location.state?.email) {
//       setFormData(prev => ({
//         ...prev,
//         email: location.state.email
//       }));
//     }
//   }, [location.state]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);

//     // Validation
//     if (!formData.email || !formData.otp || !formData.newPassword || !formData.confirmPassword) {
//       setError('All fields are required');
//       return;
//     }

//     if (formData.newPassword.length < 6) {
//       setError('Password must be at least 6 characters');
//       return;
//     }

//     if (formData.newPassword !== formData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (!/^\d{6}$/.test(formData.otp)) {
//       setError('OTP must be 6 digits');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const response = await authAPI.resetPassword({
//         email: formData.email,
//         otp: formData.otp,
//         newPassword: formData.newPassword
//       });

//       if (response.success) {
//         setSuccess(true);
//         toast.success('Password reset successfully!');
//         setTimeout(() => {
//           navigate('/login');
//         }, 2000);
//       }
//     } catch (error: any) {
//       console.error('Reset password error:', error);
//       setError(error.response.data.message || error.message || 'Failed to reset password');
//       toast.error(error.response.data.message || error.message || 'Failed to reset password');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-md">
//           <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle className="h-8 w-8 text-green-600" />
//             </div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Password Reset Successful!</h3>
//             <p className="text-gray-600 mb-6">
//               Your password has been reset successfully. Redirecting to login...
//             </p>
//             <Link
//               to="/login"
//               className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
//             >
//               Go to Login
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="text-center mb-6">
//           <div className="flex justify-center items-center space-x-3 mb-6">
//             <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
//               <Package className="h-7 w-7 text-white" />
//             </div>
//             <div className="text-left">
//               <h1 className="text-3xl font-bold text-gray-900">Hawk Agency</h1>
//               <p className="text-gray-600 text-sm">Reset Your Password</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
//             <div className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
//                 <Lock className="h-5 w-5 text-white" />
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-white">Reset Password</h2>
//                 <p className="text-blue-100 text-sm">Enter your reset code and new password</p>
//               </div>
//             </div>
//           </div>

//           <div className="px-6 py-8 sm:px-8">
//             {error && <Alert type="error" message={error} />}

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <Input
//                 label="Email Address"
//                 type="email"
//                 icon={<Mail className="h-5 w-5" />}
//                 placeholder="Enter your email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 disabled={!!location.state?.email} // Disable if email is passed from state
//                 className={location.state?.email ? "bg-gray-50" : ""}
//               />

//               {location.state?.email && (
//                 <p className="text-sm text-green-600 -mt-3">
//                   ✓ Email auto-filled from previous step
//                 </p>
//               )}

//               <Input
//                 label="Reset Code"
//                 type="text"
//                 placeholder="Enter 6-digit code from your email"
//                 name="otp"
//                 value={formData.otp}
//                 onChange={(e) => setFormData(prev => ({ 
//                   ...prev, 
//                   otp: e.target.value.replace(/\D/g, '').slice(0, 6) 
//                 }))}
//                 maxLength={6}
//                 required
//               />

//               <Input
//                 label="New Password"
//                 type={showPassword ? 'text' : 'password'}
//                 icon={<Lock className="h-5 w-5" />}
//                 placeholder="Enter new password (min. 6 characters)"
//                 name="newPassword"
//                 value={formData.newPassword}
//                 onChange={handleChange}
//                 required
//                 rightIcon={
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 }
//               />

//               <Input
//                 label="Confirm New Password"
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 icon={<Lock className="h-5 w-5" />}
//                 placeholder="Confirm new password"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 required
//                 rightIcon={
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 }
//               />

//               <Button
//                 type="submit"
//                 variant="primary"
//                 className="w-full py-3 font-semibold"
//                 isLoading={isLoading}
//               >
//                 Reset Password
//               </Button>
//             </form>

//             <div className="mt-6 text-center space-y-3">
//               <Link
//                 to="/login"
//                 className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
//               >
//                 <ArrowLeft className="h-4 w-4 mr-2" />
//                 Back to Login
//               </Link>
//               <div>
//                 <button
//                   type="button"
//                   onClick={() => navigate('/forgot-password')}
//                   className="text-sm text-gray-600 hover:text-gray-700"
//                 >
//                   Didn't receive code? Try again
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Lock, Mail, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { authAPI } from '@/utils/api';
import Alert from '@/components/UI/Alert';
import Button from '@/components/UI/Button';
import OtpInput from '@/components/UI/OtpInput';
import bblogo from '../assets/bblogog.png';

interface ResetPasswordFormData {
  email: string;
  otp: string[];
  newPassword: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Animation state
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const methods = useForm<ResetPasswordFormData>({
    defaultValues: {
      otp: Array(6).fill('')
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError: setFormError,
    watch
  } = methods;

  // Get email from location state
  useEffect(() => {
    if (location.state?.email) {
      setValue('email', location.state.email);
    }
  }, [location.state, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);

    const otpString = data.otp.join('');

    if (!otpString || otpString.length !== 6) {
      setError('Please enter the complete 6-digit verification code');
      return;
    }

    if (data.newPassword !== data.confirmPassword) {
      setFormError('confirmPassword', { message: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.resetPassword({
        email: data.email,
        otp: otpString,
        newPassword: data.newPassword
      });

      if (response.success) {
        setSuccess(true);
        toast.success('Password reset successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to reset password');
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-body">
      <Toaster />
      
      {/* Container with animation */}
      <div className={`container ${loaded ? 'animate-entry' : ''}`}>
        
        {/* Background Shapes */}
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>

        {/* --- MAIN CONTENT --- */}
        <div className="form-box">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="logo-container mb-4">
               <img src={bblogo} alt="Logo" className="w-16 mx-auto" />
            </div>
            
            {success ? (
               <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Success!</h3>
                  <p className="text-gray-300 mb-6">
                    Your password has been reset. Redirecting you to login...
                  </p>
                  <Button
                    onClick={() => navigate('/login')}
                    variant="primary"
                    className="w-full py-3 font-semibold text-base bg-[#e46033] text-white hover:bg-[#c9522b]"
                  >
                    Go to Login Now
                  </Button>
               </div>
            ) : (
               <>
                <h2 className="text-3xl font-bold text-white mb-2">New Password</h2>
                <p className="text-gray-300 text-sm max-w-xs mx-auto">
                  Enter the code sent to your email and create a new password.
                </p>
               </>
            )}
          </div>

          {!success && (
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full px-8 overflow-y-auto max-h-[450px] scrollbar-hide">
                {error && <Alert type="error" message={error} />}

                {/* Hidden Email Field (but visible as text) */}
                <div className="bg-[#e46033]/10 rounded-lg p-3 border border-[#e46033]/30 mb-6 text-center">
                   <p className="text-sm text-gray-300">
                     Resetting for: <strong className="text-[#e46033]">{watch('email') || '...'}</strong>
                   </p>
                   <input type="hidden" {...register('email')} />
                </div>

                {/* OTP Input - Custom Dark Styling */}
                <div className="mb-6 flex justify-center otp-dark-theme">
                    <OtpInput
                        name="otp"
                        length={6}
                        required={true}
                        error={errors.otp?.message as string}
                    />
                </div>

                <div className="input-box">
                  <input 
                    type="password" 
                    required 
                    {...register('newPassword', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                  />
                  <label>New Password</label>
                  <Lock className="icon" size={20} color="transparent" /> {/* Icon hidden via transparent for style match */}
                  {errors.newPassword && <span className="text-red-400 text-xs absolute -bottom-5 left-0">{errors.newPassword.message}</span>}
                </div>

                <div className="input-box">
                  <input 
                    type="password" 
                    required 
                    {...register('confirmPassword', { required: 'Required' })}
                  />
                  <label>Confirm Password</label>
                  <Lock className="icon" size={20} color="transparent" />
                  {errors.confirmPassword && <span className="text-red-400 text-xs absolute -bottom-5 left-0">{errors.confirmPassword.message}</span>}
                </div>

                <div className="mt-8">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full py-3 font-semibold text-base flex items-center justify-center group bg-[#e46033] text-white hover:bg-[#c9522b] rounded-full transition-all"
                    isLoading={isLoading}
                  >
                    {isLoading ? 'Resetting...' : (
                      <>
                        Reset Password
                        <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>

                <div className="regi-link flex justify-between mt-6 mb-4">
                  <Link to="/login" className="flex items-center text-gray-400 hover:text-white text-sm transition-colors">
                     <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
                  </Link>
                  <button 
                    type="button"
                    onClick={() => navigate('/forgot-password')} 
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

      {/* --- CSS STYLES --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

        .auth-body {
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #25252b;
          overflow-x: hidden;
        }

        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .container {
          position: relative;
          width: 100%;
          max-width: 750px; /* Slightly wider for OTP inputs */
          height: 500px;
          background: #1f2937; 
          border: 2px solid #e46033;
          box-shadow: 0 0 25px #e46033;
          overflow: hidden;
          border-radius: 20px;
          opacity: 0;
          transform: translateY(-50px);
        }

        .container.animate-entry {
          animation: slideInDown 0.8s ease-out forwards;
        }

        @keyframes slideInDown {
          0% { opacity: 0; transform: translateY(-50px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .container .form-box {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          z-index: 10;
        }

        .form-box h2 {
          font-size: 32px;
          text-align: center;
          color: white;
        }

        /* Input Styling */
        .input-box {
          position: relative;
          width: 100%;
          height: 50px;
          margin-top: 25px;
          margin-bottom: 10px;
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

        .input-box input:focus,
        .input-box input:valid {
            border-bottom: 2px solid #e46033 !important;
        }

        .input-box label {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            font-size: 16px;
            color: #9ca3af;
            pointer-events: none;
            transition: .5s;
        }

        .input-box input:focus ~ label,
        .input-box input:valid ~ label {
            top: -5px;
            color: #e46033;
            font-size: 12px;
        }

        /* OTP Styling Override */
        .otp-dark-theme input {
            background-color: transparent !important;
            border: 1px solid #4b5563 !important;
            color: white !important;
            width: 40px !important;
            height: 50px !important;
            border-radius: 8px;
            font-size: 20px;
            margin: 0 5px;
        }
        .otp-dark-theme input:focus {
            border-color: #e46033 !important;
            outline: none;
            box-shadow: 0 0 5px #e46033;
        }

        .regi-link a {
          text-decoration: none;
          cursor: pointer;
        }

        /* Background Shapes */
        .container .curved-shape {
          position: absolute;
          right: 0;
          top: -5px;
          height: 600px;
          width: 850px;
          background: linear-gradient(45deg, #111827, #e46033);
          transform: rotate(10deg) skewY(40deg);
          transform-origin: bottom right;
          opacity: 0.8;
        }
        
        .container .curved-shape2 {
          position: absolute;
          left: -100px;
          bottom: -200px;
          height: 400px;
          width: 850px;
          background: #25252b;
          border-top: 3px solid #e46033;
          transform: rotate(-10deg) skewY(-10deg);
          transform-origin: bottom left;
          z-index: 1;
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .container {
                height: auto;
                min-height: 550px;
                max-width: 100%;
            }
            
            .form-box {
                padding: 40px 10px;
            }

            .container .curved-shape {
                width: 150%;
                opacity: 0.5;
                top: -100px;
            }
            
            .container .curved-shape2 {
                display: none;
            }
            
            /* Smaller OTP inputs on mobile */
            .otp-dark-theme input {
                width: 35px !important;
                height: 45px !important;
                margin: 0 3px;
                font-size: 16px;
            }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;