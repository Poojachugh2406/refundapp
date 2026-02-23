import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import '@/components/UI/animation.css';
import { 
    ArrowRight, 
    CheckCircle,
  ArrowLeft
} from 'lucide-react';
import bblogo from "../assets/bblogog.png";
import { authAPI } from '@/utils/api';
import Alert from '@/components/UI/Alert';
// import Input from '@/components/UI/Input';
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
 // 2. Submit Registration (Updated)
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
      
      // --- LOGIC START: Handle Existing User ---
      // Check if the error indicates the user already exists (Adjust string to match your exact API error)
      const isUserExisting = errorMessage.toLowerCase().includes('already exists') || 
                             errorMessage.toLowerCase().includes('email is taken');

      if (isUserExisting) {
         try {
            // Attempt to resend OTP to this email
            toast.loading('Account exists. Sending verification code...');
            const resendResponse = await authAPI.resendVerification(data.email);
            toast.dismiss();

            if (resendResponse.success) {
               toast.success('Verification code sent! Please verify.');
               setRegisteredEmail(data.email);
               verifyForm.reset({ email: data.email, otp: Array(6).fill('') });
               setStep('verify'); // <--- Redirects to OTP screen
              //  setIsLoading(false);
               return; // Stop here, don't show the error toast
            }
         } catch (resendError: any) {
            toast.dismiss();
            // Optional: If resend fails because they are ALREADY verified, send them to login
            const resendMsg = resendError.response?.data?.message || "";
            if (resendMsg.toLowerCase().includes('verified')) {
               toast.success("Account already verified. Redirecting to login...");
               handleLoginClick();
              //  setIsLoading(false);
               return;
            }
         }
      }
      // --- LOGIC END ---

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
                 <img src={bblogo} alt="Logo" className="w-40 mx-auto mb-2" />
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
                            <div className="input-box animation">
                                <input
                                    // label="Full Name"
                                    type="text"
                                    //icon={<User className="h-5 w-5" />}
                                    required
                                    {...registerForm.register('name', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' } })}
                                    // error={registerForm.formState.errors.name?.message}
                                />
                                <label>Name</label>
                            </div>
                            <div className="input-box animation">
                                <input
                                    // label="Nick Name"
                                    type="text"
                                  //  icon={<User className="h-5 w-5" />}
                                  required
                                    {...registerForm.register('nickName')}
                                    // error={registerForm.formState.errors.nickName?.message}
                                />
                                <label>Nick name</label>
                            </div>
                        </div>

                        <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
                            <input
                                // label="Email"
                                type="email"
                               // icon={<Mail className="h-5 w-5" />}
                                required
                                {...registerForm.register('email', { required: 'Required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email' } })}
                                //error={registerForm.formState.errors.email?.message}
                            />
                            <label>Username / Email</label>
                        </div>

                        <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
                            <input
                                //label="Phone"
                                type="tel"
                               // icon={<Phone className="h-5 w-5" />}
                                required
                                {...registerForm.register('phone', { required: 'Required', pattern: { value: /^[0-9]{10}$/, message: '10 digits' } })}
                                // error={registerForm.formState.errors.phone?.message}
                            />
                            <label>Phone</label>
                        </div>

                        <div className="flex gap-4 animation" style={{ '--D': 3, '--S': 24 } as React.CSSProperties}>
                            <div className="input-box flex-1">
                                <input
                                    // label="Password"
                                    type="password"
                                   // icon={<Lock className="h-5 w-5" />}
                                    required
                                    {...registerForm.register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                                    // error={registerForm.formState.errors.password?.message}
                                />
                                <label>Password</label>
                            </div>
                            <div className="input-box flex-1">
                                <input
                                    // label="Confirm"
                                    type="password"
                                   // icon={<Lock className="h-5 w-5" />}
                                    required
                                    {...registerForm.register('confirmPassword', { required: 'Required' })}
                                    // error={registerForm.formState.errors.confirmPassword?.message}
                                />
                                {/* <label>Username / Email</label> */}
                                <label>Confirm Password</label>
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
                                {/* <span className='msg text-[#e46033]'>Already have an account?</span> <br /> */}
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
          <h2 className="animation" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>Relamp Digital</h2>
          <p className="animation" style={{ '--D': 1, '--S': 21 } as React.CSSProperties}>
             Start your journey with us. Create an account to access your dashboard.
          </p>
        </div>

        {/* --- HIDDEN PANEL (Redirecting... appears when active) --- */}
        {/* <div className="form-box Register"> 
          <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>Redirecting...</h2>
          <div className="w-full px-8 text-center flex flex-col items-center">
             <p className="animation mb-8 text-gray-200" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
               Please wait while we take you to the Login page.
             </p>
          </div>
        </div> */}

        {/* --- HIDDEN INFO (Join Us... appears on left when active) --- */}
        <div className="info-content Register">
          <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>Have an Account?</h2>
          <p className="animation" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
            Redirecting you to the sign in page...
          </p>
        </div>

      </div>

      
          </div>
  );
};

export default Register;