import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingConcierge from './components/FloatingConcierge';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ViralAgents from './pages/ViralAgents';
import AgentDetail from './pages/AgentDetail';
import BuilderDashboard from './pages/BuilderDashboard';
import BuilderAnalytics from './pages/BuilderAnalytics'; 
import EnterpriseDashboard from './pages/EnterpriseDashboard'; 
// AIConcierge page import removed as it is now only a floating component
import AdminDashboard from './pages/AdminDashboard';
import AgentStudio from './pages/AgentStudio';
import Community from './pages/Community';
import ThreadDetail from './pages/ThreadDetail';
import AccountInfo from './pages/AccountInfo';
import Portfolio from './pages/Portfolio';
import Settings from './pages/Settings';
import Orders from './pages/Orders'; 
import Chat from './pages/Chat'; 
import BuilderPortfolio from './pages/BuilderPortfolio'; 
import UserProfile from './pages/UserProfile';
import LoginModal from './components/Auth/LoginModal';
import PlatformSelector from './components/Auth/PlatformSelector';
import { About, Privacy, Terms, Contact, Careers } from './pages/StaticPages';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MarketplaceProvider } from './context/MarketplaceContext'; 
import { CommunicationProvider } from './context/CommunicationContext';
import { CommunityProvider } from './context/CommunityContext';
import { User } from './types';

// Guest fallback
export const GUEST_USER: User = {
  id: 'guest',
  name: 'Guest',
  avatar: '',
  role: 'buyer',
  verified: false
};

const CursorRipple: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      // Use requestAnimationFrame for smoother performance
      requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        setOpacity(1);
      });
    };
    
    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <div 
      className="pointer-events-none fixed z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl transition-opacity duration-300"
      style={{ 
        left: position.x, 
        top: position.y, 
        width: '300px', 
        height: '300px',
        opacity: opacity,
        transform: `translate(-50%, -50%) translateZ(0)`,
      }} 
    />
  );
};

const PageWrapper = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-fade-in w-full">
      {children}
    </div>
  );
};

// Inner App Component
const AuthenticatedApp = () => {
  const { user, isAuthenticated, showPlatformSelector, switchPlatform, isLoginModalOpen } = useAuth();
  
  const effectiveUser = user || GUEST_USER;

  return (
    <>
      <CursorRipple />
      {/* Auth Layers */}
      {isLoginModalOpen && <LoginModal />}
      {showPlatformSelector && <PlatformSelector />}
      
      <div className={`min-h-screen bg-theme-bg-sec transition-colors duration-300 flex flex-col ${showPlatformSelector ? 'blur-sm pointer-events-none' : ''}`}>
        {/* Navbar typically hidden on Admin Dashboard or simplified, but keeping for consistency unless requested */}
        <Navbar currentUser={effectiveUser} onToggleRole={switchPlatform} />
        
        <main className="relative z-10 flex-grow">
          <PageWrapper>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/agents/viral" element={<ViralAgents />} />
              <Route path="/agent/:id" element={<AgentDetail currentUser={effectiveUser} />} />
              {/* Concierge Route Removed */}
              <Route path="/community" element={<Community />} />
              <Route path="/community/thread/:id" element={<ThreadDetail />} />
              <Route path="/builder/:id" element={<BuilderPortfolio />} />
              <Route path="/user/:id" element={<UserProfile />} />
              
              {/* Static Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              
              {/* Profile Routes */}
              <Route path="/profile/account" element={<AccountInfo />} />
              <Route path="/profile/portfolio" element={<Portfolio />} />
              <Route path="/profile/settings" element={<Settings />} />
              <Route path="/profile/orders" element={<Orders />} />
              <Route path="/chat" element={<Chat />} />

              {/* Protected Routes */}
              <Route 
                path="/studio" 
                element={
                  isAuthenticated && (effectiveUser.role === 'builder' || effectiveUser.role === 'admin')
                  ? <AgentStudio />
                  : <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                      <div className="bg-theme-card p-8 rounded-2xl border border-theme-border">
                        <h2 className="text-2xl font-bold text-theme-text mb-2">Access Restricted</h2>
                        <p className="text-theme-text-sec mb-6">Please log in with a Builder account to access the Agent Studio.</p>
                      </div>
                    </div>
                } 
              />
              <Route 
                path="/builder/upload" 
                element={
                  isAuthenticated && (effectiveUser.role === 'builder' || effectiveUser.role === 'admin')
                  ? <AgentStudio />
                  : <Navigate to="/studio" replace />
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  isAuthenticated && (effectiveUser.role === 'builder' || effectiveUser.role === 'admin')
                  ? <BuilderDashboard /> 
                  : <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                      <div className="bg-theme-card p-8 rounded-2xl border border-theme-border">
                        <h2 className="text-2xl font-bold text-theme-text mb-2">Access Restricted</h2>
                        <p className="text-theme-text-sec">Please log in to view the Dashboard.</p>
                      </div>
                    </div>
                } 
              />
              <Route 
                path="/builder/console" 
                element={
                  isAuthenticated && (effectiveUser.role === 'builder' || effectiveUser.role === 'admin')
                  ? <BuilderDashboard /> 
                  : <Navigate to="/dashboard" replace />
                } 
              />
              <Route 
                path="/builder/analytics" 
                element={
                  isAuthenticated && (effectiveUser.role === 'builder' || effectiveUser.role === 'admin')
                  ? <BuilderAnalytics /> 
                  : <Navigate to="/" replace />
                } 
              />
              <Route 
                path="/enterprise" 
                element={
                  <EnterpriseDashboard /> 
                } 
              />
              
              {/* Admin Route */}
              <Route 
                path="/admin" 
                element={
                  isAuthenticated && effectiveUser.role === 'admin'
                  ? <AdminDashboard /> 
                  : <Navigate to="/" replace />
                } 
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </PageWrapper>
        </main>
        
        <Footer />
        <FloatingConcierge />
      </div>
    </>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CurrencyProvider>
          <MarketplaceProvider>
            <CommunicationProvider>
              <CommunityProvider>
                <Router>
                  <AuthenticatedApp />
                </Router>
              </CommunityProvider>
            </CommunicationProvider>
          </MarketplaceProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;