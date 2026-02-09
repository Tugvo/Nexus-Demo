
import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Users, Building2, PenTool } from 'lucide-react';
import { MOCK_AGENTS } from '../data';
import AgentCard from '../components/AgentCard';
import MarketplaceFilters, { MarketplaceFilterState } from '../components/MarketplaceFilters';
import { useSearchParams } from 'react-router-dom';

const ITEMS_PER_PAGE = 12;
const STORAGE_KEY = 'nexus_marketplace_filters';

const Marketplace: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Segments
  const currentSegment = searchParams.get('segment') || 'individuals';

  // Initialize filters from URL > LocalStorage > Default
  const [filters, setFilters] = useState<MarketplaceFilterState>(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      const initial: MarketplaceFilterState = saved ? JSON.parse(saved) : {
          category: [],
          integration: [],
          sort: 'trending',
          minTrust: 0
      };

      // URL overrides local storage
      if (searchParams.get('category')) initial.category = searchParams.get('category')!.split(',');
      
      const integrationParam = searchParams.get('integration') || searchParams.get('system');
      if (integrationParam) initial.integration = integrationParam.split(',');
      
      if (searchParams.get('sort')) initial.sort = searchParams.get('sort') as any;
      
      return initial;
  });

  const setSegment = (seg: string) => {
      setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set('segment', seg);
          return newParams;
      });
      setCurrentPage(1); // Reset page on segment change
  };

  // Listen for integration changes from URL (e.g. from AgentCard clicks)
  useEffect(() => {
      const integrationParam = searchParams.get('integration');
      if (integrationParam) {
          const newIntegrations = integrationParam.split(',');
          setFilters(prev => {
              // Avoid loops if already matches
              if (prev.integration.sort().join(',') === newIntegrations.sort().join(',')) return prev;
              return { ...prev, integration: newIntegrations };
          });
      }
  }, [searchParams]);

  // Sync state to URL and LocalStorage
  useEffect(() => {
      const params: any = { segment: currentSegment };
      if (filters.category.length) params.category = filters.category.join(',');
      if (filters.integration.length) params.integration = filters.integration.join(',');
      if (filters.sort !== 'trending') params.sort = filters.sort;
      
      setSearchParams(params);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters, setSearchParams, currentSegment]);

  const filteredAgents = useMemo(() => {
    let agents = [...MOCK_AGENTS];

    // Segment Logic
    if (currentSegment === 'individuals') {
        // Individuals -> prioritize free/low-cost productivity, email, study, job search
        agents = agents.filter(a => 
            a.marketSegment === 'individuals' || 
            a.price === 0 || 
            a.price < 1000 ||
            ['Productivity'].includes(a.category) ||
            (a.useCases && a.useCases.some(uc => /study|job|email|personal/i.test(uc)))
        );
    } else if (currentSegment === 'enterprise') {
        // Enterprises -> trust ≥ 85, docs present, verified builders, SLA available
        agents = agents.filter(a => 
            a.marketSegment === 'enterprise' || 
            (a.trustScore >= 85 && (a.verified || a.securitySignals?.docs))
        );
    } else if (currentSegment === 'creators') {
        // Creators -> developer tools, prompt tools, testing, debugging agents
        agents = agents.filter(a => 
            ['Development', 'Design', 'Data'].includes(a.category) || 
            (a.useCases && a.useCases.some(uc => /code|debug|prompt|generate/i.test(uc)))
        );
    }

    // Search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      agents = agents.filter(a => 
        a.name.toLowerCase().includes(lower) || 
        a.description.toLowerCase().includes(lower) ||
        a.useCases?.some(t => t.toLowerCase().includes(lower))
      );
    }

    // Category
    if (filters.category.length > 0) {
      agents = agents.filter(a => filters.category.includes(a.category));
    }

    // Integrations
    if (filters.integration.length > 0) {
      agents = agents.filter(a => 
        a.systemLogos.some(logo => filters.integration.some(filterSys => logo.includes(filterSys)))
      );
    }

    // Trust
    if (filters.minTrust > 0) {
      agents = agents.filter(a => a.trustScore >= filters.minTrust);
    }

    // Sort
    if (filters.sort === 'trending') {
        agents.sort((a, b) => (b.installs * b.rating) - (a.installs * a.rating));
    } else if (filters.sort === 'top_selling') {
        agents.sort((a, b) => b.installs - a.installs);
    } else if (filters.sort === 'newest') {
        agents.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
    } else if (filters.sort === 'price_asc') {
        agents.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'downloads') {
        agents.sort((a, b) => b.installs - a.installs);
    }
    
    return agents;
  }, [searchTerm, filters, currentSegment]);

  // Pagination
  const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
  const currentAgents = filteredAgents.slice(
      (currentPage - 1) * ITEMS_PER_PAGE, 
      currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-theme-bg-sec min-h-screen py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-theme-text">Marketplace</h1>
            <p className="text-theme-text-sec mt-1">Browse {MOCK_AGENTS.length} active agents</p>
          </div>
          
          <div className="relative flex-grow md:max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-theme-text-sec" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-theme-border rounded-lg leading-5 bg-theme-card text-theme-text placeholder-theme-text-sec focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm transition-colors shadow-sm"
                placeholder="Search agents, use cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Discovery Toggle */}
        <div className="flex justify-center mb-8">
            <div className="inline-flex bg-theme-card p-1 rounded-xl border border-theme-border shadow-sm">
                {[
                    { id: 'individuals', label: 'Individuals', icon: Users },
                    { id: 'enterprise', label: 'Enterprises', icon: Building2 },
                    { id: 'creators', label: 'Creators', icon: PenTool }
                ].map(seg => {
                    const Icon = seg.icon;
                    const isActive = currentSegment === seg.id;
                    return (
                        <button
                            key={seg.id}
                            onClick={() => setSegment(seg.id)}
                            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                isActive 
                                ? 'bg-indigo-600 text-white shadow-md' 
                                : 'text-theme-text-sec hover:text-theme-text hover:bg-theme-bg-sec'
                            }`}
                        >
                            <Icon className="w-4 h-4 mr-2" />
                            {seg.label}
                        </button>
                    )
                })}
            </div>
        </div>

        <MarketplaceFilters filters={filters} setFilters={setFilters} />

        {currentAgents.length > 0 ? (
            <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentAgents.map((agent, index) => (
                    <div key={agent.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                        <AgentCard agent={agent} />
                    </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 pt-8">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="p-2 rounded-lg border border-theme-border bg-theme-card text-theme-text hover:bg-theme-bg-sec disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-theme-text-sec font-medium">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="p-2 rounded-lg border border-theme-border bg-theme-card text-theme-text hover:bg-theme-bg-sec disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </div>
        ) : (
            <div className="text-center py-20 bg-theme-card rounded-xl border border-dashed border-theme-border animate-fade-in">
                <Search className="h-12 w-12 text-theme-text-sec mx-auto mb-4" />
                <h3 className="text-lg font-medium text-theme-text">No agents found for {currentSegment}</h3>
                <p className="text-theme-text-sec mt-1">Try adjusting your filters or search term.</p>
                <button 
                    onClick={() => setFilters({ category: [], integration: [], sort: 'trending', minTrust: 0 })}
                    className="mt-4 text-indigo-600 font-medium hover:underline"
                >
                    Clear all filters
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
