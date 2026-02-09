
import React from 'react';
import { Star, ShieldCheck, Download, Box, Zap, TrendingUp, Award, DollarSign, Building, User, Lock } from 'lucide-react';
import { Agent, AgentBadge } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import PriceDisplay from './PriceDisplay';

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const navigate = useNavigate();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50/50 border-green-200/50';
    if (score >= 75) return 'text-blue-600 bg-blue-50/50 border-blue-200/50';
    return 'text-yellow-600 bg-yellow-50/50 border-yellow-200/50';
  };

  const renderBadge = (badge: AgentBadge) => {
      switch(badge) {
          case 'verified':
              return (
                  <div title="Verified Builder: Passed Identity & Quality Check" className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full border border-blue-200 shadow-sm flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                  </div>
              );
          case 'featured':
              return (
                  <div title="Featured Agent: Curator Pick" className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-full border border-yellow-200 shadow-sm flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-600" /> Featured
                  </div>
              );
          case 'sponsored':
              return (
                  <div title="Sponsored Listing" className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-full border border-purple-200 shadow-sm flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Ad
                  </div>
              );
          case 'top_seller':
              return (
                  <div title="Top Seller: Top 10% downloads" className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full border border-green-200 shadow-sm flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> Top Seller
                  </div>
              );
          case 'new':
              return (
                  <div title="New Arrival: Released < 7 days ago" className="bg-teal-100 text-teal-700 text-[10px] font-bold px-2 py-1 rounded-full border border-teal-200 shadow-sm flex items-center gap-1">
                      <Zap className="w-3 h-3" /> New
                  </div>
              );
          case 'enterprise_ready':
              return (
                  <div title="Enterprise Ready: Verified + Docs + SLA + High Trust" className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full border border-slate-600 shadow-sm flex items-center gap-1">
                      <Building className="w-3 h-3" /> Enterprise
                  </div>
              );
          case 'free':
              return (
                  <div className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded-full border border-gray-200 shadow-sm flex items-center gap-1">
                      Free
                  </div>
              );
          default:
              return null;
      }
  };

  const primaryBadge = agent.badges?.find(b => ['verified', 'featured', 'sponsored', 'enterprise_ready'].includes(b));
  const secondaryBadge = agent.badges?.find(b => ['top_seller', 'new', 'free'].includes(b) && b !== primaryBadge);

  const getPersonaIcon = (persona?: string) => {
      switch(persona) {
          case 'Students': return '🧑‍🎓 Student';
          case 'Professionals': return '💼 Professional';
          case 'Business Teams': return '🏢 Business';
          case 'Enterprise': return '🏛️ Enterprise';
          case 'Creators & Builders': return '🛠️ Creator';
          default: return null;
      }
  };

  const handleIntegrationClick = (e: React.MouseEvent, integration: string) => {
      e.preventDefault();
      e.stopPropagation();
      navigate(`/marketplace?integration=${encodeURIComponent(integration)}`);
  };

  return (
    <div className={`bg-theme-card group relative rounded-xl border border-theme-border shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden hover:border-indigo-500/30 ${agent.badges?.includes('sponsored') ? 'border-purple-200 ring-1 ring-purple-100' : ''}`}>
      
      {/* ZONE 1: System Ribbon */}
      <div className="h-14 w-full bg-theme-bg-sec border-b border-theme-border flex items-center px-4 overflow-hidden relative">
        <div className="flex gap-2 items-center opacity-70 group-hover:opacity-100 transition-opacity duration-500">
           {agent.systemLogos.slice(0, 4).map((sys, idx) => (
             <div 
                key={idx} 
                onClick={(e) => handleIntegrationClick(e, sys)}
                className="bg-theme-card border border-theme-border px-2 py-1 rounded text-[10px] font-semibold text-theme-text-sec uppercase tracking-wider shadow-sm group-hover:border-indigo-200/50 group-hover:scale-105 transition-transform cursor-pointer hover:bg-indigo-50 hover:text-indigo-600"
             >
                {sys}
             </div>
           ))}
           {agent.systemLogos.length > 4 && (
             <span className="text-xs text-theme-text-sec font-medium">+{agent.systemLogos.length - 4}</span>
           )}
        </div>
        
        {/* Category Badge overlay */}
        <div className="absolute top-0 right-0 bg-theme-card border-l border-b border-theme-border px-2 py-1 rounded-bl-lg text-[10px] font-bold text-theme-text-sec uppercase tracking-wider">
           {agent.category}
        </div>
      </div>

      {/* ZONE 2: Main Info */}
      <div className="p-5 flex-1 flex flex-col relative">
        
        {/* Badges */}
        <div className="absolute -top-3 right-4 flex gap-1 flex-wrap justify-end">
            {primaryBadge && renderBadge(primaryBadge)}
            {secondaryBadge && renderBadge(secondaryBadge)}
        </div>

        <div className="flex justify-between items-start mb-2 mt-2">
            <div className="flex gap-3 items-start">
                 {/* Agent Logo */}
                 <div className="w-10 h-10 rounded-lg bg-theme-bg-sec border border-theme-border flex-shrink-0 p-1">
                    {agent.logoUrl ? (
                        <img src={agent.logoUrl} alt="logo" className="w-full h-full object-contain opacity-90" />
                    ) : (
                        <div className="w-full h-full bg-indigo-100 rounded flex items-center justify-center text-indigo-600 font-bold">
                            {agent.name.charAt(0)}
                        </div>
                    )}
                 </div>

                 <div>
                    <Link to={`/agent/${agent.id}`} className="block after:absolute after:inset-0 after:content-[''] focus:outline-none">
                        <h3 className="text-lg font-bold text-theme-text group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {agent.name}
                        </h3>
                    </Link>
                    <div className="text-sm text-theme-text-sec flex flex-col items-start mt-0.5 relative z-10">
                        <span className="flex items-center">
                            by <Link to={`/builder/${agent.builder.id}`} className="hover:text-indigo-600 hover:underline ml-1 font-medium">{agent.builder.name}</Link>
                            {agent.verified && <ShieldCheck className="w-3 h-3 text-blue-500 ml-1" />}
                        </span>
                        {/* Persona Tag */}
                        {agent.personas && agent.personas.length > 0 && (
                            <span className="text-[10px] text-theme-text-sec mt-1 bg-theme-bg-sec px-1.5 py-0.5 rounded border border-theme-border font-medium">
                                {getPersonaIcon(agent.personas[0])}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>

        <p className="text-sm text-theme-text-sec mb-4 line-clamp-2 leading-relaxed pl-[3.25rem]">
          {agent.tagline}
        </p>

        {/* Pricing & Downloads */}
        <div className="mt-auto pt-4 border-t border-theme-border flex items-center justify-between relative z-10">
          <div className="flex flex-col">
             <div className="text-lg font-bold text-theme-text leading-none">
                <PriceDisplay amount={agent.price} />
             </div>
             <span className="text-[10px] text-theme-text-sec uppercase">
                {agent.pricingModel === 'monthly' ? 'per month' : agent.pricingModel}
             </span>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center text-xs font-medium text-theme-text-sec">
                <Download className="w-3.5 h-3.5 mr-1" />
                {agent.installs > 1000 ? `${(agent.installs/1000).toFixed(1)}k` : agent.installs}
             </div>
             
             {/* Trust Score Badge */}
             <div className={`px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1 group-hover:animate-pulse ${getScoreColor(agent.trustScore)}`}>
                <ShieldCheck className="w-3 h-3" />
                {agent.trustScore}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
