
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_AGENTS, MOCK_BUILDERS } from '../data';
import { ShieldCheck, Star, Download, Calendar, MessageSquare, Activity, MapPin, Layers, Edit, Pause, Play, BarChart2, Send, Clock, Eye } from 'lucide-react';
import AgentCard from '../components/AgentCard';
import ContactBuilderModal from '../components/ContactBuilderModal';
import { useAuth } from '../context/AuthContext';
import { Agent, AgentState } from '../types';

const BuilderPortfolio: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, openLoginModal } = useAuth();
  const [showContactModal, setShowContactModal] = useState(false);

  // Find builder from mock users or fallback
  const builder = MOCK_BUILDERS.find(b => b.id === id) || {
      id: 'unknown',
      name: 'Unknown Builder',
      avatar: 'https://ui-avatars.com/api/?name=Unknown',
      role: 'builder',
      verified: false,
      type: 'independent_creator',
      bio: 'Builder details not found.',
      stats: { totalAgents: 0, totalDownloads: 0, avgRating: 0, avgTrust: 0 },
      expertise: []
  };

  const builderAgents = MOCK_AGENTS.filter(a => a.builder.id === id);
  
  // Check if current user is the owner of this portfolio
  const isOwner = user?.id === builder.id;

  const handleContact = () => {
      if (!user) {
          openLoginModal();
          return;
      }
      setShowContactModal(true);
  };

  const renderAgentSection = (agents: Agent[], title: string, icon: React.ReactNode, actions: { analytics?: boolean, pause?: boolean, submit?: boolean }) => {
      if (agents.length === 0) return null;

      return (
          <div className="mb-10 animate-fade-in">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-theme-border">
                  {icon}
                  <h2 className="text-lg font-bold text-theme-text">{title}</h2>
                  <span className="text-xs font-medium bg-theme-card border border-theme-border px-2 py-0.5 rounded-full text-theme-text-sec">
                      {agents.length}
                  </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agents.map((agent, index) => (
                      <div key={agent.id} className="relative group">
                          <div className={actions.submit ? "opacity-80 hover:opacity-100 transition-opacity" : ""}>
                              <AgentCard agent={agent} />
                          </div>
                          
                          {/* Owner Actions Overlay */}
                          {isOwner && (
                              <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                                  <div className="flex flex-col gap-2 p-1.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg shadow-lg border border-theme-border">
                                      <button className="p-2 text-theme-text-sec hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition-colors relative group/btn" title="Edit Agent">
                                          <Edit className="w-4 h-4" />
                                          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none">Edit</span>
                                      </button>
                                      
                                      {actions.analytics && (
                                          <Link to="/builder/analytics" className="p-2 text-theme-text-sec hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-md transition-colors relative group/btn" title="View Analytics">
                                              <BarChart2 className="w-4 h-4" />
                                              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none">Analytics</span>
                                          </Link>
                                      )}

                                      {actions.pause && (
                                          <button className="p-2 text-theme-text-sec hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-md transition-colors relative group/btn" title="Pause Listing">
                                              <Pause className="w-4 h-4" />
                                              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none">Pause</span>
                                          </button>
                                      )}

                                      {actions.submit && (
                                          <button className="p-2 text-theme-text-sec hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors relative group/btn" title="Submit for Review">
                                              <Send className="w-4 h-4" />
                                              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/btn:opacity-100 whitespace-nowrap pointer-events-none">Submit</span>
                                          </button>
                                      )}
                                  </div>
                              </div>
                          )}
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  // Grouping Logic
  const productionAgents = builderAgents.filter(a => a.state === 'production' || (!a.state && !isOwner));
  const submissionAgents = builderAgents.filter(a => a.state === 'submission');
  const draftAgents = builderAgents.filter(a => a.state === 'draft');

  return (
    <div className="bg-theme-bg-sec min-h-screen py-8 transition-colors duration-300">
      
      {showContactModal && (
          <ContactBuilderModal 
            builderId={builder.id} 
            builderName={builder.name} 
            builderAvatar={builder.avatar}
            onClose={() => setShowContactModal(false)} 
          />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="bg-theme-card rounded-2xl shadow-sm border border-theme-border p-8 mb-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
                <img src={builder.avatar} alt={builder.name} className="w-32 h-32 rounded-2xl object-cover shadow-md border-2 border-theme-bg-sec" />
            </div>
            
            <div className="flex-1">
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-theme-text flex items-center gap-2">
                            {builder.name}
                            {builder.verified && <ShieldCheck className="w-6 h-6 text-blue-500" />}
                        </h1>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wide">
                                {builder.type?.replace('_', ' ')}
                            </span>
                            <span className="text-theme-text-sec text-sm flex items-center">
                                <MapPin className="w-3 h-3 mr-1" /> San Francisco, CA
                            </span>
                        </div>
                        <p className="mt-4 text-theme-text-sec max-w-2xl leading-relaxed">
                            {builder.bio}
                        </p>
                    </div>
                    <div>
                        <button 
                            onClick={handleContact}
                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center"
                        >
                            <MessageSquare className="w-4 h-4 mr-2" /> Contact Builder
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-theme-border">
                    <div>
                        <p className="text-theme-text-sec text-xs uppercase tracking-wider font-semibold">Total Agents</p>
                        <p className="text-2xl font-bold text-theme-text mt-1">{builder.stats?.totalAgents || builderAgents.length}</p>
                    </div>
                    <div>
                        <p className="text-theme-text-sec text-xs uppercase tracking-wider font-semibold">Total Downloads</p>
                        <p className="text-2xl font-bold text-theme-text mt-1">{(builder.stats?.totalDownloads || 0).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-theme-text-sec text-xs uppercase tracking-wider font-semibold">Avg Rating</p>
                        <div className="flex items-center gap-1 mt-1">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-2xl font-bold text-theme-text">{builder.stats?.avgRating || 'N/A'}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-theme-text-sec text-xs uppercase tracking-wider font-semibold">Avg Trust Score</p>
                        <div className="flex items-center gap-1 mt-1">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span className="text-2xl font-bold text-theme-text">{builder.stats?.avgTrust || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* SIDEBAR INFO */}
            <div className="space-y-6">
                <div className="bg-theme-card p-6 rounded-xl shadow-sm border border-theme-border">
                    <h3 className="font-bold text-theme-text mb-4 flex items-center">
                        <Layers className="w-4 h-4 mr-2 text-indigo-600" /> Areas of Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {builder.expertise?.map(skill => (
                            <span key={skill} className="bg-theme-bg-sec text-theme-text-sec px-3 py-1 rounded-full text-xs font-medium border border-theme-border">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-theme-card p-6 rounded-xl shadow-sm border border-theme-border">
                    <h3 className="font-bold text-theme-text mb-4 flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-green-600" /> Activity
                    </h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-theme-text-sec">Last Update</span>
                            <span className="font-medium text-theme-text">2 days ago</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-theme-text-sec">Community Replies</span>
                            <span className="font-medium text-theme-text">142</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-theme-text-sec">Response Time</span>
                            <span className="font-medium text-theme-text">~4 hours</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AGENTS GRID */}
            <div className="lg:col-span-3">
                {isOwner ? (
                    <>
                        {renderAgentSection(
                            productionAgents, 
                            "Production", 
                            <Activity className="w-5 h-5 text-green-500"/>,
                            { analytics: true, pause: true }
                        )}
                        {renderAgentSection(
                            submissionAgents, 
                            "Under Submission", 
                            <Clock className="w-5 h-5 text-yellow-500"/>,
                            { pause: true } // Can interpret as 'Cancel submission'
                        )}
                        {renderAgentSection(
                            draftAgents, 
                            "Drafts", 
                            <Edit className="w-5 h-5 text-gray-500"/>,
                            { submit: true }
                        )}
                    </>
                ) : (
                    renderAgentSection(
                        productionAgents, 
                        "Published Agents", 
                        <Activity className="w-5 h-5 text-green-500"/>,
                        {}
                    )
                )}
                
                {builderAgents.length === 0 && (
                    <div className="text-center py-12 bg-theme-card rounded-xl border border-dashed border-theme-border text-theme-text-sec">
                        No agents found in this portfolio.
                    </div>
                )}
            </div>

        </div>

      </div>
    </div>
  );
};

export default BuilderPortfolio;
