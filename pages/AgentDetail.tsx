
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Star, Download, FileText, 
  UploadCloud, Share2, Activity, MessageSquare, 
  HelpCircle, ArrowDownToLine, Tag, CheckCircle,
  Lock, FileCode, Calculator, PlayCircle, Edit,
  Shield, AlertTriangle, CloudLightning, BadgeCheck,
  Building, Check, History, ThumbsUp, X,
  Linkedin, Twitter, Copy, Mail, ExternalLink, Filter, MessageCircle
} from 'lucide-react';
import { MOCK_AGENTS, MOCK_POSTS } from '../data';
import { User, Review } from '../types';
import PriceDisplay from '../components/PriceDisplay';
import { useCurrency } from '../context/CurrencyContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import PurchaseModal from '../components/PurchaseModal';
import TCOCalculator from '../components/TCOCalculator';
import ContactBuilderModal from '../components/ContactBuilderModal';
import NewPostModal from '../components/NewPostModal'; // Reusing this for Ask button

interface AgentDetailProps {
    currentUser: User;
}

const AgentDetail: React.FC<AgentDetailProps> = ({ currentUser }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const agent = MOCK_AGENTS.find(a => a.id === id);
  const [activeTab, setActiveTab] = useState<'overview' | 'versions' | 'docs' | 'community' | 'buy-vs-build'>('overview');
  const [showScoreDetails, setShowScoreDetails] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Ref for Share Menu click-away
  const shareRef = useRef<HTMLDivElement>(null);
  
  // Review Filters
  const [reviewFilter, setReviewFilter] = useState<'recent' | 'highest' | 'critical'>('recent');
  
  const { setCheckoutMode } = useCurrency();
  const { hasPurchased, getAgentPurchaseStatus, downloadAgent } = useMarketplace();
  const { openLoginModal } = useAuth();

  const isPurchased = id ? hasPurchased(id) : false;
  const isPurchaseEnabled = id ? getAgentPurchaseStatus(id) : false;
  const isCreator = currentUser.role === 'builder' && agent?.builder.id === currentUser.id;
  const canDownload = isPurchased || isCreator;
  const canReview = canDownload; 
  
  // Handle Click-Away and Escape for Share Menu
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
              setShowShareMenu(false);
          }
      };
      
      const handleEscKey = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
              setShowShareMenu(false);
          }
      };

      if (showShareMenu) {
          document.addEventListener('mousedown', handleClickOutside);
          document.addEventListener('keydown', handleEscKey);
      }
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleEscKey);
      };
  }, [showShareMenu]);

  // Check for pending actions (Purchase or Ask)
  useEffect(() => {
      if (currentUser.id === 'guest') return;

      const pendingAgentId = sessionStorage.getItem('pending_purchase_agent_id');
      if (pendingAgentId && pendingAgentId === id) {
          setShowPurchaseModal(true);
          sessionStorage.removeItem('pending_purchase_agent_id');
      }

      const pendingAction = sessionStorage.getItem('pending_action');
      const pendingAskId = sessionStorage.getItem('pending_agent_id');
      if (pendingAction === 'ask' && pendingAskId === id) {
          setShowNewPostModal(true);
          sessionStorage.removeItem('pending_action');
          sessionStorage.removeItem('pending_agent_id');
      }
  }, [currentUser, id]);

  useEffect(() => {
    setCheckoutMode(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => {
        setCheckoutMode(false);
        window.removeEventListener('scroll', handleScroll);
    }
  }, [setCheckoutMode]);

  if (!agent) return <div className="p-10 text-center text-theme-text">Agent not found</div>;

  const agentPosts = MOCK_POSTS; 

  const handleDownload = () => {
      if (id) {
          downloadAgent(id);
      }
  };

  const handlePurchaseClick = () => {
      if (currentUser.id === 'guest') {
          // Store intent and redirect to login
          if (id) sessionStorage.setItem('pending_purchase_agent_id', id);
          openLoginModal();
      } else {
          setShowPurchaseModal(true);
      }
  };

  const handleAskCommunity = () => {
      if (currentUser.id === 'guest') {
          sessionStorage.setItem('pending_action', 'ask');
          sessionStorage.setItem('pending_agent_id', id || '');
          openLoginModal();
      } else {
          setShowNewPostModal(true);
      }
  };

  const copyLink = () => {
      navigator.clipboard.writeText(window.location.href);
      setShowShareMenu(false);
      // Could show a toast here
      alert("Link copied to clipboard!");
  };

  const getReviewSummary = () => {
      const total = agent.reviews.length;
      if (total === 0) return { avg: 0, count: 0, distribution: [0,0,0,0,0] };
      const sum = agent.reviews.reduce((acc, r) => acc + r.rating, 0);
      
      const distribution = [0,0,0,0,0];
      agent.reviews.forEach(r => {
          if (r.rating >= 1 && r.rating <= 5) distribution[5 - r.rating]++;
      });

      return { avg: (sum / total).toFixed(1), count: total, distribution };
  };

  const getFilteredReviews = () => {
      let sorted = [...agent.reviews];
      if (reviewFilter === 'recent') {
          // Mock date sort (assuming string dates like '2 days ago' needs parsing or just mocking)
          // Since data is mock string, we'll just keep array order as "recent"
      } else if (reviewFilter === 'highest') {
          sorted.sort((a, b) => b.rating - a.rating);
      } else if (reviewFilter === 'critical') {
          sorted.sort((a, b) => a.rating - b.rating);
      }
      return sorted;
  };

  const reviewSummary = getReviewSummary();
  const filteredReviews = getFilteredReviews();

  const getTrustTooltip = (key: string) => {
      switch(key) {
          case 'codeQuality': return 'Automated static analysis score of the codebase structure and best practices.';
          case 'stability': return 'Based on crash reports and uptime monitoring.';
          case 'community': return 'Based on active discussions, replies, and sentiment.';
          case 'updates': return 'Frequency and consistency of version releases.';
          case 'documentation': return 'Completeness and clarity of provided guides.';
          case 'security': return 'Vulnerability scanning results (CVEs/SAST).';
          case 'adoption': return 'Install velocity and retention rate.';
          default: return 'Metric calculated by NexusAI algorithm.';
      }
  };

  return (
    <div className="bg-theme-bg-sec min-h-screen pb-12 transition-colors duration-300">
      
      {showPurchaseModal && <PurchaseModal agent={agent} onClose={() => setShowPurchaseModal(false)} />}
      
      {showContactModal && (
        <ContactBuilderModal 
          builderId={agent.builder.id} 
          builderName={agent.builder.name} 
          builderAvatar={agent.builder.avatar}
          agentId={agent.id}
          agentName={agent.name}
          onClose={() => setShowContactModal(false)} 
        />
      )}

      {showNewPostModal && (
          <NewPostModal 
            onClose={() => setShowNewPostModal(false)} 
            initialAgentId={agent.id}
            initialCategory="Integration Help"
          />
      )}

      {/* ZONE 1: HERO SECTION */}
      <div 
        className="bg-theme-card border-b border-theme-border pt-10 pb-6 px-4 sm:px-6 lg:px-8 relative overflow-visible transition-colors"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 relative z-10">
           <div className="flex-1 animate-slide-in-right">
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl font-bold text-theme-text">{agent.name}</h1>
                 {agent.verified && (
                    <span className="inline-flex items-center bg-blue-50/50 text-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-200/50">
                       <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                    </span>
                 )}
                 {agent.badges?.includes('enterprise_ready') && (
                    <span className="inline-flex items-center bg-slate-800 text-white text-xs font-medium px-2.5 py-0.5 rounded-full border border-slate-600">
                       <Building className="w-3 h-3 mr-1" /> Enterprise Ready
                    </span>
                 )}
              </div>
              <p className="text-sm text-theme-text-sec mb-4">
                 Built by <Link to={`/builder/${agent.builder.id}`} className="text-indigo-600 font-medium hover:underline">{agent.builder.name}</Link> • Last updated {agent.lastUpdate}
              </p>
              <p className="text-lg text-theme-text max-w-2xl leading-relaxed">
                 {agent.tagline}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                 {agent.useCases.slice(0, 3).map(uc => (
                    <span key={uc} className="inline-flex items-center px-2 py-1 rounded bg-theme-bg-sec text-theme-text-sec border border-theme-border text-xs">
                       <Tag className="w-3 h-3 mr-1" /> {uc}
                    </span>
                 ))}
              </div>

              {agent.checksum && (
                  <div className="mt-6 p-3 bg-theme-bg-sec rounded-lg border border-theme-border inline-block max-w-full">
                      <div className="flex items-center gap-2 text-xs text-theme-text-sec mb-1">
                          <FileCode className="w-3 h-3" />
                          <span className="font-mono">SHA-256 Verification</span>
                      </div>
                      <code className="text-[10px] text-theme-text font-mono bg-theme-card px-2 py-1 rounded border border-theme-border break-all">
                          {agent.checksum}
                      </code>
                  </div>
              )}
           </div>

           <div className="flex flex-col gap-3 min-w-[280px] animate-scale-in" style={{ animationDelay: '0.1s' }}>
              
              <div className="flex justify-between bg-theme-bg-sec p-2 rounded-lg border border-theme-border mb-2">
                  <div className="flex items-center gap-1 text-[10px] text-theme-text-sec" title="Security Scanned">
                      <Shield className={`w-4 h-4 ${agent.securitySignals?.scanned ? 'text-green-500' : 'text-gray-400'}`} />
                      Scan
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-theme-text-sec" title="Signed Package">
                      <BadgeCheck className={`w-4 h-4 ${agent.securitySignals?.signed ? 'text-green-500' : 'text-gray-400'}`} />
                      Sign
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-theme-text-sec" title="Protected Download">
                      <Lock className={`w-4 h-4 ${agent.securitySignals?.gated ? 'text-green-500' : 'text-gray-400'}`} />
                      Gate
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-theme-text-sec" title="Documentation Present">
                      <FileText className={`w-4 h-4 ${agent.securitySignals?.docs ? 'text-green-500' : 'text-gray-400'}`} />
                      Docs
                  </div>
              </div>

              <div className="bg-theme-bg-sec p-4 rounded-xl border border-theme-border text-center shadow-sm">
                 <p className="text-theme-text-sec text-xs uppercase tracking-wider mb-1">Commercial License</p>
                 <div className="text-3xl font-bold text-theme-text mb-1">
                    <PriceDisplay amount={agent.price} />
                 </div>
                 <p className="text-xs text-theme-text-sec mb-4">{agent.pricingModel === 'monthly' ? 'per month' : 'one-time purchase'}</p>
                 
                 {canDownload ? (
                     <button 
                        onClick={handleDownload}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm"
                     >
                        <Download className="w-4 h-4" /> Download v{agent.versions[0].version}
                     </button>
                 ) : (
                     <button 
                        onClick={handlePurchaseClick}
                        disabled={!isPurchaseEnabled}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-colors shadow-lg ${isPurchaseEnabled ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                     >
                        {isPurchaseEnabled ? (
                            <>Buy Now <ArrowDownToLine className="w-4 h-4" /></>
                        ) : (
                            <>Purchase Disabled <Lock className="w-4 h-4" /></>
                        )}
                     </button>
                 )}
              </div>

              <div className="grid grid-cols-2 gap-2 relative">
                 {/* SHARE Button */}
                 <div className="relative" ref={shareRef}>
                     <button 
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className="w-full flex items-center justify-center gap-2 bg-theme-card border border-theme-border text-theme-text px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-theme-bg-sec transition-colors"
                     >
                        <Share2 className="w-4 h-4" /> Share
                     </button>
                     {showShareMenu && (
                         <div className="absolute top-full left-0 right-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fade-in overflow-hidden">
                             <div className="p-1 flex flex-col gap-0.5">
                                 <button onClick={copyLink} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                     <Copy className="w-4 h-4 mr-2 text-gray-400"/> Copy Link
                                 </button>
                                 <a href={`https://wa.me/?text=${encodeURIComponent(`Check out ${agent.name} on NexusAI! ${window.location.href}`)}`} target="_blank" rel="noreferrer" className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                     <MessageCircle className="w-4 h-4 mr-2 text-green-500"/> WhatsApp
                                 </a>
                                 <a href={`mailto:?subject=Check out this AI Agent&body=${window.location.href}`} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left">
                                     <Mail className="w-4 h-4 mr-2 text-gray-400"/> Email
                                 </a>
                             </div>
                         </div>
                     )}
                 </div>

                 {/* ASK Button */}
                 <button 
                    onClick={handleAskCommunity}
                    className="flex items-center justify-center gap-2 bg-theme-card border border-theme-border text-theme-text px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-theme-bg-sec transition-colors"
                 >
                    <MessageSquare className="w-4 h-4" /> Ask
                 </button>
              </div>

              {/* Documentation Shortcuts */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                  <button onClick={() => setActiveTab('docs')} className="flex items-center justify-center gap-1.5 text-xs font-medium text-theme-text-sec hover:text-indigo-600 transition-colors py-1.5 rounded border border-transparent hover:border-theme-border hover:bg-theme-card">
                      <Download className="w-3 h-3"/> Install Guide
                  </button>
                  <button onClick={() => setActiveTab('docs')} className="flex items-center justify-center gap-1.5 text-xs font-medium text-theme-text-sec hover:text-indigo-600 transition-colors py-1.5 rounded border border-transparent hover:border-theme-border hover:bg-theme-card">
                      <ExternalLink className="w-3 h-3"/> API Ref
                  </button>
              </div>
              
              {(currentUser.role === 'builder' || currentUser.role === 'admin') && currentUser.id === agent.builder.id && (
                  <Link to="/studio" className="flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-slate-900 mt-2">
                      <UploadCloud className="w-3 h-3" /> Upload New Version
                  </Link>
              )}
           </div>
        </div>
      </div>

      {/* ZONE 2: INTEGRATIONS RIBBON */}
      <div className="bg-theme-bg-sec border-b border-theme-border sticky top-16 z-20 backdrop-blur-sm bg-opacity-90">
         <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex items-center gap-4 overflow-x-auto no-scrollbar">
            <span className="text-xs font-semibold text-theme-text-sec uppercase tracking-wider whitespace-nowrap">Works with:</span>
            {agent.systemLogos.map((sys, idx) => (
               <div key={idx} className="flex items-center gap-1.5 bg-theme-card px-3 py-1.5 rounded-full border border-theme-border shadow-sm whitespace-nowrap hover:scale-105 transition-transform">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs font-medium text-theme-text">{sys}</span>
               </div>
            ))}
         </div>
      </div>

      {/* ZONE 3: TRUST & QUALITY PANEL */}
      <div className="bg-theme-card border-b border-theme-border transition-colors">
         <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div 
                className="bg-gradient-to-r from-theme-bg-sec to-theme-card border border-theme-border rounded-xl p-4 cursor-pointer hover:border-indigo-500/30 transition-colors group"
                onClick={() => setShowScoreDetails(!showScoreDetails)}
            >
               <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                     <div className="text-center px-4 border-r border-theme-border">
                        <div className="flex items-center text-yellow-500 font-bold text-xl">
                            <Star className="w-5 h-5 fill-current mr-1" /> {agent.rating}
                        </div>
                        <div className="text-xs text-theme-text-sec">{agent.reviewCount} Reviews</div>
                     </div>
                     <div className="text-center px-4 border-r border-theme-border">
                        <div className="flex items-center text-theme-text font-bold text-xl">
                            <Download className="w-5 h-5 mr-1" /> {(agent.installs / 1000).toFixed(1)}k
                        </div>
                        <div className="text-xs text-theme-text-sec">Downloads</div>
                     </div>
                     <div className="text-center px-4">
                        <div className="flex items-center text-green-600 font-bold text-xl group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-5 h-5 mr-1 animate-pulse-slow" /> {agent.trustScore}/100
                        </div>
                        <div className="text-xs text-green-600/70 font-medium">Nexus Trust Score™</div>
                     </div>
                  </div>
                  <div className="text-xs text-indigo-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                     {showScoreDetails ? 'Hide Breakdown' : 'View Score Breakdown'} <Activity className="w-3 h-3 ml-1" />
                  </div>
               </div>

               {/* Collapsible Score Details */}
               {showScoreDetails && (
                  <div className="mt-6 pt-6 border-t border-theme-border grid grid-cols-1 sm:grid-cols-5 gap-4 animate-slide-up">
                     {Object.entries(agent.trustBreakdown).map(([key, score]) => (
                        <div key={key} className="group/metric relative">
                           <div className="flex justify-between text-xs mb-1">
                              <span className="text-theme-text-sec capitalize flex items-center cursor-help">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                  <HelpCircle className="w-3 h-3 ml-1 text-gray-300 opacity-0 group-hover/metric:opacity-100" />
                              </span>
                              <span className="font-bold text-theme-text">{score}</span>
                           </div>
                           <div className="w-full bg-theme-bg-sec rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${score > 85 ? 'bg-green-500' : score > 70 ? 'bg-blue-500' : 'bg-yellow-500'}`} 
                                style={{ width: `${score}%` }}
                              ></div>
                           </div>
                           {/* Hover Explanation Tooltip */}
                           <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded shadow-lg opacity-0 group-hover/metric:opacity-100 pointer-events-none transition-opacity z-10">
                               {getTrustTooltip(key)}
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* ZONE 4: TABS & CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
         <div className="flex flex-col lg:flex-row gap-8">
            
            <div className="lg:w-3/4">
               {/* Tab Headers */}
               <div className="border-b border-theme-border mb-6">
                  <nav className="-mb-px flex space-x-8 overflow-x-auto">
                     {[
                        { id: 'overview', label: 'Overview', icon: FileText },
                        { id: 'versions', label: 'Versions', icon: Activity },
                        { id: 'docs', label: 'Documentation', icon: HelpCircle },
                        { id: 'community', label: 'Community & Reviews', icon: MessageSquare },
                        { id: 'buy-vs-build', label: 'Buy vs Build', icon: Calculator }
                     ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                           <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id as any)}
                              className={`${
                                 activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-theme-text-sec hover:text-theme-text hover:border-theme-border'
                              } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap`}
                           >
                              <Icon className={`-ml-0.5 mr-2 h-4 w-4 ${activeTab === tab.id ? 'text-indigo-500' : 'text-theme-text-sec group-hover:text-theme-text'}`} />
                              {tab.label}
                           </button>
                        );
                     })}
                  </nav>
               </div>

               {/* Tab Content */}
               <div className="min-h-[400px] overflow-hidden">
                  {activeTab === 'overview' && (
                     <div className="space-y-8 animate-slide-in-right">
                        
                        <section>
                           <h3 className="text-lg font-bold text-theme-text mb-3">Description</h3>
                           <p className="text-theme-text-sec leading-relaxed">{agent.description}</p>
                        </section>

                        <section className="bg-theme-card p-4 rounded-xl border border-theme-border">
                           <h3 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-4 flex items-center">
                              <PlayCircle className="w-4 h-4 mr-2 text-indigo-600" /> Demo
                           </h3>
                           {agent.demoUrl ? (
                              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-black/5">
                                 <iframe 
                                    src={agent.demoUrl} 
                                    title="Agent Demo Video"
                                    className="w-full h-[300px] rounded-lg"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                 ></iframe>
                              </div>
                           ) : (
                              <div className="h-32 flex items-center justify-center bg-theme-bg-sec rounded-lg border border-dashed border-theme-border text-theme-text-sec">
                                 Creator has not added a demo yet.
                              </div>
                           )}
                        </section>

                        <section>
                           <h3 className="text-lg font-bold text-theme-text mb-3">Use Cases</h3>
                           <div className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm">
                              <ul className="space-y-2">
                                 {agent.useCases.map((useCase, i) => (
                                    <li key={i} className="flex items-start text-sm text-theme-text-sec">
                                       <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                       {useCase}
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        </section>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <section className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm hover:border-indigo-500/20 transition-colors">
                              <h3 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-4">Features</h3>
                              <ul className="space-y-2">
                                 {agent.features.map((feat, i) => (
                                    <li key={i} className="flex items-start text-sm text-theme-text-sec">
                                       <CheckCircle className="w-4 h-4 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                                       {feat}
                                    </li>
                                 ))}
                              </ul>
                           </section>
                           
                           <section className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm hover:border-indigo-500/20 transition-colors">
                              <h3 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-4">Supported Platforms</h3>
                              <div className="flex flex-wrap gap-2">
                                 {agent.systemLogos.map((sys, i) => (
                                    <span key={i} className="px-3 py-1 bg-theme-bg-sec text-theme-text rounded text-xs font-medium border border-theme-border">
                                       {sys}
                                    </span>
                                 ))}
                              </div>
                           </section>
                        </div>
                     </div>
                  )}

                  {activeTab === 'versions' && (
                     <div className="animate-slide-in-right">
                        <div className="overflow-hidden bg-theme-card border border-theme-border rounded-xl shadow-sm">
                           <table className="min-w-full divide-y divide-theme-border">
                              <thead className="bg-theme-bg-sec">
                                 <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Version</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Released</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Changelog</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-theme-text-sec uppercase tracking-wider">Action</th>
                                 </tr>
                              </thead>
                              <tbody className="bg-theme-card divide-y divide-theme-border">
                                 {agent.versions.map((ver, idx) => (
                                    <tr key={idx} className="hover:bg-theme-bg-sec transition-colors">
                                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-text">v{ver.version}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-text-sec">{ver.date}</td>
                                       <td className="px-6 py-4 text-sm text-theme-text-sec max-w-xs truncate" title={ver.changes}>{ver.changes}</td>
                                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                          {canDownload ? (
                                              <button onClick={handleDownload} className="text-indigo-600 hover:text-indigo-500 flex items-center justify-end ml-auto">
                                                 <ArrowDownToLine className="w-4 h-4 mr-1" /> Get
                                              </button>
                                          ) : (
                                              <span className="text-gray-400 flex items-center justify-end">
                                                  <Lock className="w-3 h-3 mr-1" /> Locked
                                              </span>
                                          )}
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  )}

                  {activeTab === 'docs' && (
                     <div className="bg-theme-card p-8 rounded-xl border border-theme-border shadow-sm animate-slide-in-right text-center">
                        <FileText className="w-12 h-12 text-theme-text-sec mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-theme-text">Documentation Library</h3>
                        <p className="text-theme-text-sec mb-6">Access integration guides, architecture diagrams, and API references.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                           <button className="flex items-center p-3 border border-theme-border rounded-lg hover:border-indigo-500 hover:bg-theme-bg-sec transition-colors group">
                              <div className="p-2 bg-red-100/20 text-red-600 mr-3 rounded"><FileText className="w-5 h-5"/></div>
                              <div className="text-left">
                                 <div className="text-sm font-medium text-theme-text group-hover:text-indigo-600">Installation Guide</div>
                                 <div className="text-xs text-theme-text-sec">PDF • 2.4 MB</div>
                              </div>
                           </button>
                           <button className="flex items-center p-3 border border-theme-border rounded-lg hover:border-indigo-500 hover:bg-theme-bg-sec transition-colors group">
                              <div className="p-2 bg-blue-100/20 text-blue-600 mr-3 rounded"><FileText className="w-5 h-5"/></div>
                              <div className="text-left">
                                 <div className="text-sm font-medium text-theme-text group-hover:text-indigo-600">API Reference</div>
                                 <div className="text-xs text-theme-text-sec">HTML • Live</div>
                              </div>
                           </button>
                        </div>
                     </div>
                  )}

                  {activeTab === 'community' && (
                     <div className="space-y-8 animate-slide-in-right">
                        
                        {/* REVIEWS SECTION */}
                        <section className="bg-theme-card p-6 rounded-xl border border-theme-border" id="reviews">
                           <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
                              {/* Left: Star Summary */}
                              <div className="flex-shrink-0 w-full md:w-auto">
                                  <div className="flex items-end gap-2 mb-2">
                                      <span className="text-4xl font-bold text-theme-text">{reviewSummary.avg}</span>
                                      <span className="text-sm text-theme-text-sec mb-1.5">out of 5</span>
                                  </div>
                                  <div className="flex text-yellow-400 text-sm mb-3">
                                       {[...Array(5)].map((_, i) => (
                                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(agent.rating) ? 'fill-current' : 'text-gray-300'}`} />
                                       ))}
                                  </div>
                                  <div className="text-xs text-theme-text-sec">{reviewSummary.count} global ratings</div>
                              </div>

                              {/* Right: Distribution Bars */}
                              <div className="flex-1 w-full space-y-1.5">
                                  {[5, 4, 3, 2, 1].map((star, i) => {
                                      const count = reviewSummary.distribution[5-star];
                                      const pct = reviewSummary.count > 0 ? (count / reviewSummary.count) * 100 : 0;
                                      return (
                                          <div key={star} className="flex items-center gap-2 text-xs">
                                              <span className="w-3 text-theme-text-sec">{star}</span>
                                              <Star className="w-3 h-3 text-theme-text-sec" />
                                              <div className="flex-1 h-1.5 bg-theme-bg-sec rounded-full overflow-hidden">
                                                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }}></div>
                                              </div>
                                              <span className="w-6 text-right text-theme-text-sec">{count}</span>
                                          </div>
                                      );
                                  })}
                              </div>
                           </div>

                           <div className="flex items-center justify-between border-t border-theme-border pt-6 mb-4">
                                <h4 className="font-bold text-theme-text">Reviews</h4>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setReviewFilter('recent')}
                                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${reviewFilter === 'recent' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-theme-card text-theme-text-sec border-theme-border'}`}
                                    >
                                        Recent
                                    </button>
                                    <button 
                                        onClick={() => setReviewFilter('highest')}
                                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${reviewFilter === 'highest' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-theme-card text-theme-text-sec border-theme-border'}`}
                                    >
                                        Highest
                                    </button>
                                    <button 
                                        onClick={() => setReviewFilter('critical')}
                                        className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${reviewFilter === 'critical' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-theme-card text-theme-text-sec border-theme-border'}`}
                                    >
                                        Critical
                                    </button>
                                </div>
                           </div>

                           <div className="space-y-4">
                              {filteredReviews.length > 0 ? (
                                 filteredReviews.map((review) => (
                                    <div key={review.id} className="border-b border-theme-border pb-4 last:border-0 last:pb-0">
                                       <div className="flex justify-between items-start mb-1">
                                          <Link to={`/user/${review.userId}`} className="flex items-center gap-2 group/reviewer">
                                             <img src={review.userAvatar} alt="" className="w-6 h-6 rounded-full group-hover/reviewer:ring-2 ring-indigo-300 transition-all" />
                                             <span className="text-sm font-medium text-theme-text group-hover/reviewer:text-indigo-600 transition-colors">{review.userName}</span>
                                          </Link>
                                          <div className="flex items-center gap-2">
                                              <span className="text-xs text-theme-text-sec">{review.date}</span>
                                              {review.sentiment === 'positive' && <ThumbsUp className="w-3 h-3 text-green-500" />}
                                          </div>
                                       </div>
                                       <div className="flex text-yellow-400 mb-1">
                                          {[...Array(5)].map((_, i) => (
                                             <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                          ))}
                                       </div>
                                       <p className="text-sm text-theme-text-sec">{review.comment}</p>
                                    </div>
                                 ))
                              ) : (
                                 <div className="text-center py-8 text-theme-text-sec bg-theme-bg-sec rounded-lg border border-dashed border-theme-border">
                                    No reviews yet — be the first to review this agent.
                                 </div>
                              )}
                           </div>
                           
                           {canReview && (
                               <div className="mt-6 pt-4 border-t border-theme-border text-center">
                                   <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center mx-auto">
                                        <Edit className="w-4 h-4 mr-1" /> Write a review
                                   </button>
                               </div>
                           )}
                        </section>

                        <div className="flex justify-between items-center mb-4">
                           <h3 className="font-bold text-theme-text">Recent Discussions</h3>
                           <Link to="/community" className="text-sm text-indigo-600 hover:underline">View all</Link>
                        </div>
                        {agentPosts.slice(0, 3).map((post) => (
                           <div key={post.id} className="bg-theme-card p-4 rounded-xl border border-theme-border hover:border-indigo-300 transition-colors">
                              <div className="flex justify-between items-start">
                                 <div>
                                    <h4 className="font-medium text-theme-text hover:text-indigo-600 cursor-pointer">{post.title}</h4>
                                    <p className="text-sm text-theme-text-sec mt-1 line-clamp-1">{post.content}</p>
                                    <div className="flex items-center gap-2 mt-2 text-xs text-theme-text-sec">
                                       <span>{post.author.name}</span>
                                       <span>•</span>
                                       <span>{post.date}</span>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-1 text-theme-text-sec text-xs bg-theme-bg-sec px-2 py-1 rounded">
                                    <MessageSquare className="w-3 h-3" /> {post.repliesCount}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}

                  {activeTab === 'buy-vs-build' && (
                     <div className="animate-slide-in-right">
                        <TCOCalculator agent={agent} />
                     </div>
                  )}
               </div>
            </div>

            {/* Right Sidebar - Sticky Info / TRUST COCKPIT */}
            <div className="lg:w-1/4 space-y-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
               
               {/* 3.4 Builder Credibility Card */}
               <div className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm">
                  <h4 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-4">Builder Credibility</h4>
                  <div className="flex items-center mb-4">
                     <Link to={`/builder/${agent.builder.id}`}>
                        <img src={agent.builder.avatar} alt="" className="w-12 h-12 rounded-full mr-3 border border-theme-border hover:ring-2 ring-indigo-300 transition-all" />
                     </Link>
                     <div>
                        <Link to={`/builder/${agent.builder.id}`} className="font-bold text-theme-text flex items-center hover:text-indigo-600 transition-colors">
                            {agent.builder.name} 
                            {agent.builder.verified && <ShieldCheck className="w-3 h-3 text-blue-500 ml-1" />}
                        </Link>
                        <div className="text-xs text-theme-text-sec">
                            {agent.builder.stats?.totalAgents} Agents • {agent.builder.stats?.avgTrust}% Trust
                        </div>
                     </div>
                  </div>
                  {agent.builder.stats?.responseRate && (
                      <div className="text-xs text-green-600 bg-green-50 border border-green-100 px-2 py-1 rounded mb-4 text-center">
                          ⚡ Replies within {agent.builder.stats.responseRate}
                      </div>
                  )}
                  <Link to={`/builder/${agent.builder.id}`} className="w-full text-center block text-indigo-600 border border-indigo-200/50 hover:bg-indigo-50/10 py-2 rounded-lg text-sm font-medium transition-colors">
                     View Portfolio
                  </Link>
               </div>

               {/* 3.2 Maintenance Health Bar */}
               <div className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm">
                   <h4 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-2">Maintenance Health</h4>
                   <div className="flex items-center justify-between mb-1">
                       <span className="text-xs text-theme-text-sec">Score</span>
                       <span className="text-sm font-bold text-theme-text">{agent.maintenanceScore || 85}%</span>
                   </div>
                   <div className="w-full bg-theme-bg-sec rounded-full h-2 mb-4">
                        <div 
                            className="h-2 rounded-full bg-green-500" 
                            style={{ width: `${agent.maintenanceScore || 85}%` }}
                        ></div>
                   </div>
                   <div className="text-xs text-theme-text-sec space-y-1">
                       <div className="flex justify-between">
                           <span>Last updated:</span>
                           <span className="font-medium text-theme-text">{agent.lastUpdate}</span>
                       </div>
                       <div className="flex justify-between">
                           <span>Updates (90d):</span>
                           <span className="font-medium text-theme-text">{agent.versions.length > 2 ? '3' : agent.versions.length}</span>
                       </div>
                   </div>
               </div>

               {/* 3.3 Enterprise Readiness */}
               <div className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm">
                   <h4 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-4 flex items-center">
                       <Building className="w-4 h-4 mr-2" /> Enterprise Ready
                   </h4>
                   <ul className="space-y-2 text-sm">
                       <li className="flex items-center">
                           {agent.securitySignals?.docs ? <Check className="w-4 h-4 text-green-500 mr-2"/> : <X className="w-4 h-4 text-gray-300 mr-2"/>}
                           <span className="text-theme-text-sec">Documentation</span>
                       </li>
                       <li className="flex items-center">
                           {agent.verified ? <Check className="w-4 h-4 text-green-500 mr-2"/> : <X className="w-4 h-4 text-gray-300 mr-2"/>}
                           <span className="text-theme-text-sec">Verified Builder</span>
                       </li>
                       <li className="flex items-center">
                           {agent.securitySignals?.scanned ? <Check className="w-4 h-4 text-green-500 mr-2"/> : <X className="w-4 h-4 text-gray-300 mr-2"/>}
                           <span className="text-theme-text-sec">Security Audit</span>
                       </li>
                       <li className="flex items-center">
                           {/* Mock SLA check */}
                           <Check className="w-4 h-4 text-green-500 mr-2"/>
                           <span className="text-theme-text-sec">SLA Support</span>
                       </li>
                   </ul>
               </div>

               {/* 3.5 Risk History Timeline */}
               {agent.riskHistory && agent.riskHistory.length > 0 && (
                   <div className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm">
                       <h4 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-4 flex items-center">
                           <History className="w-4 h-4 mr-2" /> Risk History
                       </h4>
                       <div className="space-y-3">
                           {agent.riskHistory.map((risk, idx) => (
                               <div key={idx} className="flex gap-2 text-xs">
                                   <div className="mt-0.5">
                                       {risk.type === 'bug' ? <AlertTriangle className="w-3 h-3 text-yellow-500"/> : <CloudLightning className="w-3 h-3 text-red-500"/>}
                                   </div>
                                   <div>
                                       <p className="font-medium text-theme-text capitalize">{risk.type} in v{risk.version}</p>
                                       <p className="text-theme-text-sec">Resolved in {risk.resolvedIn} • {risk.date}</p>
                                   </div>
                               </div>
                           ))}
                       </div>
                   </div>
               )}

               {/* 3.6 Social Proof */}
               {agent.socialProof && agent.socialProof.length > 0 && (
                   <div className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm">
                        <h4 className="text-sm font-bold text-theme-text uppercase tracking-wider mb-4">Trusted By</h4>
                        <div className="flex flex-wrap gap-2">
                            {agent.socialProof.map((proof, idx) => (
                                <span key={idx} className="bg-theme-bg-sec border border-theme-border px-3 py-1 rounded text-xs font-medium text-theme-text-sec">
                                    {proof}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-theme-text-sec mt-3 text-center">Used by 350+ teams</p>
                   </div>
               )}

               <div className="bg-indigo-50/10 p-6 rounded-xl border border-indigo-100/20">
                  <h4 className="text-indigo-900 dark:text-indigo-300 font-bold mb-2">Need a custom version?</h4>
                  <p className="text-sm text-indigo-700 dark:text-indigo-400 mb-4">Contact the builder directly for enterprise customization.</p>
                  <button 
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                     Contact Builder
                  </button>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default AgentDetail;
