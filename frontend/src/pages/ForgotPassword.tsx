import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { authAPI } from '@/utils/api';
import Alert from '@/components/UI/Alert';
import Button from '@/components/UI/Button';
import bblogo from "../assets/bblogog.png";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Animation state to trigger slide-in on mount
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    if (!data.email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.forgotPassword({ email: data.email });
      if (response.success) {
        navigate('/reset-password', { state: { email: data.email } });
        toast.success('Password reset OTP sent to your email!');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setError(error.response?.data?.message || error.message || 'Failed to send reset email');
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-body">
      <Toaster />
      
      {/* Container with animation class */}
      <div className={`container ${loaded ? 'animate-entry' : ''}`}>
        
        {/* Background Shapes */}
        <div className="curved-shape"></div>
        <div className="curved-shape2"></div>

        {/* --- MAIN FORM CONTENT --- */}
        <div className="form-box">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#e46033]/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-[#e46033]/30 shadow-lg mx-auto mb-4">
               <img width="50" src={bblogo} alt="Logo"/>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-gray-300 text-sm max-w-xs mx-auto">
              Don't worry! Enter your email and we'll send you a reset code.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full px-8">
            {error && <Alert type="error" message={error} />}

            <div className="input-box">
              <input 
                type="email" 
                required 
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              <label>Email Address</label>
              <Mail className="icon" size={20} color="white" />
              {errors.email && <span className="text-red-400 text-xs absolute -bottom-5 left-0">{errors.email.message}</span>}
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 font-semibold text-base flex items-center justify-center group bg-[#e46033] text-white hover:bg-[#c9522b] rounded-full transition-all"
                isLoading={isLoading}
              >
                {isLoading ? 'Sending...' : (
                  <>
                    Send Reset Code
                    <ArrowRight className="h-5 w-5 ml-2 transform transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>

            <div className="regi-link">
              <Link to="/login" className="flex items-center justify-center gap-2 group">
                 <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/>
                 <span>Back to Login</span>
              </Link>
            </div>
          </form>
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
          background: #25252b; /* Dark background matching theme */
          overflow-x: hidden;
        }

        .container {
          position: relative;
          width: 100%;
          max-width: 750px; /* Compact width for Forgot Password */
          height: 500px;
          background: #1f2937; 
          border: 2px solid #e46033;
          box-shadow: 0 0 25px #e46033;
          overflow: hidden;
          border-radius: 20px;
          opacity: 0;
          transform: translateY(-50px);
        }

        /* Entry Animation */
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

        .input-box .icon {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
        }

        .regi-link {
          font-size: 14px;
          text-align: center;
          margin-top: 30px;
        }

        .regi-link a {
          text-decoration: none;
          color: #e46033;
          font-weight: 600;
          cursor: pointer;
        }

        .regi-link a:hover {
          text-decoration: underline;
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
                padding: 40px 20px;
            }

            .container .curved-shape {
                width: 150%;
                opacity: 0.5;
            }
            
            .container .curved-shape2 {
                display: none;
            }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;