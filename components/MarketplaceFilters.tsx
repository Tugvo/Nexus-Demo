
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, Check, Cloud, Database, MessageSquare, Headphones, Github, FileText, Globe, Mail } from 'lucide-react';
import { AgentCategory } from '../types';

export interface MarketplaceFilterState {
  category: string[];
  integration: string[];
  sort: 'trending' | 'newest' | 'price_asc' | 'top_selling' | 'downloads';
  minTrust: number;
}

interface Props {
  filters: MarketplaceFilterState;
  setFilters: React.Dispatch<React.SetStateAction<MarketplaceFilterState>>;
}

const SYSTEMS = [
  { name: 'Salesforce', icon: Cloud },
  { name: 'HubSpot', icon: Database },
  { name: 'Slack', icon: MessageSquare },
  { name: 'Zendesk', icon: Headphones },
  { name: 'GitHub', icon: Github },
  { name: 'Notion', icon: FileText },
  { name: 'Google', icon: Globe },
];

const MarketplaceFilters: React.FC<Props> = ({ filters, setFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCategory = (cat: string) => {
    setFilters(prev => {
        const exists = prev.category.includes(cat);
        return {
            ...prev,
            category: exists ? prev.category.filter(c => c !== cat) : [...prev.category, cat]
        };
    });
  };

  const toggleIntegration = (sys: string) => {
    setFilters(prev => {
        const exists = prev.integration.includes(sys);
        return {
            ...prev,
            integration: exists ? prev.integration.filter(s => s !== sys) : [...prev.integration, sys]
        };
    });
  };

  const resetFilters = (e: React.MouseEvent) => {
      e.stopPropagation();
      setFilters({
          category: [],
          integration: [],
          sort: 'trending',
          minTrust: 0
      });
  };

  const activeCount = filters.category.length + filters.integration.length + (filters.minTrust > 0 ? 1 : 0);

  return (
    <div className="bg-theme-card border border-theme-border rounded-xl mb-8 transition-all duration-300">
        
        {/* Collapsed Header */}
        <div 
            className="px-6 py-4 flex justify-between items-center cursor-pointer hover:bg-theme-bg-sec/50 transition-colors rounded-xl"
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-theme-text">Filters</span>
                {activeCount > 0 && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                        {activeCount} Active
                    </span>
                )}
            </div>
            <div className="flex items-center gap-3">
                {activeCount > 0 && (
                    <button onClick={resetFilters} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1">
                        Reset
                    </button>
                )}
                {isExpanded ? <ChevronUp className="w-5 h-5 text-theme-text-sec"/> : <ChevronDown className="w-5 h-5 text-theme-text-sec"/>}
            </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
            <div className="px-6 pb-6 pt-2 border-t border-theme-border animate-slide-up">
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    {/* 1. Categories */}
                    <div>
                        <h4 className="text-sm font-semibold text-theme-text mb-3">Categories</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                            {Object.values(AgentCategory).filter(c => c !== 'All').map(cat => (
                                <label key={cat} className="flex items-center cursor-pointer group">
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 transition-colors ${filters.category.includes(cat) ? 'bg-indigo-600 border-indigo-600' : 'border-theme-border bg-theme-bg-sec'}`}>
                                        {filters.category.includes(cat) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-sm text-theme-text-sec group-hover:text-theme-text">{cat}</span>
                                    <input type="checkbox" className="hidden" checked={filters.category.includes(cat)} onChange={() => toggleCategory(cat)} />
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* 2. Integrations */}
                    <div>
                        <h4 className="text-sm font-semibold text-theme-text mb-3">Integrations</h4>
                        <div className="flex flex-wrap gap-2">
                            {SYSTEMS.map(sys => {
                                const Icon = sys.icon;
                                return (
                                    <button
                                        key={sys.name}
                                        onClick={() => toggleIntegration(sys.name)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                                            filters.integration.includes(sys.name)
                                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                            : 'bg-theme-bg-sec border-theme-border text-theme-text-sec hover:border-indigo-300'
                                        }`}
                                    >
                                        <Icon className="w-3 h-3" />
                                        {sys.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3. Trust Score */}
                    <div>
                        <h4 className="text-sm font-semibold text-theme-text mb-3">Minimum Trust Score</h4>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={filters.minTrust}
                            onChange={(e) => setFilters(prev => ({ ...prev, minTrust: parseInt(e.target.value) }))}
                            className="w-full h-2 bg-theme-bg-sec rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between mt-2 text-xs text-theme-text-sec">
                            <span>Any</span>
                            <span className="font-bold text-indigo-600">{filters.minTrust}+</span>
                        </div>
                    </div>

                    {/* 4. Sort */}
                    <div>
                        <h4 className="text-sm font-semibold text-theme-text mb-3">Sort By</h4>
                        <select 
                            value={filters.sort}
                            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value as any }))}
                            className="w-full p-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="trending">Trending Now</option>
                            <option value="top_selling">Top Selling</option>
                            <option value="newest">Newest Arrivals</option>
                            <option value="downloads">Most Downloads</option>
                            <option value="price_asc">Price: Low to High</option>
                        </select>
                    </div>

                </div>
            </div>
        )}
    </div>
  );
};

export default MarketplaceFilters;
