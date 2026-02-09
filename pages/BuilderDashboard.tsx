
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Plus, DollarSign, Eye, ShoppingCart, TrendingUp, UploadCloud, 
  Lock, Unlock, Clock, Activity, MessageSquare, ShieldCheck, 
  X, FileText, AlertTriangle, Map, Globe, CheckCircle, Ban, 
  ChevronRight, ExternalLink, Filter, Download
} from 'lucide-react';
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

const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe', '#e0e7ff'];

const BuilderDashboard: React.FC = () => {
  const [myAgents, setMyAgents] = useState(MOCK_AGENTS.slice(0, 3)); 
  const { togglePurchaseEnabled, getAgentPurchaseStatus } = useMarketplace();
  const [activeDrilldown, setActiveDrilldown] = useState<string | null>(null);

  // Local handler to update UI state immediately
  const handleToggle = (agentId: string, currentStatus: boolean) => {
      togglePurchaseEnabled(agentId, !currentStatus);
      setMyAgents(prev => prev.map(a => 
        a.id === agentId ? { ...a, purchaseEnabled: !currentStatus } : a
      ));
  };

  const renderDrilldownContent = () => {
      switch(activeDrilldown) {
          case 'revenue':
              return (
                  <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                              <p className="text-xs text-indigo-600 font-bold uppercase">Total Payout</p>
                              <p className="text-2xl font-bold text-gray-900"><PriceDisplay amount={924000} /></p>
                          </div>
                          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                              <p className="text-xs text-yellow-700 font-bold uppercase">Pending Clearance</p>
                              <p className="text-2xl font-bold text-gray-900"><PriceDisplay amount={72000} /></p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                              <p className="text-xs text-green-700 font-bold uppercase">Next Payout</p>
                              <p className="text-lg font-bold text-gray-900">Oct 15, 2024</p>
                          </div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                  <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue (30d)</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Growth</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                  </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                  {myAgents.map(agent => (
                                      <tr key={agent.id}>
                                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{agent.name}</td>
                                          <td className="px-6 py-4 text-sm text-gray-500"><PriceDisplay amount={agent.revenue || 0} /></td>
                                          <td className="px-6 py-4 text-sm text-green-600">+12%</td>
                                          <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              );
          case 'views':
              return (
                  <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                    <p className="text-center text-sm text-gray-500 mt-4">Traffic source: 60% Direct, 30% Marketplace Search, 10% External</p>
                  </div>
              );
          case 'downloads':
              return (
                  <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                          <div className="border border-gray-200 rounded-xl p-4">
                              <h4 className="font-bold text-gray-900 mb-4">By Region</h4>
                              <div className="space-y-3">
                                  <div className="flex justify-between text-sm"><span className="flex items-center"><Globe className="w-3 h-3 mr-2 text-gray-400"/> North America</span> <span className="font-medium">65%</span></div>
                                  <div className="flex justify-between text-sm"><span className="flex items-center"><Globe className="w-3 h-3 mr-2 text-gray-400"/> Europe</span> <span className="font-medium">25%</span></div>
                                  <div className="flex justify-between text-sm"><span className="flex items-center"><Globe className="w-3 h-3 mr-2 text-gray-400"/> Asia Pacific</span> <span className="font-medium">10%</span></div>
                              </div>
                          </div>
                          <div className="border border-gray-200 rounded-xl p-4">
                              <h4 className="font-bold text-gray-900 mb-4">By License Type</h4>
                              <div className="space-y-3">
                                  <div className="flex justify-between text-sm"><span>Enterprise (Seats)</span> <span className="font-medium">12%</span></div>
                                  <div className="flex justify-between text-sm"><span>Pro (Monthly)</span> <span className="font-medium">48%</span></div>
                                  <div className="flex justify-between text-sm"><span>Single Use</span> <span className="font-medium">40%</span></div>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          case 'active_listings':
              return (
                  <div className="space-y-4">
                      {myAgents.map(agent => (
                          <div key={agent.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold">{agent.name.substring(0,2)}</div>
                                  <div>
                                      <p className="font-bold text-gray-900">{agent.name}</p>
                                      <p className="text-xs text-gray-500">v{agent.versions[0].version} • Updated {agent.lastUpdate}</p>
                                  </div>
                              </div>
                              <div className="flex gap-2">
                                  <button className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100">Promote</button>
                                  <button className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Edit</button>
                                  <button className="p-1.5 text-gray-400 hover:text-red-500"><Ban className="w-4 h-4"/></button>
                              </div>
                          </div>
                      ))}
                      <Link to="/studio" className="block w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500 hover:border-indigo-500 hover:text-indigo-600 transition-colors">
                          + List New Agent
                      </Link>
                  </div>
              );
          case 'pending_orders':
              return (
                  <div className="space-y-4">
                      {[1, 2].map(i => (
                          <div key={i} className="flex justify-between items-center p-4 border border-yellow-200 bg-yellow-50/50 rounded-xl">
                              <div>
                                  <p className="font-bold text-gray-900">PO #4921-A</p>
                                  <p className="text-xs text-gray-600">Enterprise License • Acme Corp</p>
                              </div>
                              <div className="flex gap-2">
                                  <button className="flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700">
                                      <CheckCircle className="w-3 h-3 mr-1"/> Approve
                                  </button>
                                  <button className="flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50">
                                      <FileText className="w-3 h-3 mr-1"/> Invoice
                                  </button>
                              </div>
                          </div>
                      ))}
                      <p className="text-center text-xs text-gray-500 mt-2">Approving releases download access immediately.</p>
                  </div>
              );
          case 'disputes':
              return (
                  <div className="space-y-4">
                      <div className="p-4 border border-gray-200 rounded-xl">
                          <div className="flex justify-between mb-2">
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-bold">Chargeback Risk</span>
                              <span className="text-xs text-gray-500">2 days ago</span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">User claiming "Doesn't work with my custom schema"</p>
                          <p className="text-xs text-gray-600 mt-1">Agent: SQL Query Generator</p>
                          <div className="mt-3 flex gap-2">
                              <button className="flex-1 py-1.5 bg-indigo-600 text-white text-xs rounded-lg">Contact User</button>
                              <button className="flex-1 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg">Refund</button>
                          </div>
                      </div>
                      <div className="text-center py-4 text-gray-500 text-sm">No other active issues.</div>
                  </div>
              );
          default:
              return <div className="text-center py-8 text-gray-500">Select a metric to view details.</div>;
      }
  };

  const getDrilldownTitle = () => {
      switch(activeDrilldown) {
          case 'revenue': return 'Revenue Breakdown';
          case 'views': return 'Traffic Analysis';
          case 'downloads': return 'Install Metrics';
          case 'active_listings': return 'Manage Listings';
          case 'pending_orders': return 'Purchase Orders Queue';
          case 'disputes': return 'Dispute Resolution Center';
          default: return 'Details';
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative">
      
      {/* Drilldown Modal Overlay */}
      {activeDrilldown && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveDrilldown(null)}></div>
              <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col animate-scale-in">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-xl text-gray-900">{getDrilldownTitle()}</h3>
                      <button onClick={() => setActiveDrilldown(null)} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X className="w-5 h-5 text-gray-500"/></button>
                  </div>
                  <div className="p-6 overflow-y-auto">
                      {renderDrilldownContent()}
                  </div>
                  <div className="p-4 border-t border-gray-200 bg-gray-50 text-right">
                      <button onClick={() => setActiveDrilldown(null)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 text-sm">Close</button>
                  </div>
              </div>
          </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Builder Console</h1>
                <p className="text-gray-600 mt-1">Manage your agents, orders, and performance</p>
            </div>
            <Link to="/studio" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center shadow-sm transition-colors">
                <UploadCloud className="w-4 h-4 mr-2" /> Upload New Agent
            </Link>
        </div>

        {/* Row 1: Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div onClick={() => setActiveDrilldown('revenue')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group cursor-pointer hover:border-indigo-300">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-indigo-600 transition-colors">
                          <PriceDisplay amount={996000} />
                        </h3>
                    </div>
                    <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                        <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                </div>
                <span className="text-xs text-green-600 font-medium flex items-center mt-4">
                    <TrendingUp className="w-3 h-3 mr-1" /> +14.5% from last month
                </span>
            </div>
            
            <div onClick={() => setActiveDrilldown('views')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group cursor-pointer hover:border-indigo-300">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Views</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-indigo-600 transition-colors">45.2k</h3>
                    </div>
                    <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                </div>
                <span className="text-xs text-green-600 font-medium flex items-center mt-4">
                    <TrendingUp className="w-3 h-3 mr-1" /> +2.1% from last month
                </span>
            </div>

            <div onClick={() => setActiveDrilldown('downloads')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group cursor-pointer hover:border-indigo-300">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Downloads</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-indigo-600 transition-colors">1,204</h3>
                    </div>
                    <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                        <ShoppingCart className="w-5 h-5 text-purple-600" />
                    </div>
                </div>
                <span className="text-xs text-red-500 font-medium flex items-center mt-4">
                    <TrendingUp className="w-3 h-3 mr-1 rotate-180" /> -0.4% from last month
                </span>
            </div>
             
             <div onClick={() => setActiveDrilldown('active_listings')} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all group cursor-pointer hover:border-indigo-300">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Listings</p>
                        <h3 className="text-2xl font-bold text-gray-900 mt-1">3</h3>
                    </div>
                    <div className="bg-orange-100 p-2 rounded-lg group-hover:bg-orange-200">
                        <Plus className="w-5 h-5 text-orange-600" />
                    </div>
                </div>
                 <span className="text-xs text-gray-400 font-medium flex items-center mt-4">
                    Platform Limit: 10
                </span>
            </div>
        </div>

        {/* Row 2: Operational Metrics (New) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div onClick={() => setActiveDrilldown('pending_orders')} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-xl shadow-sm border border-yellow-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <p className="text-sm font-bold text-yellow-800 uppercase tracking-wider">Pending Orders</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">2</h3>
                        <p className="text-xs text-yellow-700 mt-1">Requires approval (PO / Invoice)</p>
                    </div>
                    <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        <FileText className="w-6 h-6 text-yellow-600" />
                    </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                    <FileText className="w-32 h-32 text-yellow-600" />
                </div>
            </div>

            <div onClick={() => setActiveDrilldown('disputes')} className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-xl shadow-sm border border-red-200 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <p className="text-sm font-bold text-red-800 uppercase tracking-wider">Active Disputes</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">1</h3>
                        <p className="text-xs text-red-700 mt-1">Action required within 24h</p>
                    </div>
                    <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-10">
                    <AlertTriangle className="w-32 h-32 text-red-600" />
                </div>
            </div>
        </div>

        {/* Row 3: Quality & Engagement */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:border-indigo-300 transition-colors cursor-pointer group">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-indigo-600">Avg Conv. Rate</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">4.2%</p>
                </div>
                <Activity className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:border-green-300 transition-colors cursor-pointer group">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-green-600">Avg Trust Score</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">92/100</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer group">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-blue-600">Avg Response</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">4h 12m</p>
                </div>
                <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between hover:border-purple-300 transition-colors cursor-pointer group">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-purple-600">Engagement</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">High</p>
                </div>
                <MessageSquare className="w-5 h-5 text-purple-500" />
            </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
                    <button onClick={() => setActiveDrilldown('revenue')} className="text-xs text-indigo-600 font-medium hover:underline">View Details</button>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Profile Views</h3>
                    <button onClick={() => setActiveDrilldown('views')} className="text-xs text-indigo-600 font-medium hover:underline">View Details</button>
                 </div>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Bar dataKey="views" fill="#818cf8" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>

        {/* My Agents List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">My Listed Agents</h3>
                <button onClick={() => setActiveDrilldown('active_listings')} className="text-sm text-indigo-600 font-medium hover:underline">Manage All</button>
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
