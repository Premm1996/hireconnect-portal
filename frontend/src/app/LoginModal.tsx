'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from './ForgotPasswordModal';

const ADMIN_EMAIL = "admin@hireconnect.com"; // Change to your admin email

interface Props {
  onLoginSuccess?: () => void;
  onBack?: () => void;
  onShowSignup?: () => void;
}

export default function LoginModal({ onLoginSuccess, onBack, onShowSignup }: Props) {
  const [loginType, setLoginType] = useState<'candidate' | 'admin' | ''>('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitted(true);
    setError('');
    setTimeout(() => {
      setFormSubmitted(false);
      if (loginType === 'admin') {
        if (formData.email !== ADMIN_EMAIL) {
          setError('Only the registered admin email can login as admin.');
          return;
        }
        if (onLoginSuccess) onLoginSuccess();
        router.push('/admin');
      } else {
        if (onLoginSuccess) onLoginSuccess();
        router.push(`/candidate-profile/123`);
      }
    }, 1200);
  }

  function handleSocialLogin(provider: 'google' | 'github') {
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      if (loginType === 'admin') {
        router.push('/admin');
      } else {
        router.push(`/candidate-profile/123`);
      }
    }, 1200);
  }

  if (!loginType) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-fade-in flex flex-col items-center">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Choose Login Type</h2>
          <button
            className="w-full py-3 rounded-lg bg-cyan-500 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all mb-4"
            onClick={() => setLoginType('candidate')}
          >
            Candidate Login
          </button>
          <button
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            onClick={() => setLoginType('admin')}
          >
            Admin Login
          </button>
          <button
            className="mt-6 text-cyan-400 hover:underline text-sm"
            onClick={onBack}
          >
            &#8592; Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
        <button
          className="absolute top-4 left-4 text-slate-400 hover:text-cyan-400 text-xl"
          onClick={onBack}
        >
          &#8592; Back
        </button>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">{loginType === 'admin' ? 'Admin Login' : 'Candidate Login'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none transition"
          />
          {error && <div className="text-red-400 text-center">{error}</div>}
          <div className="flex justify-between items-center">
            <button
              type="button"
              className="text-cyan-400 hover:underline text-sm"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
            <button
              type="button"
              className="text-cyan-400 hover:underline text-sm"
              onClick={onShowSignup}
            >
              Signup / Create Account
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            disabled={formSubmitted}
          >
            {formSubmitted ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-6 flex flex-col gap-3">
          <button
            className="w-full py-2 rounded-lg bg-white text-slate-900 font-semibold shadow hover:bg-slate-100 flex items-center justify-center gap-2"
            onClick={() => handleSocialLogin('google')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><g><path fill="#EA4335" d="M12 11.5v2.9h4.1c-.2 1.1-1.3 3.2-4.1 3.2-2.5 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6c1.4 0 2.3.6 2.9 1.1l2.1-2.1C15.8 6.7 14 6 12 6 7.6 6 4 9.6 4 14s3.6 8 8 8c4.4 0 8-3.6 8-8 0-.5 0-.9-.1-1.3H12z"/></g></svg>
            Login with Gmail
          </button>
          <button
            className="w-full py-2 rounded-lg bg-slate-800 text-white font-semibold shadow hover:bg-slate-700 flex items-center justify-center gap-2"
            onClick={() => handleSocialLogin('github')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.484 2 12.021c0 4.418 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.893 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.339-2.221-.253-4.555-1.112-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 7.844c.85.004 1.705.115 2.504.338 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.847-2.337 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.417-.012 2.747 0 .267.18.578.688.48C19.137 20.186 22 16.437 22 12.021 22 6.484 17.523 2 12 2z"/></svg>
            Login with GitHub
          </button>
        </div>
        {showForgotPassword && (
          <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
        )}
      </div>
    </div>
  );
}
