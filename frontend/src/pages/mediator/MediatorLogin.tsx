import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import {  ArrowRight } from 'lucide-react';
//import { Lock, Mail, ArrowRight } from 'lucide-react';
import bblogo from "../../assets/bblogog.png"; 
import { useAuth } from '@/contexts/AuthContext';
import Alert from '@/components/UI/Alert';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';
import '@/components/UI/animation.css';

// Mocked Types
type LoginCredentials = {
  email: string;
  password: string;
};

const MediatorLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // State for animation toggle
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const onSubmit = async (data: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await login({...data, role:'mediator'});
      toast.success('Login successful!');
      navigate('/mediator');
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
          
      if (errorMessage.toLowerCase().includes('not verified') || 
      errorMessage.toLowerCase().includes('account is not verified')) {
        toast.error("Please Wait For Admin to Approve Your Account");
        setError("Please Wait For Admin to Approve Your Account");
      } else {
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyClick = () => {
    setIsActive(true); 
    setTimeout(() => {
        navigate('/mediator/register');
    }, 1800);
  };

  return (
    <div className="auth-body">
      <Toaster />
      
      <div className={`container ${isActive ? 'active' : ''}`}>
        
        {/* Animated Shapes - Emerald Theme */}
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>

        {/* --- PANEL 1: LOGIN FORM (Visible by default) --- */}
        <div className="form-box Login">
          <div className="logo-container animation" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>
             <img src={bblogo} alt="Logo" className="w-40 mx-auto mb-0" />
          </div>
          <h2 className="animation" style={{ '--D': 0, '--S': 21 } as React.CSSProperties}>Mediator Login</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4">
            {error && !isActive && <Alert type="error" message={error} />}
            
            <div className="input-box animation" style={{ '--D': 1, '--S': 22 } as React.CSSProperties}>
              <input
                
               // type="email"
                //={<Mail className="h-5 w-5" />}
                //placeholder="mediator@example.com"
                required
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                })}
                
                //error={errors.email?.message}
              />
              <label >Email</label>
            </div>

            <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
              <input
               
                type={'password'}
               // icon={<Lock className="h-5 w-5" />}
                //placeholder="••••••••"
                required
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
               // error={errors.password?.message}
               
              />
              <label >Password</label>
            </div>

            <div className="animation flex justify-end mb-4" style={{ '--D': 3, '--S': 24 } as React.CSSProperties}>
               <Link
                to={'/mediator/forgot-password'}
                className="text-sm text-[#e46033] hover:text-[#c9522b] font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <div className="input-box animation" style={{ '--D': 4, '--S': 25 } as React.CSSProperties}>
              <Button
                type="submit"
                variant="primary"
                style={{ backgroundColor: '#e46033', color: 'white' }}
                className="w-full py-3 font-semibold text-base flex items-center justify-center group bg-[#e46033] text-white hover:bg-[#c9522b]"
                isLoading={isLoading}
              >
                {isLoading ? 'Accessing...' : (
                  <>
                    Login
                    <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>

            <div className="regi-link animation" style={{ '--D': 5, '--S': 26 } as React.CSSProperties}>
              <p>
                {/* <span className='msg text-[#e46033]'>New Mediator?</span> <br /> */}
                {/* Clicking this triggers handleApplyClick which animates then navigates */}
                <span className="SignUpLink text-[#e46033] font-bold hover:underline cursor-pointer" onClick={handleApplyClick}>Apply for Account</span>
              </p>
            </div>
          </form>
        </div>

        {/* --- INFO PANEL 1: WELCOME (Visible on right when Login is active) --- */}
        <div className="info-content Login">
          <h2 className="animation" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>HAWK AGENCY</h2>
          <p className="animation" style={{ '--D': 1, '--S': 21 } as React.CSSProperties}>
            Welcome to the Mediator Portal. Manage your orders and refunds efficiently.
          </p>
        </div>

        {/* --- PANEL 2: REDIRECTING MESSAGE (Hidden until active) --- */}
        <div className="form-box Register"> 
          <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>Redirecting...</h2>
          
          <div className="w-full px-8 text-center">
             <p className="animation mb-6 text-gray-200" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
               Please wait while we take you to the registration page.
             </p>
          </div>
        </div>

        {/* --- INFO PANEL 2: APPLY (Visible on left when Apply is active) --- */}
        <div className="info-content Register">
          <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>APPLY NOW!</h2>
          <p className="animation" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
            Ready to join our network? We are redirecting you to the application form.
          </p>
        </div>

      </div>

      {/*  */}
    </div>
  );
};

export default MediatorLogin;