
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, TrendingUp, Users, MessageSquare, AlertTriangle, FileText, Activity, Layers, ArrowRight, Filter, Download, ShieldCheck, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_AGENTS } from '../data';
import PriceDisplay from '../components/PriceDisplay';

const funnelData = [
  { stage: 'Impressions', count: 120000, fill: '#e0e7ff' }, // Lightest
  { stage: 'Page Views', count: 45200, fill: '#c7d2fe' },
  { stage: 'Preview/Demo', count: 18500, fill: '#a5b4fc' },
  { stage: 'Purchases', count: 1240, fill: '#4f46e5' }, // Darkest
];

const userTypeData = [
    { name: 'Enterprise', value: 45, color: '#4f46e5' },
    { name: 'Business', value: 30, color: '#818cf8' },
    { name: 'Pro', value: 15, color: '#c7d2fe' },
    { name: 'Student', value: 10, color: '#e0e7ff' },
];

const categoryData = [
  { name: 'Sales', revenue: 450000 },
  { name: 'Dev', revenue: 312000 },
  { name: 'Marketing', revenue: 280000 },
  { name: 'Finance', revenue: 190000 },
  { name: 'HR', revenue: 85000 },
];

const feedbackData = [
    { topic: 'Documentation', count: 42, severity: 'medium', color: 'bg-yellow-400' },
    { topic: 'Bugs / Errors', count: 12, severity: 'high', color: 'bg-red-500' },
    { topic: 'Integrations', count: 28, severity: 'medium', color: 'bg-orange-400' },
    { topic: 'Pricing', count: 15, severity: 'low', color: 'bg-blue-400' },
    { topic: 'UX / Usability', count: 8, severity: 'low', color: 'bg-green-400' }
];

const BuilderAnalytics: React.FC = () => {
  const [agentSort, setAgentSort] = useState<'revenue' | 'downloads' | 'trust'>('revenue');

  const sortedAgents = [...MOCK_AGENTS]
    .filter(a => a.builder.id === 'b1' || a.id.startsWith('t-')) // Mock filter for "My Agents"
    .sort((a, b) => {
        if (agentSort === 'revenue') return (b.revenue || 0) - (a.revenue || 0);
        if (agentSort === 'downloads') return b.installs - a.installs;
        return b.trustScore - a.trustScore;
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
            <Link to="/builder/console" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Console
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
            <p className="text-gray-600 mt-1">Deep dive into revenue, usage, and trust signals.</p>
        </div>

        {/* 1. KPI Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Active Installs</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">1,240</h3>
                <span className="text-xs text-green-600 flex items-center mt-2"><TrendingUp className="w-3 h-3 mr-1"/> +12%</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Avg Trust Score</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">92/100</h3>
                <span className="text-xs text-gray-400 mt-2">Top 5% of builders</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">2.7%</h3>
                <span className="text-xs text-green-600 flex items-center mt-2"><TrendingUp className="w-3 h-3 mr-1"/> +0.2%</span>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">4h 12m</h3>
                <span className="text-xs text-indigo-600 mt-2">SLA Met (98%)</span>
            </div>
        </div>

        {/* 2. Funnel & User Segments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Funnel View */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Conversion Funnel</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="stage" type="category" width={100} tick={{fontSize: 12, fill: '#64748b'}} />
                            <Tooltip 
                                cursor={{fill: 'transparent'}}
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30}>
                                {funnelData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-between text-xs text-gray-500 px-4 mt-2 border-t border-gray-100 pt-4">
                    <span>2.7% Overall Conversion</span>
                    <span>Drop-off at Demo: 60%</span>
                </div>
            </div>

            {/* User Type Breakdown */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">User Segments</h3>
                <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={userTypeData} 
                                innerRadius={60} 
                                outerRadius={80} 
                                paddingAngle={5} 
                                dataKey="value"
                            >
                                {userTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 justify-center mt-4">
                    {userTypeData.map(entry => (
                        <div key={entry.name} className="flex items-center text-xs text-gray-500">
                            <div className="w-2 h-2 rounded-full mr-2" style={{backgroundColor: entry.color}}></div>
                            {entry.name} ({entry.value}%)
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 3. Categories & Top Agents */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            
            {/* Top Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue by Category</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <Tooltip 
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                            />
                            <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Agents */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Top Performing Agents</h3>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button 
                            onClick={() => setAgentSort('revenue')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${agentSort === 'revenue' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Revenue
                        </button>
                        <button 
                            onClick={() => setAgentSort('downloads')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${agentSort === 'downloads' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Downloads
                        </button>
                        <button 
                            onClick={() => setAgentSort('trust')}
                            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${agentSort === 'trust' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Trust
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    {sortedAgents.map((agent, idx) => (
                        <div key={agent.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${idx < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                                    {idx + 1}
                                </span>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                                    <p className="text-xs text-gray-500">{agent.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                {agentSort === 'revenue' && (
                                    <p className="text-sm font-bold text-indigo-600"><PriceDisplay amount={agent.revenue || 0} /></p>
                                )}
                                {agentSort === 'downloads' && (
                                    <p className="text-sm font-bold text-indigo-600 flex items-center justify-end">
                                        <Download className="w-3 h-3 mr-1" /> {agent.installs}
                                    </p>
                                )}
                                {agentSort === 'trust' && (
                                    <p className="text-sm font-bold text-green-600 flex items-center justify-end">
                                        <ShieldCheck className="w-3 h-3 mr-1" /> {agent.trustScore}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* 4. Feedback Heatmap */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" /> Feedback Heatmap
            </h3>
            <div className="space-y-5">
                {feedbackData.map((issue, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                        <div className="flex-1">
                            <div className="flex justify-between mb-1.5">
                                <span className="text-sm font-medium text-gray-700">{issue.topic}</span>
                                <span className="text-xs text-gray-500 font-medium">{issue.count} reports</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                <div 
                                    className={`h-2.5 rounded-full ${issue.color} transition-all duration-1000 ease-out group-hover:opacity-80`} 
                                    style={{width: `${(issue.count / 50) * 100}%`}}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100 flex items-start gap-3">
                <Layers className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-indigo-900">AI Insight</h4>
                    <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                        Documentation issues are spiking. Users specifically mention "API Key setup for Salesforce" as a blocker. 
                        Improving the 'Getting Started' guide could reduce support tickets by ~25%.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default BuilderAnalytics;
