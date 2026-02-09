
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Platform } from '../types';
import { useTheme } from './ThemeContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, passkey: string) => Promise<User | null>;
  signup: (username: string, email: string, passkey: string, additionalData?: Partial<User>) => Promise<User | null>;
  logout: () => void;
  availablePlatforms: Platform[];
  currentPlatform: Platform | null;
  selectPlatform: (platformId: string) => void;
  showPlatformSelector: boolean;
  switchPlatform: () => void;
  // Modal State
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AVAILABLE_PLATFORMS: Platform[] = [
  {
    id: 'marketplace',
    name: 'Nexus Marketplace',
    description: 'Discover and buy AI agents',
    iconName: 'Hexagon',
    role: 'buyer',
    path: '/'
  },
  {
    id: 'builder_console',
    name: 'Builder Console',
    description: 'Create, manage and analyze agents',
    iconName: 'PenTool',
    role: 'builder',
    path: '/builder/console'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPlatformSelector, setShowPlatformSelector] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<Platform | null>(null);
  const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>([]);
  
  // Theme Hook
  const { setMode } = useTheme();

  // Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('nexus_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      determinePlatforms(parsedUser);
      // Sync theme if preference exists
      if (parsedUser.preferences?.theme) {
        setMode(parsedUser.preferences.theme);
      }
    }
  }, []);

  const determinePlatforms = (user: User) => {
    // Admin gets access to all platforms and sees selector
    if (user.role === 'admin' || user.name.toLowerCase().includes('admin')) {
      setAvailablePlatforms(AVAILABLE_PLATFORMS);
      
      const storedPlatformId = localStorage.getItem('nexus_platform_id');
      if (storedPlatformId) {
        const p = AVAILABLE_PLATFORMS.find(pl => pl.id === storedPlatformId);
        if (p) {
          setCurrentPlatform(p);
          setShowPlatformSelector(false);
          return;
        }
      }
      setShowPlatformSelector(true);
    } 
    // Builders get access to Console and Marketplace, but default to Console
    else if (user.role === 'builder') {
      setAvailablePlatforms(AVAILABLE_PLATFORMS);
      
      // Default to Builder Console for builders
      const consolePlatform = AVAILABLE_PLATFORMS.find(p => p.id === 'builder_console');
      if (consolePlatform) {
        setCurrentPlatform(consolePlatform);
        localStorage.setItem('nexus_platform_id', consolePlatform.id);
      }
      setShowPlatformSelector(false);
    }
    // Buyers only get Marketplace
    else {
      const userPlatforms = [AVAILABLE_PLATFORMS[0]];
      setAvailablePlatforms(userPlatforms);
      setCurrentPlatform(userPlatforms[0]);
      setShowPlatformSelector(false);
    }
  };

  const login = async (username: string, passkey: string): Promise<User | null> => {
    // Mock network delay to simulate backend authentication
    await new Promise(resolve => setTimeout(resolve, 800));

    // --- SECURE BACKEND SIMULATION ---
    // In a real production environment, these credentials would be verified 
    // against a secure database on the server, not in client-side code.
    
    // 1. Nexus Admin (Requested)
    if (username === 'admin123' && passkey === 'pass123') {
        const rootAdmin: User = {
            id: 'nexus_sys_admin',
            name: 'Nexus Administrator',
            avatar: 'https://ui-avatars.com/api/?name=Nexus+Admin&background=1e293b&color=fff',
            role: 'admin',
            verified: true,
            email: 'admin@nexus.ai',
            phone: '+1 (800) 555-0199',
            preferences: {
                currency: 'USD',
                theme: 'sharp',
                notifications: { email: true, community: true }
            },
            portfolio: { downloads: [], uploads: [], wishlist: [] },
            bio: 'Root System Administrator. Full access to Ecosystem controls.',
            persona: 'Enterprise',
            contributionScore: 10000,
            activePoints: 5000,
            joinedDate: 'Oct 2023',
            twoFactorEnabled: true
        };
        finishAuth(rootAdmin);
        return rootAdmin;
    }

    // 2. Demo Admin (Legacy)
    if (username.toLowerCase() === 'admin' && passkey === '12345') {
      const adminUser: User = {
        id: 'admin_01',
        name: 'Administrator',
        avatar: 'https://ui-avatars.com/api/?name=Admin&background=4f46e5&color=fff',
        role: 'admin',
        verified: true,
        email: 'admin@nexus.ai',
        phone: '+1 (555) 000-0000',
        preferences: {
          currency: 'USD',
          theme: 'sharp',
          notifications: { email: true, community: true }
        },
        portfolio: { downloads: [], uploads: [], wishlist: [] }
      };
      finishAuth(adminUser);
      return adminUser;
    }

    // 3. Demo User Login (Any non-empty credential for demo)
    if (username && passkey) {
      // Auto-assign builder role if username contains "builder" for testing
      const role = username.toLowerCase().includes('builder') ? 'builder' : 'buyer';
      
      const demoUser: User = {
        id: `user_${Date.now()}`,
        name: username,
        avatar: `https://ui-avatars.com/api/?name=${username}&background=random`,
        role: role as any,
        verified: false,
        email: `${username.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        phone: '',
        preferences: {
          currency: 'INR',
          theme: 'professional',
          notifications: { email: true, community: true }
        },
        portfolio: { downloads: [], uploads: [], wishlist: [] }
      };
      finishAuth(demoUser);
      return demoUser;
    }

    return null;
  };

  const signup = async (username: string, email: string, passkey: string, additionalData?: Partial<User>): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    // Mock Signup
    if (username && email && passkey) {
       // Determine role from additional data or default to buyer
       const role = additionalData?.role || (username.toLowerCase().includes('builder') ? 'builder' : 'buyer');
       
       const newUser: User = {
        id: `user_${Date.now()}`,
        name: username,
        avatar: `https://ui-avatars.com/api/?name=${username}&background=random`,
        role: role as any,
        verified: false,
        email: email,
        phone: '',
        preferences: {
          currency: 'INR',
          theme: 'professional',
          notifications: { email: true, community: true }
        },
        portfolio: { downloads: [], uploads: [], wishlist: [] },
        ...additionalData // Merge additional data like role, persona, phone
      };
      finishAuth(newUser);
      return newUser;
    }
    return null;
  };

  const finishAuth = (user: User) => {
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('nexus_user', JSON.stringify(user));
    
    // Apply theme
    if (user.preferences?.theme) {
      setMode(user.preferences.theme);
    }

    determinePlatforms(user);
    // Close modal on success
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPlatform(null);
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('nexus_platform_id');
    
    // Revert to guest theme
    const saved = localStorage.getItem("theme");
    if (saved) {
       setMode(saved as any);
    }
  };

  const selectPlatform = (platformId: string) => {
    const platform = availablePlatforms.find(p => p.id === platformId);
    if (platform) {
      setCurrentPlatform(platform);
      localStorage.setItem('nexus_platform_id', platform.id);
      
      // Update user role based on platform context if needed, though role usually static per session
      if (user) {
        // In a real app, role might shift contextually, here we keep user role but platform defines view
        // const updatedUser = { ...user, role: platform.role };
        // setUser(updatedUser);
      }
      
      setShowPlatformSelector(false);
    }
  };

  const switchPlatform = () => {
    setShowPlatformSelector(true);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      availablePlatforms,
      currentPlatform,
      selectPlatform,
      showPlatformSelector,
      switchPlatform,
      isLoginModalOpen,
      openLoginModal,
      closeLoginModal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
