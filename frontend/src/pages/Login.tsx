import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate ,Link} from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';

import { User, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; 
import bblogo from "../assets/bblogog.png"; 
import '@/components/UI/animation.css';
const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register: registerLogin, handleSubmit: handleSubmitLogin } = useForm();

  const onLogin = async (data: any) => {
    setIsLoading(true);
    try {
      await login({ ...data, role: 'user' });
      toast.success('Login successful!');
      navigate('/user');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    setIsActive(true); 
    setTimeout(() => {
        navigate('/register');
    }, 1800);
  };

  return (
    <div className="auth-body">
      <Toaster />
      
      <div className={`container ${isActive ? 'active' : ''}`}>
        
        {/* The Animated Shapes */}
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>

        {/* --- PANEL 1: LOGIN FORM --- */}
        <div className="form-box Login">
          <div className="logo-container animation" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>
             <img src={bblogo} alt="Logo" className="w-40 mx-auto mb- 0" />
          </div>
          <h2 className="animation" style={{ '--D': 0, '--S': 21 } as React.CSSProperties}>Login</h2>
          <form onSubmit={handleSubmitLogin(onLogin)}>
            
            <div className="input-box animation" style={{ '--D': 1, '--S': 22 } as React.CSSProperties}>
              <input type="text" required {...registerLogin('email')} />
              <label>Username / Email</label>
              <User className="icon" size={20} color="transparent" />
            </div>

            <div className="input-box animation" style={{ '--D': 2, '--S': 23 } as React.CSSProperties}>
              <input type="password" required {...registerLogin('password')} />
              <label>Password</label>
              <Lock className="icon" size={20} color="transparent" />
            </div>
<div className="animation flex justify-end mb-4" style={{ '--D': 3, '--S': 24 } as React.CSSProperties}>
               <Link
                to={'/forgot-password'}
                className="text-sm text-[#e46033] hover:text-[#c9522b] font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <div className="input-box animation" style={{ '--D': 3, '--S': 24 } as React.CSSProperties}>
              <button  type="submit"
              style={{ backgroundColor: '#e46033', color: 'white' }}
                className="w-full py-3 font-semibold text-base flex items-center justify-center group bg-[#e46033] text-white hover:bg-[#c9522b]"
                
                disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Login'}
              </button>
            </div>
 


            <div className="regi-link animation" style={{ '--D': 4, '--S': 25 } as React.CSSProperties}>
              <p>
                {/* <span className='msg text-[#e46033]'>Don't have an account?</span> <br /> */}
                <span className="SignUpLink text-[#e46033] font-bold hover:underline cursor-pointer" onClick={handleSignUpClick}>Sign Up</span>
              </p>
            </div>
          </form>
        </div>

        {/* --- INFO PANEL 1 (Welcome Back) --- */}
        {/* Hidden on Mobile via CSS */}
        <div className="info-content Login">
          <h2 className="animation" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>Hawk Agency</h2>
          <p className="animation" style={{ '--D': 1, '--S': 21 } as React.CSSProperties}>
            We welcome you at Hawk agency and are happy to have you with us again. If you need anything, we are here to help.
          </p>
        </div>

        {/* --- PANEL 2: REDIRECT MESSAGE --- */}
        {/* <div className="form-box Register"> 
          <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>Redirecting...</h2>
          
          <div className="w-full px-8 text-center flex flex-col items-center">
             <p className="animation mb-8 text-gray-200" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
               Please wait while we take you to the registration page.
             </p>
          </div>
        </div> */}

        {/* --- INFO PANEL 2 (Join Us) --- */}
        {/* Hidden on Mobile via CSS */}
        <div className="info-content Register">
          <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>JOIN US!</h2>
          <p className="animation" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
            We are redirecting you to the account creation form.
          </p>
        </div>

      </div>

      {/* --- CSS STYLES --- */}
      
    </div>
  );
};

export default AuthPage;