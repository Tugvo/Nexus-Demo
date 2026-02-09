
import React from 'react';
import { Hexagon, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-theme-card border-t border-theme-border pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <Hexagon className="h-6 w-6 text-indigo-600 fill-indigo-100" />
              <span className="ml-2 text-lg font-bold text-theme-text tracking-tight">NexusAI</span>
            </Link>
            <p className="text-theme-text-sec text-sm leading-relaxed">
              The premier ecosystem for discovering, verifying, and deploying enterprise-grade AI agents.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-theme-text-sec">
              <li><Link to="/marketplace" className="hover:text-indigo-600 transition-colors">Marketplace</Link></li>
              <li><Link to="/agents/viral" className="hover:text-indigo-600 transition-colors">Trending Agents</Link></li>
              <li><Link to="/community" className="hover:text-indigo-600 transition-colors">Community</Link></li>
              <li><Link to="/studio" className="hover:text-indigo-600 transition-colors">Agent Studio</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-theme-text-sec">
              <li><Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
              <li><Link to="/careers" className="hover:text-indigo-600 transition-colors">Careers</Link></li>
              <li><Link to="/partners" className="hover:text-indigo-600 transition-colors">Partners</Link></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-theme-text-sec mb-6">
              <li><Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms & Conditions</Link></li>
            </ul>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors"><Twitter className="w-5 h-5"/></a>
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors"><Github className="w-5 h-5"/></a>
              <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors"><Linkedin className="w-5 h-5"/></a>
            </div>
          </div>
        </div>

        <div className="border-t border-theme-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-theme-text-sec">
          <p>&copy; 2024 NexusAI Platform. All rights reserved.</p>
          <div className="flex items-center gap-1 mt-2 md:mt-0">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             <span>System Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
