import React from 'react';
import { Filter, X } from 'lucide-react';
import { AgentCategory } from '../types';

export interface FilterState {
  categories: string[];
  systems: string[];
  minTrustScore: number;
  sort: 'trending' | 'newest' | 'downloads';
}

interface ViralFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  clearFilters: () => void;
}

const SYSTEMS = ['Salesforce', 'HubSpot', 'Slack', 'Zendesk', 'GitHub', 'Notion', 'Google'];

const ViralFilters: React.FC<ViralFiltersProps> = ({ filters, setFilters, clearFilters }) => {
  
  const toggleCategory = (cat: string) => {
    setFilters(prev => {
      const exists = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exists 
          ? prev.categories.filter(c => c !== cat)
          : [...prev.categories, cat]
      };
    });
  };

  const toggleSystem = (sys: string) => {
    setFilters(prev => {
      const exists = prev.systems.includes(sys);
      return {
        ...prev,
        systems: exists 
          ? prev.systems.filter(s => s !== sys)
          : [...prev.systems, sys]
      };
    });
  };

  return (
    <div className="bg-theme-card p-6 rounded-xl shadow-sm border border-theme-border transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-theme-text flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filters
        </h3>
        <button 
          onClick={clearFilters}
          className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Reset
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-theme-text mb-3">Category</h4>
        <div className="space-y-2">
          {Object.values(AgentCategory).filter(c => c !== 'All').map(cat => (
            <label key={cat} className="flex items-center cursor-pointer group relative">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${filters.categories.includes(cat) ? 'bg-indigo-600 border-indigo-600' : 'border-theme-border bg-theme-bg-sec group-hover:border-indigo-400'}`}>
                {filters.categories.includes(cat) && <div className="w-2 h-2 bg-white rounded-sm" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={filters.categories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span className="ml-3 text-sm text-theme-text-sec group-hover:text-theme-text transition-colors">{cat}</span>
              
              {/* Tooltip Animation */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 translate-x-1 group-hover:translate-x-0 duration-200">
                Filter by {cat}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Systems */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-theme-text mb-3">Integrations</h4>
        <div className="flex flex-wrap gap-2">
          {SYSTEMS.map(sys => (
            <button
              key={sys}
              onClick={() => toggleSystem(sys)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                filters.systems.includes(sys)
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                  : 'bg-theme-bg-sec text-theme-text-sec border border-theme-border hover:border-indigo-300 hover:text-theme-text'
              }`}
            >
              {sys}
            </button>
          ))}
        </div>
      </div>

      {/* Trust Score */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-theme-text mb-3">Minimum Trust Score</h4>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={filters.minTrustScore}
          onChange={(e) => setFilters(prev => ({ ...prev, minTrustScore: parseInt(e.target.value) }))}
          className="w-full h-2 bg-theme-bg-sec rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between mt-2 text-xs text-theme-text-sec">
            <span>0</span>
            <span className="font-bold text-indigo-600">{filters.minTrustScore}+</span>
            <span>100</span>
        </div>
      </div>

      {/* Sort */}
      <div>
        <h4 className="text-sm font-semibold text-theme-text mb-3">Sort By</h4>
        <select 
          value={filters.sort}
          onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value as any }))}
          className="w-full border border-theme-border bg-theme-bg-sec text-theme-text rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          <option value="trending">Trending Now</option>
          <option value="downloads">Most Downloads</option>
          <option value="newest">Newest Releases</option>
        </select>
      </div>

    </div>
  );
};

export default ViralFilters;
