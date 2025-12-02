import Otp from "../models/Otp.js";
import createTransporter from "../config/emailConfig.js";

// Generate random OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via email
export const sendOTPEmail = async (email, otp, purpose = 'verification') => {
  try {
    const transporter = createTransporter();
    
    let subject, html;
    
    switch (purpose) {
      case 'verification':
        subject = 'Verify Your Account - OTP Code';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Account Verification</h2>
            <p>Thank you for registering! Use the OTP below to verify your account:</p>
            <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This OTP will expire in 5 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `;
        break;
        
      case 'password_reset':
        subject = 'Password Reset - OTP Code';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset</h2>
            <p>You requested to reset your password. Use the OTP below:</p>
            <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This OTP will expire in 5 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `;
        break;
        
      default:
        subject = 'Your OTP Code';
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Your OTP Code</h2>
            <p>Use the OTP below:</p>
            <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This OTP will expire in 5 minutes.</p>
          </div>
        `;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Failed to send OTP email');
  }
};

// Save OTP to database
export const saveOTP = async (email, otp) => {
  try {
    // Delete any existing OTPs for this email
    await Otp.deleteMany({ email });
    
    // Save new OTP
    const otpRecord = new Otp({
      email,
      otp,
      expiresIn: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });
    
    await otpRecord.save();
    return otpRecord;
  } catch (error) {
    console.error('Error saving OTP:', error);
    throw new Error('Failed to save OTP');
  }
};

// Verify OTP

export const verifyOTP = async (email, otp) => {
  try {
    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });
    
    if (!otpRecord) {
      return { isValid: false, message: 'OTP not found or expired' };
    }
    
    if (otpRecord.expiresIn < new Date()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return { isValid: false, message: 'OTP has expired' };
    }
    
    if (otpRecord.otp !== otp) {
      return { isValid: false, message: 'Invalid OTP' };
    }
    
    // Delete the OTP after successful verification
    await Otp.deleteOne({ _id: otpRecord._id });
    
    return { isValid: true, message: 'OTP verified successfully' };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Failed to verify OTP');
  }
};




// Send Order Confirmation Email
export const sendOrderConfirmationEmail = async (email, orderId) => {
  try {
    const transporter = createTransporter();

    const subject = '✅ Order Submitted Successfully';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 10px;">
        <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
        
        <p>Thank you for placing your order with us. Your order has been submitted successfully.</p>
        
        <div style="
          background: #f4f4f4;
          padding: 20px;
          text-align: center;
          margin: 25px 0;
          border-radius: 6px;
        ">
          <p style="margin: 0; font-size: 14px; color: #666;">Your Order ID</p>
          <h1 style="
            margin: 10px 0 0 0;
            letter-spacing: 2px;
            color: #000;
          ">
            ${orderId}
          </h1>
        </div>

        <p>Our team will review your order and process it shortly.</p>
        <p>You’ll receive another update once the order status changes.</p>
        
        <br>
        <p style="font-size: 14px; color: #555;">
          If you did not place this order, please ignore this email.
        </p>

        <hr style="margin: 20px 0;" />

        <p style="text-align: center; font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} Hawk Agency. All rights reserved.
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    return true;

  } catch (error) {
    console.error('Order confirmation error:', error);
    throw new Error('Failed to send order confirmation email');
  }
};



// Send Order Confirmation Email
export const sendRefundConfirmationEmail = async (email, orderId) => {
  try {
    const transporter = createTransporter();

    const subject = '✅ Refund Submitted Successfully';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 10px;">
        <h2 style="color: #333; text-align: center;">Refund Confirmation</h2>
        
        <p>Your refund form has been submitted successfully.</p>
        
        <div style="
          background: #f4f4f4;
          padding: 20px;
          text-align: center;
          margin: 25px 0;
          border-radius: 6px;
        ">
          <p style="margin: 0; font-size: 14px; color: #666;">Your Order ID</p>
          <h1 style="
            margin: 10px 0 0 0;
            letter-spacing: 2px;
            color: #000;
          ">
            ${orderId}
          </h1>
        </div>

        <p>Our team will review your refund form and process it shortly.</p>
        <p>You’ll receive another update once the order status changes.</p>
        
        <br>
        <p style="font-size: 14px; color: #555;">
          If you did not place this refund form, please ignore this email.
        </p>

        <hr style="margin: 20px 0;" />

        <p style="text-align: center; font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} Hawk Agency. All rights reserved.
        </p>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    return true;

  } catch (error) {
    console.error('Refund confirmation error:', error);
    throw new Error('Failed to send refund confirmation email');
  }
};


