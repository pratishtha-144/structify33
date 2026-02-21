import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, User, Lock, Chrome, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030304] text-white overflow-hidden relative selection:bg-brand-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-900/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md p-8 md:p-10 glass-card mx-4 relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center border border-brand-500/30">
              <Database className="w-6 h-6 text-brand-400" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Structify</span>
          </Link>
          <h2 className="text-3xl font-bold text-center tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-center text-sm">Sign in to uncover structured intelligence.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all font-medium"
                placeholder="Email address"
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all font-medium"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input type="checkbox" className="form-checkbox bg-white/5 border-white/10 rounded text-brand-500 w-4 h-4 focus:ring-0 focus:ring-offset-0 transition-all" />
              <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
            </label>
            <a href="#" className="text-brand-400 hover:text-brand-300 transition-colors font-medium">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="w-full glow-button bg-brand-600 hover:bg-brand-500 text-white font-medium py-3 rounded-xl transition-all flex justify-center items-center space-x-2"
          >
            <span>Login to Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#030304] px-4 text-sm text-gray-500 glass-card py-1 rounded-full border-none">or continue with</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 text-black font-medium py-3 rounded-xl transition-all disabled:opacity-50"
          >
            <Chrome className="w-5 h-5 text-black" />
            <span>Login with Google</span>
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
            Create Account
          </a>
        </p>
      </motion.div>
    </div>
  );
}
