import React, { useState } from 'react';

interface Props {
  onClose: () => void;
}

export default function ForgotPasswordModal({ onClose }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // API call logic here
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-slate-400 hover:text-cyan-400 text-2xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-white mb-4 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-slate-800 text-white border border-slate-700 focus:border-cyan-400 outline-none transition"
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            disabled={submitted}
          >
            {submitted ? "Sending..." : "Send Reset Link"}
          </button>
          {submitted && (
            <div className="text-center text-cyan-400 mt-2 animate-pulse">
              Reset link sent!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
