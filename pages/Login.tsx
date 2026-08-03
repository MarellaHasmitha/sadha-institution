
import React, { useState, useEffect } from 'react';
import { useInstitution } from '../store/InstitutionContext';
import { UserRole } from '../types';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck, User as UserIcon, ArrowLeft, Send, Eye, EyeOff, Check, X } from 'lucide-react';

const Login: React.FC = () => {
  const { login, signup, resetPassword } = useInstitution();
  const [view, setView] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginAsAdmin, setIsLoginAsAdmin] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  // Password requirements state
  const [validations, setValidations] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  useEffect(() => {
    if (view === 'signup') {
      setValidations({
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[@$!%*?&]/.test(password),
      });
    }
  }, [password, view]);

  const isPasswordStrong = Object.values(validations).every(Boolean);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (view === 'signin') {
      const res = login(email, password, isLoginAsAdmin ? UserRole.ADMIN : UserRole.USER);
      if (res.success) {
        navigate(isLoginAsAdmin ? '/admin' : '/');
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    } else if (view === 'signup') {
      if (!isPasswordStrong) {
        setMessage({ text: 'Please satisfy all password security requirements.', type: 'error' });
        return;
      }
      const res = signup(name, email, password);
      if (res.success) {
        setMessage({ text: res.message, type: 'success' });
        setTimeout(() => setView('signin'), 1500);
      } else {
        setMessage({ text: res.message, type: 'error' });
      }
    } else if (view === 'forgot') {
      const res = resetPassword(email);
      setMessage({ text: res.message, type: res.success ? 'success' : 'error' });
    }
  };

  const ValidationItem = ({ label, met }: { label: string; met: boolean }) => (
    <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors ${met ? 'text-green-500' : 'text-gray-400'}`}>
      {met ? <Check size={12} /> : <X size={12} />}
      {label}
    </div>
  );

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 bg-[#fdfbf7]">
      <div className="max-w-md w-full">
        <div className="text-center mb-10 text-[#4a443d]">
          <div className="w-16 h-16 bg-[#c2b280] rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg mb-4">
            {isLoginAsAdmin ? <ShieldCheck size={32} /> : <UserIcon size={32} />}
          </div>
          <h1 className="text-3xl font-bold">
            {view === 'forgot' ? 'Reset Password' : 
             view === 'signup' ? 'Join Us' : 
             isLoginAsAdmin ? 'Admin Access' : 'Student Portal'}
          </h1>
          <p className="text-[#6b645a] mt-2">Sadha Institution • Secure Gateway</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-[#ede6d9]">
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-bold animate-fade-in-down ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            {view === 'signup' && (
              <div>
                <label className="block text-sm font-bold text-[#6b645a] mb-2 uppercase tracking-widest text-[11px]">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2b280]" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full pl-12 pr-4 py-3 bg-[#fcfaf7] border-2 border-transparent rounded-xl focus:border-[#c2b280] outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-[#6b645a] mb-2 uppercase tracking-widest text-[11px]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2b280]" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-[#fcfaf7] border-2 border-transparent rounded-xl focus:border-[#c2b280] outline-none transition"
                />
              </div>
            </div>

            {view !== 'forgot' && (
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-bold text-[#6b645a] uppercase tracking-widest text-[11px]">Password</label>
                  {view === 'signin' && (
                    <button type="button" onClick={() => setView('forgot')} className="text-xs text-[#c2b280] font-bold hover:underline">Forgot?</button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c2b280]" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3 bg-[#fcfaf7] border-2 border-transparent rounded-xl focus:border-[#c2b280] outline-none transition"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c2b280] transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {view === 'signup' && (
                  <div className="mt-4 p-4 bg-[#fcfaf7] rounded-2xl border border-[#ede6d9] space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Security Checklist</p>
                    <div className="grid grid-cols-2 gap-2">
                      <ValidationItem label="8+ Characters" met={validations.length} />
                      <ValidationItem label="Uppercase" met={validations.upper} />
                      <ValidationItem label="Lowercase" met={validations.lower} />
                      <ValidationItem label="Number" met={validations.number} />
                      <ValidationItem label="Special (@$!%*)" met={validations.special} />
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={view === 'signup' && !isPasswordStrong}
              className="w-full py-4 bg-[#c2b280] text-white rounded-xl font-bold text-lg hover:bg-[#a89462] transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {view === 'forgot' ? <><Send size={20}/> Send Reset Link</> : 
               view === 'signup' ? 'Create Secure Account' : 
               isLoginAsAdmin ? 'Admin Authentication' : 'Secure Login'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
            {view === 'signin' ? (
              <>
                <button onClick={() => { setView('signup'); setIsLoginAsAdmin(false); }} className="w-full text-center text-[#6b645a] font-medium hover:text-[#c2b280] transition">
                  New student? <span className="text-[#c2b280] font-bold">Sign Up Here</span>
                </button>
                <button onClick={() => { setIsLoginAsAdmin(!isLoginAsAdmin); setView('signin'); }} className="w-full text-center text-[#c2b280] font-bold hover:underline text-sm">
                  {isLoginAsAdmin ? 'Switch to Student Portal' : 'Administrator Login'}
                </button>
              </>
            ) : (
              <button onClick={() => { setView('signin'); setPassword(''); }} className="w-full text-center text-[#c2b280] font-bold flex items-center justify-center gap-2 hover:underline">
                <ArrowLeft size={16} /> Back to Login
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
