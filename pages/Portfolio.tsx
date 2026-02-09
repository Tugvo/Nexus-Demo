import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_AGENTS } from '../data';
import AgentCard from '../components/AgentCard';
import { Download, UploadCloud, Heart, Search } from 'lucide-react';

const Portfolio: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'downloads' | 'uploads' | 'wishlist'>('downloads');

  if (!user) return <div className="p-8">Please login to view this page.</div>;

  // Mock mapping IDs to actual agents (In real app this would be an API call)
  const getAgentsByIds = (ids: string[] = []) => {
      return MOCK_AGENTS.filter(agent => ids.includes(agent.id));
  };

  const downloads = getAgentsByIds(user.portfolio?.downloads);
  const uploads = getAgentsByIds(user.portfolio?.uploads);
  const wishlist = getAgentsByIds(user.portfolio?.wishlist);

  const renderGrid = (agents: any[], emptyMsg: string) => {
      if (agents.length === 0) {
          return (
             <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">Nothing here yet</h3>
                <p className="text-gray-500 mt-1">{emptyMsg}</p>
            </div>
          );
      }
      return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map(agent => (
                  <AgentCard key={agent.id} agent={agent} />
              ))}
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Portfolio</h1>
        <p className="text-gray-600 mb-8">Manage your agents, acquisitions, and wishlist.</p>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
                <button
                    onClick={() => setActiveTab('downloads')}
                    className={`${activeTab === 'downloads' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                    <Download className={`-ml-0.5 mr-2 h-4 w-4 ${activeTab === 'downloads' ? 'text-indigo-500' : 'text-gray-400'}`} />
                    Downloads ({downloads.length})
                </button>

                {(user.role === 'builder' || user.role === 'admin') && (
                    <button
                        onClick={() => setActiveTab('uploads')}
                        className={`${activeTab === 'uploads' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        <UploadCloud className={`-ml-0.5 mr-2 h-4 w-4 ${activeTab === 'uploads' ? 'text-indigo-500' : 'text-gray-400'}`} />
                        My Uploads ({uploads.length})
                    </button>
                )}

                <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`${activeTab === 'wishlist' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                >
                    <Heart className={`-ml-0.5 mr-2 h-4 w-4 ${activeTab === 'wishlist' ? 'text-indigo-500' : 'text-gray-400'}`} />
                    Wishlist ({wishlist.length})
                </button>
            </nav>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
            {activeTab === 'downloads' && renderGrid(downloads, "You haven't purchased or downloaded any agents yet.")}
            {activeTab === 'uploads' && renderGrid(uploads, "You haven't uploaded any agents yet. Go to Studio to start.")}
            {activeTab === 'wishlist' && renderGrid(wishlist, "Your wishlist is empty.")}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
