
import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { MOCK_AGENTS } from '../data';
import AgentCard from '../components/AgentCard';
import MarketplaceFilters, { MarketplaceFilterState } from '../components/MarketplaceFilters';

const ITEMS_PER_PAGE = 12;
const STORAGE_KEY = 'nexus_viral_filters';

const ViralAgents: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL > LocalStorage > Default
  const [filters, setFilters] = useState<MarketplaceFilterState>(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      const initial: MarketplaceFilterState = saved ? JSON.parse(saved) : {
          category: [],
          integration: [],
          sort: 'trending',
          minTrust: 70
      };

      // URL overrides local storage
      if (searchParams.get('category')) initial.category = searchParams.get('category')!.split(',');
      if (searchParams.get('system')) initial.integration = searchParams.get('system')!.split(',');
      if (searchParams.get('sort')) initial.sort = searchParams.get('sort') as any;
      
      return initial;
  });

  // Sync state to URL and LocalStorage
  useEffect(() => {
      const params: any = {};
      if (filters.category.length) params.category = filters.category.join(',');
      if (filters.integration.length) params.system = filters.integration.join(',');
      if (filters.sort !== 'trending') params.sort = filters.sort;
      
      setSearchParams(params);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters, setSearchParams]);

  // Filter Logic
  const filteredAgents = useMemo(() => {
    let result = [...MOCK_AGENTS];

    // Category Filter
    if (filters.category.length > 0) {
      result = result.filter(a => filters.category.includes(a.category));
    }

    // Systems Filter (Partial Match)
    if (filters.integration.length > 0) {
      result = result.filter(a => 
        a.systemLogos.some(logo => filters.integration.some(filterSys => logo.includes(filterSys)))
      );
    }

    // Trust Score Filter
    result = result.filter(a => a.trustScore >= filters.minTrust);

    // Sort Logic
    if (filters.sort === 'trending') {
      result.sort((a, b) => (b.installs * b.rating) - (a.installs * a.rating));
    } else if (filters.sort === 'downloads') {
      result.sort((a, b) => b.installs - a.installs);
    } else if (filters.sort === 'newest') {
        result.sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());
    } else if (filters.sort === 'top_selling') {
        result.sort((a, b) => b.installs - a.installs);
    } else if (filters.sort === 'price_asc') {
        result.sort((a, b) => a.price - b.price);
    }

    return result;
  }, [filters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
  const currentAgents = filteredAgents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-theme-bg-sec min-h-screen py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Header */}
        <div className="mb-8 animate-slide-up">
            <Link to="/" className="inline-flex items-center text-sm text-theme-text-sec hover:text-theme-text mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
            </Link>
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-theme-text">Viral Agents</h1>
                    <p className="text-theme-text-sec mt-1">Explore the fastest growing agents in the ecosystem</p>
                </div>
            </div>
        </div>

        <MarketplaceFilters filters={filters} setFilters={setFilters} />

        {currentAgents.length > 0 ? (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentAgents.map((agent, index) => (
                        <div key={agent.id} className="animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                            <AgentCard agent={agent} />
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex justify-center gap-2">
                        <button 
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className="p-2 rounded-lg border border-theme-border bg-theme-card text-theme-text hover:bg-theme-bg-sec disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm text-theme-text-sec font-medium px-2 py-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button 
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className="p-2 rounded-lg border border-theme-border bg-theme-card text-theme-text hover:bg-theme-bg-sec disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}
            </>
        ) : (
            <div className="text-center py-20 bg-theme-card rounded-xl border border-dashed border-theme-border animate-fade-in">
                <Search className="h-12 w-12 text-theme-text-sec mx-auto mb-4" />
                <h3 className="text-lg font-medium text-theme-text">No agents match your criteria</h3>
                <p className="text-theme-text-sec mt-1">Try lowering the trust score or removing filters.</p>
                <button onClick={() => setFilters({ category: [], integration: [], minTrust: 0, sort: 'trending' })} className="mt-4 text-indigo-600 font-medium hover:underline">
                    Clear all filters
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ViralAgents;
