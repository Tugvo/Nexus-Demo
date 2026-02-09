
import React, { useState, useEffect, useMemo } from 'react';
import { ArrowRight, Zap, BarChart3, Wrench, Headphones, Terminal, Globe, UploadCloud } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { MOCK_AGENTS } from '../data';
import CarouselRow from '../components/CarouselRow';
import { useAuth } from '../context/AuthContext';
import PersonaToggle from '../components/PersonaToggle';
import TestimonialsCarousel from '../components/TestimonialsCarousel';
import { Persona, Agent } from '../types';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Persona State
  const initialPersona = (searchParams.get('persona') as Persona) || 'Professionals';
  const [selectedPersona, setSelectedPersona] = useState<Persona>(initialPersona);

  // Sync Persona with URL
  useEffect(() => {
    setSearchParams({ persona: selectedPersona });
  }, [selectedPersona, setSearchParams]);

  // Sub-banner Carousel State
  const [promoIndex, setPromoIndex] = useState(0);
  const promos = [
      { text: "Featured: Salesforce Lead AI - 20% Off", link: "/agent/t-1" },
      { text: "New Arrival: DeepSeek Coder for Enterprise", link: "/agent/n-1" },
      { text: "Trusted by 500+ Engineering Teams", link: "/marketplace" }
  ];

  useEffect(() => {
      const interval = setInterval(() => {
          setPromoIndex((prev) => (prev + 1) % promos.length);
      }, 4000);
      return () => clearInterval(interval);
  }, []);

  // Filter Agents Logic
  const getAgentsByPersona = (agents: Agent[], persona: Persona): Agent[] => {
      return agents.filter(agent => {
          // If agent has explicit personas tag, match it
          if (agent.personas && agent.personas.includes(persona)) {
              return true;
          }
          
          // Fallback logic if explicit tags missing (for robustness)
          switch (persona) {
              case 'Students':
                  return agent.price < 2000 || agent.category === 'Productivity' || agent.category === 'Design';
              case 'Professionals':
                  return agent.category === 'Productivity' || agent.category === 'Marketing' || agent.category === 'Data';
              case 'Business Teams':
                  return ['Sales', 'Customer Support', 'Marketing', 'Operations', 'HR', 'Finance'].includes(agent.category);
              case 'Enterprise':
                  return agent.trustScore >= 85 && agent.pricingModel === 'monthly';
              case 'Creators & Builders':
                  return ['Development', 'Design', 'Data'].includes(agent.category);
              default:
                  return true;
          }
      });
  };

  const personaAgents = useMemo(() => getAgentsByPersona(MOCK_AGENTS, selectedPersona), [selectedPersona]);

  // Derived Rows based on Persona Filtered Data
  const trendingAgents = personaAgents
    .filter(a => a.segment === 'trending' || a.isTopSeller)
    .sort((a, b) => (b.installs * b.rating) - (a.installs * a.rating));

  const recommendedAgents = personaAgents
    .filter(a => {
        if (!user) return a.rating >= 4.7;
        return a.trustScore > 90; 
    })
    .sort((a, b) => b.trustScore - a.trustScore);

  const topSellingAgents = personaAgents
    .filter(a => a.isTopSeller)
    .sort((a, b) => b.installs - a.installs);

  const newAgents = personaAgents
    .filter(a => a.isNew || a.segment === 'new')
    .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());

  // Category Logic (Browse by Use Case)
  const [selectedUseCase, setSelectedUseCase] = useState('Sales');
  const useCaseAgents = personaAgents.filter(a => a.category === selectedUseCase);

  return (
    <div className="bg-theme-card transition-colors duration-300">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 py-20 sm:py-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
            The App Store for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI Agents</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300 max-w-2xl mx-auto">
            Discover, collaborate, and deploy verified AI agents. 
            From sales automation to code reviews, find the perfect digital workforce.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/marketplace" className="rounded-md bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all flex items-center">
              Explore Marketplace <ArrowRight className="ml-2 h-4 w-4"/>
            </Link>
            <Link to="/studio" className="text-sm font-semibold leading-6 text-white hover:text-indigo-300 flex items-center">
              Sell Agents <UploadCloud className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Sub-Banner Carousel */}
      <div className="bg-indigo-900 text-white py-3 border-t border-indigo-800 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
              <Link to={promos[promoIndex].link} className="text-sm font-medium hover:underline animate-fade-in key={promoIndex}">
                  {promos[promoIndex].text}
              </Link>
          </div>
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
              {promos.map((_, idx) => (
                  <div key={idx} className={`h-1 w-1 rounded-full transition-all ${idx === promoIndex ? 'bg-white w-3' : 'bg-white/30'}`}></div>
              ))}
          </div>
      </div>

      {/* Persona Toggle */}
      <PersonaToggle selectedPersona={selectedPersona} onSelect={setSelectedPersona} />

      {/* Trending */}
      <div className="bg-theme-card">
          <CarouselRow 
            title={`Trending for ${selectedPersona}`}
            subtitle="Most popular tools this week in your domain"
            agents={trendingAgents} 
            viewAllLink="/agents/viral"
          />
      </div>

      {/* Recommended For You */}
      <div className="bg-theme-bg-sec border-t border-theme-border">
          <CarouselRow 
            title={user ? `Recommended for ${user.name}` : `Top Rated for ${selectedPersona}`} 
            subtitle="Curated picks based on persona & activity"
            agents={recommendedAgents} 
            viewAllLink="/marketplace?segment=individuals"
          />
      </div>

      {/* Use Case Browser */}
      <div className="py-12 bg-theme-card border-y border-theme-border">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8">
              <h2 className="text-2xl font-bold text-theme-text">Browse by Use Case</h2>
              <p className="mt-1 text-sm text-theme-text-sec">Showing agents relevant to {selectedPersona}</p>
              <div className="flex gap-4 overflow-x-auto py-4 scrollbar-hide">
                  {[
                      { id: 'Sales', icon: BarChart3 },
                      { id: 'Customer Support', icon: Headphones },
                      { id: 'Marketing', icon: Globe },
                      { id: 'Development', icon: Terminal },
                      { id: 'Operations', icon: Wrench },
                  ].map((uc) => {
                      const Icon = uc.icon;
                      return (
                          <button
                            key={uc.id}
                            onClick={() => setSelectedUseCase(uc.id)}
                            className={`flex items-center px-5 py-3 rounded-xl border transition-all whitespace-nowrap ${
                                selectedUseCase === uc.id 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105' 
                                : 'bg-theme-card text-theme-text-sec border-theme-border hover:border-indigo-300 hover:text-theme-text'
                            }`}
                          >
                              <Icon className="w-4 h-4 mr-2" />
                              {uc.id}
                          </button>
                      )
                  })}
              </div>
          </div>
          
          <CarouselRow 
            title={`${selectedUseCase} Agents for ${selectedPersona}`}
            agents={useCaseAgents.length > 0 ? useCaseAgents : []}
            viewAllLink={`/marketplace?category=${selectedUseCase}`}
          />
          {useCaseAgents.length === 0 && (
              <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-8 text-center text-theme-text-sec italic">
                  No {selectedUseCase} agents found specifically for {selectedPersona}. Try switching personas.
              </div>
          )}
      </div>

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* Top Sellers */}
      <div className="bg-theme-bg-sec">
          <CarouselRow 
            title="Top Selling" 
            subtitle={`Best-selling ${selectedPersona} tools`}
            agents={topSellingAgents} 
            viewAllLink="/marketplace?sort=top_selling"
          />
      </div>

      {/* New Arrivals */}
      <div className="bg-theme-card border-t border-theme-border">
          <CarouselRow 
            title="New Arrivals" 
            subtitle={`Fresh ${selectedPersona} tools from the community`}
            agents={newAgents} 
            viewAllLink="/marketplace?sort=newest"
          />
      </div>

    </div>
  );
};

export default Home;
