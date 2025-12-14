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

                        <div className="btn animation" style={{ '--D': 4, '--S': 25 } as React.CSSProperties}>
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
                                <span className='msg text-[#e46033]'>Already have an account?</span> <br />
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

        /* Container - Responsive Width */
        .container {
          position: relative;
          width: 100%;
          max-width: 750px; /* Max width for desktop */
          height: 450px;
          border: 2px solid #e46033;
          box-shadow: 0 0 25px #e46033;
          overflow: hidden;
          background: #1f2937;
          border-radius: 20px;
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
          z-index: 10;
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

        /* --- MOBILE RESPONSIVENESS START --- */
        @media (max-width: 768px) {
            .container {
                height: 650px; /* Increased height for Register form */
            }

            /* Hide Info Content panels on mobile to save space */
            .info-content {
                display: none;
            }

            /* Make Forms take full width */
            .container .form-box {
                width: 100%;
                padding: 0 20px;
            }

            /* Adjust background shapes */
            .container .curved-shape {
                 width: 150%;
                 height: 400px;
                 top: -50px;
                 right: -25%;
                 transform: rotate(10deg) skewY(10deg);
                 opacity: 0.5;
            }
            .container .curved-shape2 {
                 display: none;
            }

            /* Adjust redirect panel position */
            .form-box.Register {
                right: -100%; 
            }
            .container.active .form-box.Register {
                right: 0;
            }
        }
        /* --- MOBILE RESPONSIVENESS END --- */

      `}</style>
    </div>
  );
};

export default Register;