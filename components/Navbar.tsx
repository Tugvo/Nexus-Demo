
import React, { useState, useEffect } from 'react';
import { Menu, User as UserIcon, Hexagon, Zap, Users, PenTool, Globe, LayoutGrid, LogIn, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { User, CurrencyCode } from '../types';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';
import BecomeBuilderModal from './Auth/BecomeBuilderModal';

interface NavbarProps {
  currentUser: User;
  onToggleRole: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onToggleRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currency, setCurrency, isLoading } = useCurrency();
  const { openLoginModal } = useAuth();
  const { mode, setMode } = useTheme();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  // Scroll effect listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isGuest = currentUser.id === 'guest';
  const isBuilder = currentUser.role === 'builder' || currentUser.role === 'admin';

  const toggleTheme = () => {
    setMode(mode === 'professional' ? 'sharp' : 'professional');
  };

  const handleSellAgents = () => {
    if (isGuest) {
      openLoginModal();
    } else {
      setShowBuilderModal(true);
    }
  };

  return (
    <>
      <BecomeBuilderModal isOpen={showBuilderModal} onClose={() => setShowBuilderModal(false)} />
      
      <nav className={`sticky top-0 z-50 w-full bg-theme-card border-b border-theme-border transition-all duration-300 ${scrolled ? 'shadow-md py-2' : 'shadow-sm py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center cursor-pointer group">
                <Hexagon className="h-8 w-8 text-indigo-600 fill-indigo-100 group-hover:scale-110 transition-transform duration-300" />
                <span className="ml-2 text-xl font-bold text-theme-text tracking-tight group-hover:text-indigo-600 transition-colors">NexusAI</span>
              </Link>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link to="/" className={`relative inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${isActive('/') ? 'text-theme-text' : 'text-theme-text-sec hover:text-theme-text'}`}>
                  Discover
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-indigo-500 transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 hover:w-full'}`}></span>
                </Link>
                <Link to="/marketplace" className={`relative inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${isActive('/marketplace') ? 'text-theme-text' : 'text-theme-text-sec hover:text-theme-text'}`}>
                  Explore Agents
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-indigo-500 transition-all duration-300 ${isActive('/marketplace') ? 'w-full' : 'w-0 hover:w-full'}`}></span>
                </Link>
                <Link to="/community" className={`relative inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${isActive('/community') ? 'text-theme-text' : 'text-theme-text-sec hover:text-theme-text'}`}>
                  Community
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-indigo-500 transition-all duration-300 ${isActive('/community') ? 'w-full' : 'w-0 hover:w-full'}`}></span>
                </Link>
                
                {/* Builder Console Link OR Sell Agents CTA */}
                {isBuilder ? (
                  <Link to="/builder/console" className={`relative inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${isActive('/builder/console') || isActive('/dashboard') ? 'text-theme-text' : 'text-theme-text-sec hover:text-indigo-600'}`}>
                     Builder Console
                     <span className={`absolute bottom-0 left-0 h-0.5 bg-indigo-500 transition-all duration-300 ${isActive('/builder/console') || isActive('/dashboard') ? 'w-full' : 'w-0 hover:w-full'}`}></span>
                  </Link>
                ) : (
                  <button 
                    onClick={handleSellAgents}
                    className={`relative inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors text-theme-text-sec hover:text-indigo-600 group`}
                  >
                     Sell Agents
                     <span className="absolute bottom-0 left-0 h-0.5 bg-indigo-500 w-0 group-hover:w-full transition-all duration-300"></span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full text-theme-text-sec hover:text-theme-text hover:bg-theme-bg-sec transition-colors"
                title={mode === 'professional' ? 'Switch to Sharp Mode' : 'Switch to Professional Mode'}
              >
                {mode === 'professional' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {/* Currency Selector */}
              <div className="hidden md:flex items-center bg-theme-bg-sec rounded-md border border-theme-border px-2 py-1 hover:border-indigo-300 transition-colors">
                 <Globe className={`w-4 h-4 text-theme-text-sec mr-2 ${isLoading ? 'animate-pulse' : ''}`} />
                 <select 
                   value={currency} 
                   onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                   className="bg-transparent text-sm text-theme-text font-medium focus:outline-none cursor-pointer border-none outline-none"
                 >
                   <option value="INR" className="bg-theme-card text-theme-text">🇮🇳 INR (₹)</option>
                   <option value="USD" className="bg-theme-card text-theme-text">🇺🇸 USD ($)</option>
                   <option value="EUR" className="bg-theme-card text-theme-text">🇪🇺 EUR (€)</option>
                   <option value="GBP" className="bg-theme-card text-theme-text">🇬🇧 GBP (£)</option>
                 </select>
              </div>

              {/* Platform Switcher for Admin/Multi-role */}
              {!isGuest && currentUser.role === 'admin' && (
                  <button 
                    onClick={onToggleRole}
                    className="hidden md:inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none transition-colors"
                    title="Switch Platform"
                  >
                    <LayoutGrid className="w-3 h-3 mr-1" />
                    Switch App
                  </button>
              )}

              {isGuest ? (
                 <button 
                   onClick={openLoginModal}
                   className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all hover:scale-105"
                 >
                   <LogIn className="w-4 h-4 mr-2" />
                   Login / Sign in
                 </button>
              ) : (
                  <>
                      <NotificationDropdown />

                      {/* Profile Dropdown Trigger */}
                      <div className="ml-3 relative">
                        <div 
                          className="flex items-center space-x-2 cursor-pointer group" 
                          onClick={() => setShowProfileMenu(!showProfileMenu)}
                        >
                          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold shadow-sm overflow-hidden border border-theme-border group-hover:ring-2 ring-indigo-300 transition-all">
                             {currentUser.avatar ? (
                               <img src={currentUser.avatar} alt={currentUser.name} className="h-full w-full object-cover" />
                             ) : (
                               currentUser.name.charAt(0)
                             )}
                          </div>
                          <span className="hidden md:block text-sm font-medium text-theme-text group-hover:text-indigo-600 transition-colors">{currentUser.name}</span>
                        </div>
                        
                        {showProfileMenu && <ProfileDropdown onClose={() => setShowProfileMenu(false)} />}
                      </div>
                  </>
              )}
              
               <div className="flex items-center sm:hidden">
                  <Menu className="h-6 w-6 text-theme-text-sec" />
               </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
