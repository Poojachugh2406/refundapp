import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import '@/components/UI/animation.css';
import { 
  // Lock, 
  // Mail, 
  ArrowRight, 
  // User, 
  // Phone,
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
             <img src={bblogo} alt="Logo" className="w-40 mx-auto mb-2" />
          </div>
          <h2 className="animation" style={{ '--D': 0, '--S': 21 } as React.CSSProperties}>Create Account</h2>
          
          <form onSubmit={registerForm.handleSubmit(onSubmitRegister)} className="w-full px-4 overflow-y-auto max-h-[500px] scrollbar-hide">
            {error && !isActive && <Alert type="error" message={error} />}
            
            <div className="flex gap-4 animation" style={{ '--D': 1, '--S': 22 } as React.CSSProperties}>
                <div className="input-box animation">
                    <input
                        // label="Full Name"
                        type="text"
                        //  icon={<User className="h-5 w-5" />}
                        //placeholder="John Doe"
                        required
                        {...registerForm.register('name', { required: 'Required', minLength: { value: 2, message: 'Min 2 chars' } })}
                        // error={registerForm.formState.errors.name?.message}
                        
                   />
                   <label >Full Name</label>
                </div>
                <div className="input-box animation">
                    <input
                        // label="Nick Name"
                        required
                        type="text"
                        // icon={<User className="h-5 w-5" />}
                        //placeholder="Johnny"
                        {...registerForm.register('nickName')}
                        // error={registerForm.formState.errors.nickName?.message}
                    />
                    <label>Nick Name</label>
                </div>
            </div>

            <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
              <input
                // label="Email Address"
                type="email"
                // icon={<Mail className="h-5 w-5" />}
                //placeholder="mediator@example.com"
                required
                {...registerForm.register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i , message: 'Invalid email' } })}
                // error={registerForm.formState.errors.email?.message}
              />
              <label >Email address</label>
            </div>

            <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
                <input
                    // label="Phone"
                    type="tel"
                    // icon={<Phone className="h-5 w-5" />}
                   // placeholder="9876543210"
                    required
                    {...registerForm.register('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{10}$/, message: '10 digits' } })}
                    // error={registerForm.formState.errors.phone?.message}
                />
                <label >Phone number</label>
            </div>

            <div className="input-box animation" style={{ '--D': 3, '--S': 24 } as React.CSSProperties}>
                <div className="input-box flex-1">
                    <input
                        // label="Password"
                        type={'password'}
                        // icon={<Lock className="h-5 w-5" />}
                       // placeholder="••••••"
                        required
                        {...registerForm.register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
                        // error={registerForm.formState.errors.password?.message}
                    />
                    <label >Password</label>

                </div>
                <div className="input-box animation">
                    <input
                        // label="Confirm"
                        type={'password'}
                        // icon={<Lock className="h-5 w-5" />}
                        //placeholder="••••••"
                        required
                        {...registerForm.register('confirmPassword', { required: 'Required' })}
                        // error={registerForm.formState.errors.confirmPassword?.message}
                    />
                    <label >Confirm Password</label>
                </div>
            </div>

            <div className="input-box animation mt-2" style={{ '--D': 4, '--S': 25 } as React.CSSProperties}>
              <Button
                type="submit"
                variant="primary"
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
                <span className='msg text-[#e46033]'>Already have an account?</span> <br />
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

   
      
    </div>
  );
};

export default MediatorRegister;