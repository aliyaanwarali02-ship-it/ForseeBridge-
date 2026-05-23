import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginAs } = useAppContext();

  const [step, setStep] = useState('role'); // 'role' | 'form'
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setStep('form');
    setError('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!password.trim()) { setError('Please enter your password.'); return; }

    setIsLoading(true);
    setError('');

    // Simulate auth (1.5s)
    setTimeout(() => {
      loginAs(selectedRole);
      navigate(`/${selectedRole}`);
    }, 1500);
  };

  const accentColor = selectedRole === 'founder' ? 'emerald' : 'blue';

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-[120px] pointer-events-none bg-${accentColor === 'emerald' ? 'emerald' : 'blue'}-500 transition-all duration-700`} />

      <button
        onClick={() => step === 'form' ? setStep('role') : navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> {step === 'form' ? 'Change Role' : 'Back to Home'}
      </button>

      <div className="text-center mb-10">
        <img src="/logo.png" alt="Foresee Bridge" className="w-12 h-12 mx-auto mb-5 opacity-90" style={{filter:'invert(1)'}} />
        <h1 className="text-3xl font-black text-white tracking-tighter mb-2">FORESEE BRIDGE</h1>
        <p className="text-zinc-500 text-sm">
          {step === 'role' ? 'Select how you want to access the platform.' : `Signing in as ${selectedRole === 'founder' ? 'a Founder' : 'an Investor'}`}
        </p>
      </div>

      {/* STEP 1: Role Selection */}
      {step === 'role' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-2xl animate-in slide-in-from-bottom-4">
          {/* Founder */}
          <button
            onClick={() => handleRoleSelect('founder')}
            className="group cursor-pointer bg-[#0c0c0c] border border-white/5 hover:border-emerald-500/50 p-8 rounded-3xl text-center transition-all hover:scale-[1.02] shadow-2xl text-left"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition-colors">
              <User className="w-8 h-8 text-emerald-500" />
            </div>
            <h2 className="text-xl font-black text-white mb-2 tracking-tight">Founder Portal</h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-5">
              Build your AI-optimized profile, verify your business, and match with global investors.
            </p>
            <div className="w-full py-3 bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold text-sm text-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
              Continue as Founder →
            </div>
          </button>

          {/* Investor */}
          <button
            onClick={() => handleRoleSelect('investor')}
            className="group cursor-pointer bg-[#0c0c0c] border border-white/5 hover:border-blue-500/50 p-8 rounded-3xl text-center transition-all hover:scale-[1.02] shadow-2xl text-left"
          >
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition-colors">
              <Briefcase className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-black text-white mb-2 tracking-tight">Investor Portal</h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-5">
              Discover verified emerging-market opportunities with AI-structured profiles.
            </p>
            <div className="w-full py-3 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl font-bold text-sm text-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              Continue as Investor →
            </div>
          </button>
        </div>
      )}

      {/* STEP 2: Email + Password */}
      {step === 'form' && (
        <div className="w-full max-w-md animate-in slide-in-from-bottom-4">
          {/* Role badge */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-black uppercase tracking-widest ${selectedRole === 'founder' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
              {selectedRole === 'founder' ? <User className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
              {selectedRole === 'founder' ? 'Founder Portal' : 'Investor Portal'}
            </div>
          </div>

          <div className="bg-[#0c0c0c] border border-white/8 rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Sign In</h2>
            <p className="text-zinc-500 text-sm mb-8">Enter your credentials to access your dashboard.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@company.com"
                    className={`w-full bg-[#111] border rounded-xl pl-11 pr-4 py-3.5 text-sm text-white outline-none transition-all placeholder:text-zinc-600 ${selectedRole === 'founder' ? 'border-white/10 focus:border-emerald-500/50' : 'border-white/10 focus:border-blue-500/50'}`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className={`w-full bg-[#111] border rounded-xl pl-11 pr-12 py-3.5 text-sm text-white outline-none transition-all placeholder:text-zinc-600 ${selectedRole === 'founder' ? 'border-white/10 focus:border-emerald-500/50' : 'border-white/10 focus:border-blue-500/50'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold">
                  {error}
                </div>
              )}

              {/* Forgot password */}
              <div className="text-right">
                <button type="button" className="text-xs text-zinc-500 hover:text-white transition-colors font-bold">
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl font-black text-white text-sm uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3 ${selectedRole === 'founder' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20'}`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Sign In to {selectedRole === 'founder' ? 'Founder' : 'Investor'} Portal
                  </>
                )}
              </button>

              <p className="text-center text-xs text-zinc-600 pt-2">
                Don't have an account?{' '}
                <button type="button" className={`font-bold ${selectedRole === 'founder' ? 'text-emerald-500' : 'text-blue-500'} hover:underline`}>
                  Request Access
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
