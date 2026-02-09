
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTheme } from '../context/ThemeContext';
import { Globe, Bell, Lock, Smartphone, Shield, ChevronRight, LogOut, Eye, CreditCard, User as UserIcon, ToggleRight, ToggleLeft } from 'lucide-react';
import { CurrencyCode } from '../types';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const { mode, setMode } = useTheme();
  
  // Tabs for mobile or simpler navigation if needed
  const [activeSection, setActiveSection] = useState('general');

  // Security State
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'app' | 'sms'>('app');

  // Privacy State
  const [profileVisibility, setProfileVisibility] = useState('public'); // public, community, private

  // Notification State
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  if (!user) return <div className="p-8">Please login to view this page.</div>;

  const handlePasswordChange = (e: React.FormEvent) => {
      e.preventDefault();
      if (newPass !== confirmPass) {
          alert("New passwords do not match.");
          return;
      }
      // Simulate API
      setTimeout(() => {
          alert("Password updated successfully.");
          setShowPasswordChange(false);
          setOldPass(''); setNewPass(''); setConfirmPass('');
      }, 500);
  };

  const handle2FAToggle = () => {
      if (!twoFactorEnabled) {
          const method = prompt("Choose 2FA method: Type 'app' for Authenticator App or 'sms' for SMS", "app");
          if (!method) return;
          
          setTwoFactorMethod(method.toLowerCase().includes('sms') ? 'sms' : 'app');
          
          const code = prompt(`Enter the code sent to your ${method.toLowerCase().includes('sms') ? 'phone' : 'authenticator app'} to enable 2FA:`);
          if (code === '123456') { // Mock check
              setTwoFactorEnabled(true);
              alert("2FA Enabled successfully.");
          } else if (code) {
              alert("Invalid code.");
          }
      } else {
          if(confirm("Are you sure you want to disable 2FA? This will lower your account security.")) {
              setTwoFactorEnabled(false);
          }
      }
  };

  const handleLogoutAll = () => {
      if(confirm("Are you sure you want to log out of all devices? You will need to sign in again.")) {
          alert("All other sessions have been terminated.");
      }
  };

  return (
    <div className="min-h-screen bg-theme-bg-sec py-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-theme-text mb-2">Settings</h1>
        <p className="text-theme-text-sec mb-8">Manage your account, preferences, and security settings.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="hidden md:block space-y-1">
                <button onClick={() => setActiveSection('general')} className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeSection === 'general' ? 'bg-indigo-50 text-indigo-700' : 'text-theme-text-sec hover:bg-theme-bg-sec hover:text-theme-text'}`}>
                    Account & Profile
                </button>
                <button onClick={() => setActiveSection('preferences')} className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeSection === 'preferences' ? 'bg-indigo-50 text-indigo-700' : 'text-theme-text-sec hover:bg-theme-bg-sec hover:text-theme-text'}`}>
                    Preferences
                </button>
                <button onClick={() => setActiveSection('security')} className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeSection === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-theme-text-sec hover:bg-theme-bg-sec hover:text-theme-text'}`}>
                    Security
                </button>
                <button onClick={() => setActiveSection('privacy')} className={`w-full text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeSection === 'privacy' ? 'bg-indigo-50 text-indigo-700' : 'text-theme-text-sec hover:bg-theme-bg-sec hover:text-theme-text'}`}>
                    Privacy
                </button>
            </div>

            <div className="md:col-span-3 space-y-8">
                
                {/* Account Section */}
                <div id="general" className={`${activeSection !== 'general' && 'hidden md:block'}`}>
                    <section className="bg-theme-card rounded-2xl shadow-sm border border-theme-border p-6">
                        <h3 className="text-lg font-bold text-theme-text mb-6 flex items-center">
                            <UserIcon className="w-5 h-5 mr-2 text-indigo-600" /> Account & Profile
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-theme-bg-sec rounded-xl border border-theme-border">
                                <div className="flex items-center gap-4">
                                    <img src={user.avatar} className="w-14 h-14 rounded-full border border-theme-border" alt="" />
                                    <div>
                                        <p className="font-bold text-theme-text text-lg">{user.name}</p>
                                        <p className="text-sm text-theme-text-sec">{user.email}</p>
                                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded mt-1 inline-block">{user.persona}</span>
                                    </div>
                                </div>
                                <Link to="/profile/account" className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                                    Edit Profile
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Preferences Section */}
                <div id="preferences" className={`${activeSection !== 'preferences' && 'hidden md:block'}`}>
                    <section className="bg-theme-card rounded-2xl shadow-sm border border-theme-border p-6">
                        <h3 className="text-lg font-bold text-theme-text mb-6 flex items-center">
                            <Globe className="w-5 h-5 mr-2 text-indigo-600" /> Preferences
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-theme-text mb-2">Display Currency</label>
                                    <select 
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                                        className="block w-full px-3 py-2 bg-theme-bg-sec text-theme-text border border-theme-border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
                                    >
                                        <option value="INR">Indian Rupee (INR)</option>
                                        <option value="USD">US Dollar (USD)</option>
                                        <option value="EUR">Euro (EUR)</option>
                                        <option value="GBP">British Pound (GBP)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-theme-text mb-2">Visual Theme</label>
                                    <div className="flex bg-theme-bg-sec p-1 rounded-lg border border-theme-border">
                                        <button
                                            onClick={() => setMode('professional')}
                                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'professional' ? 'bg-white shadow-sm text-indigo-600' : 'text-theme-text-sec hover:text-theme-text'}`}
                                        >
                                            Professional
                                        </button>
                                        <button
                                            onClick={() => setMode('sharp')}
                                            className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${mode === 'sharp' ? 'bg-slate-700 shadow-sm text-white' : 'text-theme-text-sec hover:text-theme-text'}`}
                                        >
                                            Sharp
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-theme-border pt-6">
                                <h4 className="text-sm font-bold text-theme-text mb-4 flex items-center"><Bell className="w-4 h-4 mr-2"/> Notification Settings</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-theme-text">Email Notifications</p>
                                            <p className="text-xs text-theme-text-sec">Receive updates about your account and purchases.</p>
                                        </div>
                                        <button onClick={() => setNotifEmail(!notifEmail)} className={`text-2xl transition-colors ${notifEmail ? 'text-indigo-600' : 'text-gray-300'}`}>
                                            {notifEmail ? <ToggleRight className="w-8 h-8"/> : <ToggleLeft className="w-8 h-8"/>}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-theme-text">Push Notifications</p>
                                            <p className="text-xs text-theme-text-sec">Get real-time alerts for community replies.</p>
                                        </div>
                                        <button onClick={() => setNotifPush(!notifPush)} className={`text-2xl transition-colors ${notifPush ? 'text-indigo-600' : 'text-gray-300'}`}>
                                            {notifPush ? <ToggleRight className="w-8 h-8"/> : <ToggleLeft className="w-8 h-8"/>}
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-theme-text">Marketing & Tips</p>
                                            <p className="text-xs text-theme-text-sec">Receive product news and helpful tips.</p>
                                        </div>
                                        <button onClick={() => setNotifMarketing(!notifMarketing)} className={`text-2xl transition-colors ${notifMarketing ? 'text-indigo-600' : 'text-gray-300'}`}>
                                            {notifMarketing ? <ToggleRight className="w-8 h-8"/> : <ToggleLeft className="w-8 h-8"/>}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Security Section */}
                <div id="security" className={`${activeSection !== 'security' && 'hidden md:block'}`}>
                    <section className="bg-theme-card rounded-2xl shadow-sm border border-theme-border p-6">
                        <h3 className="text-lg font-bold text-theme-text mb-6 flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-indigo-600" /> Security
                        </h3>
                        
                        <div className="space-y-6">
                            {/* Change Password */}
                            <div className="border-b border-theme-border pb-6">
                                <button 
                                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                                    className="flex justify-between items-center w-full text-left group"
                                >
                                    <div>
                                        <p className="font-medium text-theme-text group-hover:text-indigo-600 transition-colors">Change Password</p>
                                        <p className="text-xs text-theme-text-sec">Update your password regularly to keep your account secure</p>
                                    </div>
                                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showPasswordChange ? 'rotate-90' : ''}`} />
                                </button>

                                {showPasswordChange && (
                                    <form onSubmit={handlePasswordChange} className="mt-4 space-y-3 bg-theme-bg-sec p-4 rounded-xl border border-theme-border animate-fade-in">
                                        <input 
                                            type="password" 
                                            placeholder="Current Password" 
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={oldPass} onChange={e => setOldPass(e.target.value)} required
                                        />
                                        <input 
                                            type="password" 
                                            placeholder="New Password" 
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={newPass} onChange={e => setNewPass(e.target.value)} required
                                        />
                                        <input 
                                            type="password" 
                                            placeholder="Confirm New Password" 
                                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={confirmPass} onChange={e => setConfirmPass(e.target.value)} required
                                        />
                                        <div className="flex justify-end pt-2">
                                            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 shadow-sm">Update Password</button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            {/* 2FA */}
                            <div className="flex items-center justify-between border-b border-theme-border pb-6">
                                <div>
                                    <p className="font-medium text-theme-text">Two-Factor Authentication</p>
                                    <p className="text-xs text-theme-text-sec">Add an extra layer of security via SMS or Auth App.</p>
                                </div>
                                <button 
                                    onClick={handle2FAToggle}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${twoFactorEnabled ? 'bg-indigo-600' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            
                            {/* Sessions */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="font-medium text-theme-text">Active Sessions</p>
                                        <p className="text-xs text-theme-text-sec">Manage devices logged into your account</p>
                                    </div>
                                    <button onClick={handleLogoutAll} className="text-xs text-red-600 font-medium hover:underline border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                                        Log out all devices
                                    </button>
                                </div>
                                <div className="p-3 bg-theme-bg-sec rounded-lg border border-theme-border flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Smartphone className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium text-theme-text">MacBook Pro - Chrome</p>
                                            <p className="text-xs text-theme-text-sec">San Francisco, CA • Current Session</p>
                                        </div>
                                    </div>
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Privacy Section */}
                <div id="privacy" className={`${activeSection !== 'privacy' && 'hidden md:block'}`}>
                    <section className="bg-theme-card rounded-2xl shadow-sm border border-theme-border p-6">
                        <h3 className="text-lg font-bold text-theme-text mb-6 flex items-center">
                            <Eye className="w-5 h-5 mr-2 text-indigo-600" /> Privacy Settings
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-theme-text mb-2">Profile Visibility</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {['public', 'community', 'private'].map(vis => (
                                        <button
                                            key={vis}
                                            onClick={() => setProfileVisibility(vis)}
                                            className={`py-2 px-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                                                profileVisibility === vis 
                                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                                : 'bg-theme-bg-sec border-theme-border text-theme-text-sec hover:text-theme-text'
                                            }`}
                                        >
                                            {vis}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-theme-text-sec mt-2">
                                    {profileVisibility === 'public' && "Anyone on the internet can see your basic profile."}
                                    {profileVisibility === 'community' && "Only logged-in members can see your profile."}
                                    {profileVisibility === 'private' && "Your profile is hidden from everyone except you."}
                                </p>
                            </div>
                            
                            <div className="pt-4 border-t border-theme-border">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-theme-text">Show Purchase History</p>
                                        <p className="text-xs text-theme-text-sec">Allow others to see agents you've bought/reviewed.</p>
                                    </div>
                                    <button className="text-2xl text-gray-300">
                                        <ToggleLeft className="w-8 h-8"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="pt-4 border-t border-theme-border">
                    <button onClick={logout} className="text-red-600 font-medium text-sm flex items-center hover:bg-red-50 p-2.5 rounded-lg transition-colors w-full justify-center border border-transparent hover:border-red-100">
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out of NexusAI
                    </button>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
