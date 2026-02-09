
import React, { useState } from 'react';
import { X, Mail, Lock, Phone, ArrowRight, Loader2, Smartphone, ChevronLeft, GraduationCap, Briefcase, Building2, Building, Code2, Users, User, Rocket, CheckSquare, Square } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type AuthMode = 'login' | 'signup_role' | 'signup_persona' | 'signup_details' | 'signup_verify' | 'otp' | 'recovery';
type RoleType = 'Individual' | 'Business' | 'Builder';
type PersonaType = 'Student' | 'Professional' | 'Business' | 'Enterprise' | 'Creator';

const LoginModal: React.FC = () => {
  const { closeLoginModal, login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Flow State
  const [selectedRole, setSelectedRole] = useState<RoleType>('Individual');
  const [selectedPersona, setSelectedPersona] = useState<PersonaType>('Professional');
  
  // Data State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [personaData, setPersonaData] = useState<any>({});

  // Reset function
  const resetState = () => {
      setMode('login');
      setError('');
      setUsername('');
      setPassword('');
      setEmail('');
      setPhone('');
      setOtp('');
      setIsPhoneVerified(false);
      setTermsAccepted(false);
      setPersonaData({});
  };

  const handleClose = () => {
      closeLoginModal();
      setTimeout(resetState, 300);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(username, password);
      if (!user) {
        setError('Invalid credentials. Try admin / 12345');
      } else if (user.role === 'builder') {
          navigate('/builder/console');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone) {
        setError('Please enter a phone number.');
        return;
    }
    setLoading(true);
    setError('');
    // Simulate OTP network call
    await new Promise(resolve => setTimeout(resolve, 1200));
    alert(`OTP sent to ${phone}: 123456`);
    setLoading(false);
  };

  const handleVerifyOTP = () => {
      if (otp === '123456') {
          setIsPhoneVerified(true);
          setError('');
      } else {
          setError('Invalid OTP. Try 123456');
      }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
        setError('You must accept the Terms & Conditions.');
        return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const userRole = selectedRole === 'Builder' ? 'builder' : 'buyer';
      // Merge persona data into user profile logic
      const user = await signup(username, email, password, {
          role: userRole,
          phone: phone,
          persona: selectedPersona,
          twoFactorEnabled: twoFactor,
          ...personaData
      });
      
      if (user && user.role === 'builder') {
          navigate('/builder/console');
      }
    } catch (err) {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updatePersonaData = (field: string, value: string) => {
      setPersonaData({ ...personaData, [field]: value });
  };

  // Render Helpers
  const renderPersonaFields = () => {
      switch(selectedPersona) {
          case 'Student':
              return (
                  <>
                    <input type="text" placeholder="University / Institution" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" onChange={e => updatePersonaData('university', e.target.value)} />
                    <input type="text" placeholder="Major / Focus" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" onChange={e => updatePersonaData('major', e.target.value)} />
                  </>
              );
          case 'Professional':
              return (
                  <>
                    <input type="text" placeholder="Job Title" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" onChange={e => updatePersonaData('jobTitle', e.target.value)} />
                    <input type="text" placeholder="Industry" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" onChange={e => updatePersonaData('industry', e.target.value)} />
                  </>
              );
          case 'Business':
              return (
                  <>
                    <input type="text" placeholder="Company Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" onChange={e => updatePersonaData('company', e.target.value)} />
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={e => updatePersonaData('teamSize', e.target.value)}>
                        <option value="">Select Team Size</option>
                        <option>1-10 Employees</option>
                        <option>11-50 Employees</option>
                        <option>50+ Employees</option>
                    </select>
                  </>
              );
          case 'Enterprise':
              return (
                  <>
                    <input type="text" placeholder="Organization Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" onChange={e => updatePersonaData('company', e.target.value)} />
                    <input type="text" placeholder="Department" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" onChange={e => updatePersonaData('department', e.target.value)} />
                  </>
              );
          case 'Creator':
              return (
                  <>
                    <input type="text" placeholder="Portfolio / Website" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" onChange={e => updatePersonaData('website', e.target.value)} />
                    <input type="text" placeholder="Primary Skill (e.g. Python)" className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow" onChange={e => updatePersonaData('expertise', e.target.value)} />
                  </>
              );
          default: return null;
      }
  };

  const getPersonasForRole = (role: RoleType) => {
      switch(role) {
          case 'Individual':
              return [
                  { id: 'Student', icon: GraduationCap, desc: 'Education & Learning' },
                  { id: 'Professional', icon: Briefcase, desc: 'Career & Productivity' }
              ];
          case 'Business':
              return [
                  { id: 'Business', icon: Users, desc: 'Teams & Startups' },
                  { id: 'Enterprise', icon: Building, desc: 'Security & Compliance' }
              ];
          case 'Builder':
              return [
                  { id: 'Creator', icon: Code2, desc: 'Independent Developer' },
                  { id: 'Creator', label: 'Agency / Partner', icon: Rocket, desc: 'Build for Clients' }
              ];
      }
  };

  if (!useAuth().isLoginModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">
                    {mode === 'login' && 'Welcome Back'}
                    {mode === 'signup_role' && 'Choose Account Type'}
                    {mode === 'signup_persona' && 'Select Persona'}
                    {mode === 'signup_details' && 'Complete Profile'}
                    {mode === 'signup_verify' && 'Secure Account'}
                    {(mode === 'otp' || mode === 'recovery') && 'Account Access'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    {mode === 'login' && 'Enter your details to access your account.'}
                    {mode === 'signup_role' && 'How do you plan to use NexusAI?'}
                    {mode === 'signup_persona' && `Tailoring experience for ${selectedRole}...`}
                    {mode === 'signup_details' && 'Tell us a bit about yourself.'}
                    {mode === 'signup_verify' && 'Verify your identity to proceed.'}
                </p>
            </div>
            <button 
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 overflow-y-auto custom-scrollbar">
            
            {/* LOGIN MODE */}
            {mode === 'login' && (
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email or Username</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                            <input 
                                type="text" required 
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="admin"
                                value={username} onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mb-1">
                            <label className="block text-xs font-medium text-gray-700">Password</label>
                            <button type="button" onClick={() => setMode('recovery')} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Forgot password?</button>
                        </div>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                            <input 
                                type="password" required 
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                placeholder="••••••"
                                value={password} onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {error && <p className="text-center text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

                    <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-70 flex justify-center items-center">
                        {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : <>Sign In <ArrowRight className="ml-2 w-4 h-4"/></>}
                    </button>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account? <button type="button" onClick={() => setMode('signup_role')} className="font-semibold text-indigo-600 hover:text-indigo-500">Sign up</button>
                    </div>
                </form>
            )}

            {/* STEP 1: ROLE */}
            {mode === 'signup_role' && (
                <div className="space-y-3 animate-fade-in">
                    <button type="button" onClick={() => setMode('login')} className="text-xs text-gray-500 hover:text-gray-900 mb-2 flex items-center"><ChevronLeft className="w-3 h-3 mr-1"/> Back to Login</button>
                    
                    {[
                        { id: 'Individual', icon: User, desc: 'For personal use' },
                        { id: 'Business', icon: Building2, desc: 'For teams & organizations' },
                        { id: 'Builder', icon: Code2, desc: 'Sell & distribute agents' }
                    ].map(r => (
                        <button 
                            key={r.id}
                            onClick={() => { setSelectedRole(r.id as RoleType); setMode('signup_persona'); }}
                            className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group"
                        >
                            <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-white transition-colors">
                                <r.icon className="w-6 h-6 text-gray-600 group-hover:text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <h4 className="font-bold text-gray-900">{r.id}</h4>
                                <p className="text-xs text-gray-500">{r.desc}</p>
                            </div>
                            <ChevronLeft className="w-5 h-5 text-gray-400 ml-auto rotate-180" />
                        </button>
                    ))}
                </div>
            )}

            {/* STEP 2: PERSONA */}
            {mode === 'signup_persona' && (
                <div className="space-y-3 animate-fade-in">
                    <button type="button" onClick={() => setMode('signup_role')} className="text-xs text-gray-500 hover:text-gray-900 mb-2 flex items-center"><ChevronLeft className="w-3 h-3 mr-1"/> Change Role</button>
                    
                    {getPersonasForRole(selectedRole).map((p, idx) => (
                        <button 
                            key={idx}
                            onClick={() => { setSelectedPersona(p.id as PersonaType); setMode('signup_details'); }}
                            className="w-full flex items-center p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group"
                        >
                            <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-white transition-colors">
                                <p.icon className="w-6 h-6 text-gray-600 group-hover:text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <h4 className="font-bold text-gray-900">{p.label || p.id}</h4>
                                <p className="text-xs text-gray-500">{p.desc}</p>
                            </div>
                            <ChevronLeft className="w-5 h-5 text-gray-400 ml-auto rotate-180" />
                        </button>
                    ))}
                </div>
            )}

            {/* STEP 3: DETAILS */}
            {mode === 'signup_details' && (
                <form className="space-y-4 animate-fade-in" onSubmit={(e) => { e.preventDefault(); setMode('signup_verify'); }}>
                    <button type="button" onClick={() => setMode('signup_persona')} className="text-xs text-gray-500 hover:text-gray-900 mb-2 flex items-center"><ChevronLeft className="w-3 h-3 mr-1"/> Change Persona</button>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" required className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Jane Doe" value={username} onChange={e => setUsername(e.target.value)} />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                            <input type="email" required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="jane@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                    </div>

                    {renderPersonaFields()}

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Mobile Number (For Verification)</label>
                        <div className="relative">
                            <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                            <input type="tel" required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="+1 234 567 8900" value={phone} onChange={e => setPhone(e.target.value)} />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 flex justify-center items-center">
                        Continue to Verification <ArrowRight className="ml-2 w-4 h-4"/>
                    </button>
                </form>
            )}

            {/* STEP 4: VERIFICATION */}
            {mode === 'signup_verify' && (
                <div className="space-y-5 animate-fade-in">
                    <button type="button" onClick={() => setMode('signup_details')} className="text-xs text-gray-500 hover:text-gray-900 flex items-center"><ChevronLeft className="w-3 h-3 mr-1"/> Back</button>
                    
                    {!isPhoneVerified ? (
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-indigo-600">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1">Verify Mobile</h3>
                            <p className="text-xs text-gray-500 mb-4">Code sent to {phone || 'your phone'}</p>
                            
                            <div className="flex gap-2 justify-center mb-4">
                                <input type="text" placeholder="123456" maxLength={6} className="w-32 text-center text-lg font-bold tracking-widest py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={otp} onChange={e => setOtp(e.target.value)} />
                            </div>
                            
                            <div className="flex gap-2">
                                <button onClick={handleSendOTP} disabled={loading} className="flex-1 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-white">{loading ? 'Sending...' : 'Send/Resend Code'}</button>
                                <button onClick={handleVerifyOTP} className="flex-1 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Verify</button>
                            </div>
                            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                        </div>
                    ) : (
                        <form className="space-y-4 animate-fade-in" onSubmit={handleSignup}>
                            <div className="bg-green-50 p-3 rounded-lg flex items-center text-green-700 text-sm mb-4 border border-green-200">
                                <CheckSquare className="w-5 h-5 mr-2" /> Phone Verified Successfully
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Create Password</label>
                                <div className="relative">
                                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                                    <input type="password" required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)} />
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <button type="button" onClick={() => setTwoFactor(!twoFactor)} className="mt-0.5 text-gray-400 hover:text-indigo-600 transition-colors">
                                    {twoFactor ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5" />}
                                </button>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Enable Two-Factor Auth (2FA)</p>
                                    <p className="text-xs text-gray-500">Secure your account with authenticator app.</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <button type="button" onClick={() => setTermsAccepted(!termsAccepted)} className="mt-0.5 text-gray-400 hover:text-indigo-600 transition-colors">
                                    {termsAccepted ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5" />}
                                </button>
                                <p className="text-xs text-gray-600 leading-tight">
                                    I agree to the <span className="text-indigo-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-indigo-600 hover:underline cursor-pointer">Privacy Policy</span>.
                                </p>
                            </div>

                            {error && <p className="text-center text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

                            <button type="submit" disabled={loading || !termsAccepted} className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin"/> : 'Create Account'}
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* OTP / Recovery Placeholders - Keeping old code logic accessible if needed */}
            {(mode === 'otp' || mode === 'recovery') && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">Feature currently unavailable in this demo flow. Please use password login.</p>
                    <button onClick={() => setMode('login')} className="text-indigo-600 text-sm font-medium hover:underline">Back to Login</button>
                </div>
            )}
            
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
