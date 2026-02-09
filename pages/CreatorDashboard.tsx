
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Plus, DollarSign, Eye, ShoppingCart, TrendingUp, UploadCloud, Lock, Unlock } from 'lucide-react';
import { MOCK_AGENTS } from '../data';
import PriceDisplay from '../components/PriceDisplay';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../context/MarketplaceContext';

const data = [
  { name: 'Mon', views: 400, sales: 24 },
  { name: 'Tue', views: 300, sales: 13 },
  { name: 'Wed', views: 200, sales: 58 },
  { name: 'Thu', views: 278, sales: 39 },
  { name: 'Fri', views: 189, sales: 48 },
  { name: 'Sat', views: 239, sales: 38 },
  { name: 'Sun', views: 349, sales: 43 },
];

const BuilderDashboard: React.FC = () => {
  const [myAgents, setMyAgents] = useState(MOCK_AGENTS.slice(0, 3)); 
  const { togglePurchaseEnabled, getAgentPurchaseStatus } = useMarketplace();

  // Local handler to update UI state immediately
  const handleToggle = (agentId: string, currentStatus: boolean) => {
      togglePurchaseEnabled(agentId, !currentStatus);
      setMyAgents(prev => prev.map(a => 
        a.id === agentId ? { ...a, purchaseEnabled: !currentStatus } : a
      ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Builder Dashboard</h1>
                <p className="text-gray-600 mt-1">Monitor your ecosystem performance</p>
            </div>
            <Link to="/studio" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center shadow-sm transition-colors">
                <UploadCloud className="w-4 h-4 mr-2" /> Upload New Agent
            </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">
                          <PriceDisplay amount={996000} />
                        </h3>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg">
                        <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                </div>
                <span className="text-xs text-green-600 font-medium flex items-center mt-4">
                    <TrendingUp className="w-3 h-3 mr-1" /> +14.5% from last month
                </span>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Views</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">45.2k</h3>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
                <span className="text-xs text-green-600 font-medium flex items-center mt-4">
                    <TrendingUp className="w-3 h-3 mr-1" /> +2.1% from last month
                </span>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Downloads</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">1,204</h3>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-lg">
                        <ShoppingCart className="w-5 h-5 text-purple-600" />
                    </div>
                </div>
                <span className="text-xs text-red-500 font-medium flex items-center mt-4">
                    <TrendingUp className="w-3 h-3 mr-1 rotate-180" /> -0.4% from last month
                </span>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Listings</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">3</h3>
                    </div>
                    <div className="bg-orange-100 p-2 rounded-lg">
                        <Plus className="w-5 h-5 text-orange-600" />
                    </div>
                </div>
                 <span className="text-xs text-gray-400 font-medium flex items-center mt-4">
                    Platform Limit: 10
                </span>
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Analytics</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                 <h3 className="text-lg font-bold text-gray-900 mb-6">Profile Views</h3>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="views" fill="#818cf8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* My Agents List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">My Listed Agents</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trust Score</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {myAgents.map(agent => {
                            const isEnabled = getAgentPurchaseStatus(agent.id);
                            return (
                                <tr key={agent.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center font-bold text-indigo-500">
                                                    {agent.name.substring(0,2)}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                                                <div className="text-sm text-gray-500">{agent.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {agent.trustScore}/100
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {agent.installs}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <PriceDisplay amount={agent.price} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <button 
                                            onClick={() => handleToggle(agent.id, isEnabled)}
                                            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded border ${isEnabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                                        >
                                            {isEnabled ? <Unlock className="w-3 h-3"/> : <Lock className="w-3 h-3"/>}
                                            {isEnabled ? 'Sales Active' : 'Sales Paused'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-indigo-600 hover:text-indigo-900 mr-4">Manage</button>
                                        <button className="text-gray-600 hover:text-gray-900">Analytics</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};

export default BuilderDashboard;
