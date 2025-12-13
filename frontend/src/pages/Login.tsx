import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { User, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; 
// import bblogo from "../assets/bblogog.png"; 
// import Alert from '@/components/UI/Alert';
// import Input from '@/components/UI/Input';
import Button from '@/components/UI/Button';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  
  // State to toggle animation (false = Login, true = Register Info)
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login Form Hook
  const { register: registerLogin, handleSubmit: handleSubmitLogin } = useForm();

  // Login Handler
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

  // --- MODIFIED HANDLER ---
  const handleSignUpClick = () => {
    // 1. Trigger the slide animation
    setIsActive(true); 
    
    // 2. Wait for animation (700ms) then redirect to Register page
    setTimeout(() => {
        navigate('/register');
    }, 1800);
  };

  return (
    <div className="auth-body">
      <Toaster />
      
      <div className={`container ${isActive ? 'active' : ''}`}>
        
        {/* The Animated Shapes (Orange Theme) */}
        
        
        
        
        
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>

        {/* --- PANEL 1: LOGIN FORM (Visible by default) --- */}
        <div className="form-box Login">
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

            <div className="input-box animation" style={{ '--D': 3, '--S': 24 } as React.CSSProperties}>
              <button className="btn" type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Login'}
              </button>
            </div>

            <div className="regi-link animation" style={{ '--D': 4, '--S': 25 } as React.CSSProperties}>
              <p>
                Don't have an account? <br />
                {/* Clicking this triggers the animation + redirect */}
                <span className="SignUpLink text-[#e46033] font-bold hover:underline cursor-pointer" onClick={handleSignUpClick}>Sign Up</span>
              </p>
            </div>
          </form>
        </div>

        {/* --- INFO PANEL 1: WELCOME BACK (Visible on right when Login is active) --- */}
        <div className="info-content Login">
          <h2 className="animation" style={{ '--D': 0, '--S': 20 } as React.CSSProperties}>WELCOME BACK!</h2>
          <p className="animation" style={{ '--D': 1, '--S': 21 } as React.CSSProperties}>
            We are happy to have you with us again. If you need anything, we are here to help.
          </p>
        </div>

        {/* --- PANEL 2: REDIRECT MESSAGE (Hidden until active - Right Side) --- */}
        {/* This is the "Extra Content" you wanted hidden/simplified. It now just says Redirecting. */}
        <div className="form-box Register"> 
          <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>Redirecting...</h2>
          
          <div className="w-full px-8 text-center flex flex-col items-center">
             <p className="animation mb-8 text-gray-200" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
               Please wait while we take you to the registration page.
             </p>
             {/* Removed Buttons and Links here for a cleaner transition */}
          </div>
        </div>

        {/* --- INFO PANEL 2: JOIN US (Visible on left when Register Info is active) --- */}
        <div className="info-content Register">
          <h2 className="animation" style={{ '--li': 17, '--S': 0 } as React.CSSProperties}>JOIN US!</h2>
          <p className="animation" style={{ '--li': 18, '--S': 1 } as React.CSSProperties}>
            We are redirecting you to the account creation form.
          </p>
        </div>

      </div>

      {/* --- CSS STYLES (Unchanged) --- */}
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
        
        }

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
          margin-bottom: 10px;
        }

        .form-box .input-box {
          position: relative;
          width: 100%;
          height: 50px;
          margin-top: 25px;
        }

        .input-box input {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 16px;
          color: #fff;
          font-weight: 600;
          border-bottom: 2px solid #fff;
          padding-right: 23px;
          transition: .5s;
        }

        .input-box input:focus,
        .input-box input:valid {
          border-bottom: 2px solid #e46033;
        }

        .input-box label {
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          font-size: 16px;
          color: #fff;
          transition: .5s;
          pointer-events: none;
        }

        .input-box input:focus ~ label,
        .input-box input:valid ~ label {
          top: -5px;
          color: #e46033;
          font-size: 12px;
        }

        .input-box .icon {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
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

        .regi-link {
          font-size: 14px;
          text-align: center;
          margin: 20px 0 10px;
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

        /* Info Content Styles */
        .info-content {
          position: absolute;
          top: 0;
          height: 100%;
          width: 50%;
          display: flex;
          justify-content: center;
          flex-direction: column;
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
        }

        .info-content p {
          font-size: 16px;
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
      `}</style>
    </div>
  );
};

export default AuthPage;