
import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, LayoutGrid, Package, ShoppingBag, MessageSquare, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileDropdownProps {
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-12 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 animate-fade-in z-50 origin-top-right focus:outline-none"
    >
      <div className="py-2" role="menu" aria-orientation="vertical">
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-sm text-gray-500">Signed in as</p>
          <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
        </div>

        {/* Admin Link - Top Priority */}
        {user?.role === 'admin' && (
           <Link 
            to="/admin" 
            onClick={onClose}
            className="flex items-center px-4 py-2 text-sm text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 transition-colors font-medium border-b border-indigo-100"
           >
            <ShieldCheck className="mr-3 h-4 w-4" />
            Admin Dashboard
          </Link>
        )}

        <Link 
          to="/profile/account" 
          onClick={onClose}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
        >
          <User className="mr-3 h-4 w-4" />
          Account Info
        </Link>

        <Link 
          to="/chat" 
          onClick={onClose}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
        >
          <MessageSquare className="mr-3 h-4 w-4" />
          Messages
        </Link>

        <Link 
          to="/profile/portfolio" 
          onClick={onClose}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
        >
          <Package className="mr-3 h-4 w-4" />
          My Portfolio
        </Link>
        
        <Link 
          to="/profile/orders" 
          onClick={onClose}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
        >
          <ShoppingBag className="mr-3 h-4 w-4" />
          Order History
        </Link>
        
        {/* Only show builder console link if builder/admin */}
        {(user?.role === 'builder' || user?.role === 'admin') && (
           <Link 
            to="/builder/console" 
            onClick={onClose}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
           >
            <LayoutGrid className="mr-3 h-4 w-4" />
            Builder Console
          </Link>
        )}

        <Link 
          to="/profile/settings" 
          onClick={onClose}
          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
        >
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Link>

        <div className="border-t border-gray-100 mt-1 pt-1">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
