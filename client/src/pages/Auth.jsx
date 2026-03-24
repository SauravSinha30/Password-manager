import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
  // Toggle between Login and Sign Up modes
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (isLogin) {
        const res = await axios.post('http://localhost:3000/api/auth/login', { email: form.email, password: form.password });
        localStorage.setItem('token', res.data.token);
        navigate('/'); // Redirect to Manager
        } else {
        // ... check confirmPassword ...
        const res = await axios.post('http://localhost:3000/api/auth/register', { email: form.email, password: form.password });
        localStorage.setItem('token', res.data.token);
        navigate('/'); // Redirect to Manager
        }
    } catch (err) {
        alert(err.response?.data?.error || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-8 flex flex-col gap-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-zinc-100 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="text-zinc-400 text-sm">
            {isLogin ? 'Enter your credentials to access your vault.' : 'Set up your master password to get started.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Email</label>
            <input 
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-600" 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange} 
              placeholder="you@example.com" 
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Master Password</label>
            <input 
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-600" 
              type="password" 
              name="password" 
              value={form.password} 
              onChange={handleChange} 
              placeholder="••••••••••••" 
              required 
            />
          </div>

          {/* Only show Confirm Password if creating a new account */}
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Confirm Master Password</label>
              <input 
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-zinc-600" 
                type="password" 
                name="confirmPassword" 
                value={form.confirmPassword} 
                onChange={handleChange} 
                placeholder="••••••••••••" 
                required 
              />
            </div>
          )}

          <button 
            type="submit" 
            className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(5,150,105,0.2)] hover:shadow-[0_0_25px_rgba(5,150,105,0.4)] active:scale-95"
          >
            {isLogin ? 'Sign In' : 'Create Vault'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-sm text-zinc-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setForm({ email: '', password: '', confirmPassword: '' }); }}
            className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Auth;