import { useState, useEffect } from 'react';
import { Workflow, Mail, Lock, Eye, EyeOff, UserCog, Shield, User as UserIcon } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

export type UserRole = 'manager' | 'admin' | 'employee';

interface LoginPageProps {
  onLogin: (email: string, password: string, role: UserRole, firstName?: string, lastName?: string) => void;
  onGoogleLogin: (credential: string, role: UserRole) => void;
}

function LoginPage({ onLogin, onGoogleLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Load saved credentials on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRole = localStorage.getItem('rememberedRole') as UserRole;
    
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    if (savedRole) {
      setSelectedRole(savedRole);
    }
  }, []);

  const roles = [
    { value: 'employee' as UserRole, label: 'Employee', icon: UserIcon, color: 'blue' },
    { value: 'manager' as UserRole, label: 'Manager', icon: UserCog, color: 'purple' },
    { value: 'admin' as UserRole, label: 'Admin', icon: Shield, color: 'red' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save credentials if "Remember me" is checked
    if (rememberMe && !isSignUp) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberedRole', selectedRole);
    } else {
      // Clear saved credentials if "Remember me" is unchecked
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedRole');
    }
    
    if (isSignUp) {
      onLogin(email, password, selectedRole, firstName, lastName);
    } else {
      onLogin(email, password, selectedRole);
    }
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      onGoogleLogin(credentialResponse.credential, selectedRole);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    alert('Google login failed. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg">
            <Workflow size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">FlowForge</h1>
          <p className="text-slate-600">AI-Powered Workflow Automation</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Select Role
              </label>
              <div className="grid grid-cols-3 gap-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.value;
                  
                  const colorMap = {
                    blue: { border: '#3b82f6', bg: '#eff6ff', icon: '#2563eb', text: '#1e40af' },
                    purple: { border: '#a855f7', bg: '#faf5ff', icon: '#9333ea', text: '#7e22ce' },
                    red: { border: '#ef4444', bg: '#fef2f2', icon: '#dc2626', text: '#b91c1c' },
                  };
                  
                  const colors = colorMap[role.color as keyof typeof colorMap];
                  
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className="p-3 rounded-lg border-2 transition-all"
                      style={{
                        borderColor: isSelected ? colors.border : '#e2e8f0',
                        backgroundColor: isSelected ? colors.bg : 'transparent',
                      }}
                    >
                      <Icon
                        size={24}
                        className="mx-auto mb-1"
                        style={{ color: isSelected ? colors.icon : '#94a3b8' }}
                      />
                      <span
                        className="text-xs font-medium block"
                        style={{ color: isSelected ? colors.text : '#64748b' }}
                      >
                        {role.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* First Name and Last Name - Only for Sign Up */}
            {isSignUp && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <UserIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="John"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <UserIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-500 focus:ring-blue-500" 
                  />
                  <span className="text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition shadow-lg hover:shadow-xl"
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              text={isSignUp ? 'signup_with' : 'signin_with'}
              width="100%"
            />
          </div>

          {/* Toggle Sign Up/Sign In */}
          <div className="mt-6 text-center text-sm text-slate-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
