
import React, { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, Box, Activity, Check } from 'lucide-react';
import { useCommunication } from '../context/CommunicationContext';
import { useNavigate } from 'react-router-dom';

const NotificationDropdown: React.FC = () => {
  const { notifications, unreadNotificationsCount, markNotificationRead, markAllNotificationsRead } = useCommunication();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);

  const handleNotificationClick = (notif: any) => {
      markNotificationRead(notif.id);
      setIsOpen(false);
      if (notif.type === 'chat_reply') {
          navigate('/chat');
      } else if (notif.type === 'version_update') {
          navigate(`/agent/${notif.refId}`);
      }
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'chat_reply': return <MessageSquare className="w-4 h-4 text-blue-500" />;
          case 'version_update': return <Box className="w-4 h-4 text-green-500" />;
          default: return <Activity className="w-4 h-4 text-gray-500" />;
      }
  };

  return (
    <div className="relative" ref={dropdownRef}>
        <button 
            className="p-2 text-theme-text-sec hover:text-theme-text relative"
            onClick={() => setIsOpen(!isOpen)}
        >
            <Bell className="h-6 w-6" />
            {unreadNotificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-theme-card"></span>
            )}
        </button>

        {isOpen && (
            <div className="absolute right-0 top-12 mt-2 w-80 rounded-xl shadow-lg bg-theme-card ring-1 ring-black ring-opacity-5 animate-scale-in z-50 origin-top-right focus:outline-none border border-theme-border">
                <div className="px-4 py-3 border-b border-theme-border flex justify-between items-center">
                    <h3 className="text-sm font-bold text-theme-text">Notifications</h3>
                    {unreadNotificationsCount > 0 && (
                        <button onClick={markAllNotificationsRead} className="text-xs text-indigo-600 hover:text-indigo-500 font-medium">
                            Mark all read
                        </button>
                    )}
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-theme-text-sec text-sm">
                            No notifications yet.
                        </div>
                    ) : (
                        notifications.map(notif => (
                            <div 
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={`px-4 py-3 hover:bg-theme-bg-sec cursor-pointer border-b border-theme-border last:border-0 transition-colors ${!notif.read ? 'bg-indigo-50/10' : ''}`}
                            >
                                <div className="flex gap-3">
                                    <div className="mt-1 flex-shrink-0">
                                        {getIcon(notif.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <p className={`text-sm ${!notif.read ? 'font-semibold text-theme-text' : 'font-medium text-theme-text-sec'}`}>
                                                {notif.title}
                                            </p>
                                            {!notif.read && <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5"></div>}
                                        </div>
                                        <p className="text-xs text-theme-text-sec mt-0.5 line-clamp-2">{notif.message}</p>
                                        <p className="text-[10px] text-theme-text-sec mt-1 opacity-70">
                                            {new Date(notif.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default NotificationDropdown;
