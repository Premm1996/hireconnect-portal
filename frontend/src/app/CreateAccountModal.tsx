import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from './ForgotPasswordModal';

interface Props {
  onClose: () => void;
}

export default function CreateAccountModal({ onClose }: Props) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    agree: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const router = useRouter();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitted(true);
    // API call logic here
    setTimeout(() => {
      setFormSubmitted(false);
      onClose();
      router.push('/login'); // Redirect to login page
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-400 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none transition"
          />
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none transition"
          />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none transition"
          />
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                required
                className="accent-cyan-500"
              />
              Agree to Terms
            </label>
            <button
              type="button"
              className="text-cyan-400 hover:underline text-sm"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            disabled={formSubmitted}
          >
            {formSubmitted ? "Creating..." : "Create Account"}
          </button>
          {formSubmitted && (
            <div className="text-center text-cyan-400 mt-2 animate-pulse">
              Account created!
            </div>
          )}
        </form>
        {showForgotPassword && (
          <ForgotPasswordModal onClose={() => setShowForgotPassword(false)} />
        )}
      </div>
    </div>
  );
}
