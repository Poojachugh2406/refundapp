import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Lock, Mail, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { authAPI } from '@/utils/api';
import Alert from '@/components/UI/Alert';
import Button from '@/components/UI/Button';
import OtpInput from '@/components/UI/OtpInput';
import bblogo from '../../assets/bblogog.png';

interface ResetPasswordFormData {
  email: string;
  otp: string[];
  newPassword: string;
  confirmPassword: string;
}

const MediatorResetPassword: React.FC = () => {
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
          navigate('/mediator/login');
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
                    Your mediator password has been reset. Redirecting you to login...
                  </p>
                  <Button
                    onClick={() => navigate('/mediator/login')}
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
                  <Link to="/mediator/login" className="flex items-center text-gray-400 hover:text-white text-sm transition-colors">
                     <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
                  </Link>
                  <button 
                    type="button"
                    onClick={() => navigate('/mediator/forgot-password')} 
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

export default MediatorResetPassword;