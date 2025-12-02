export interface LoginData {
  email: string;
  password: string;
  role:string;
}

export interface RegisterData {
  name: string;
  nickName?: string;
  email: string;
  phone: string;
  password: string;
  role?: 'admin' | 'mediator' | 'user' | 'seller';
}

export interface VerifyData {
  email: string;
  otp: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'mediator' | 'user' | 'seller';
  nickName?: string;
  isActive: boolean;
  // --- ADD THESE NEW FIELDS ---
  aadhaarNumber?: string;
  panNumber?: string;
  upiId?: string;
  communityLink?: string;
  aadhaarImageUrl?: string; // For the image URL
  // bankDetails?: {          // Keep this structure if your backend sends it nested
  //   bankName: string;
  //   ifscCode: string;
  //   accountNumber: string;
  // }; 
  // OR if your backend sends them flat (as seen in your Modal code):
  bankName?: string;
  ifscCode?: string;
  accountNumber?: string;
}

export interface LoginCredentials{
  email: string;
  password:string ;
}