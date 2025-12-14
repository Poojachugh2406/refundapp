import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import bblogo from "../../assets/bblogog.png"; 
import { useAuth } from '@/contexts/AuthContext';
import Alert from '@/components/UI/Alert';
import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

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
             <img src={bblogo} alt="Logo" className="w-16 mx-auto mb-0" />
          </div>
          <h2 className="animation" style={{ '--D': 0, '--S': 21 } as React.CSSProperties}>Mediator Login</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="w-full px-4">
            {error && !isActive && <Alert type="error" message={error} />}
            
            <div className="input-box animation" style={{ '--D': 1, '--S': 22 } as React.CSSProperties}>
              <Input
                label="Email Address"
                type="email"
                icon={<Mail className="h-5 w-5" />}
                placeholder="mediator@example.com"
                required
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' }
                })}
                
                error={errors.email?.message}
              />
            </div>

            <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
              <Input
                label="Password"
                type={'password'}
                icon={<Lock className="h-5 w-5" />}
                placeholder="••••••••"
                required
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' }
                })}
                error={errors.password?.message}
              />
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
                <span className='msg text-[#e46033]'>New Mediator?</span> <br />
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
          color: #fff;
          overflow-x: hidden;
        }

        .container {
          position: relative;
          width: 100%;
          max-width: 750px;
          height: 500px;
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

        /* Animation Logic */
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
          color: #f4f4f4ff;
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
          margin-top: 20px;
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

        /* --- MOBILE RESPONSIVENESS START --- */
        @media (max-width: 768px) {
            .container {
                height: 550px; 
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

export default MediatorLogin;