
import React, { useState } from 'react';
import { ShieldCheck, Lock, Users, Activity, Search, AlertOctagon, CheckCircle, FileText, Download } from 'lucide-react';
import { MOCK_AGENTS } from '../data';
import { Link } from 'react-router-dom';

const EnterpriseDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'seats' | 'audit'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');

  const agents = MOCK_AGENTS.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-indigo-600" /> Enterprise Control Center
                </h1>
                <p className="text-gray-600 mt-1">Manage approved agents, compliance, and team access.</p>
            </div>
            <div className="flex gap-3">
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium">
                    Seats: <span className="text-indigo-600 font-bold">12 / 50</span>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium">
                    Risk Score: <span className="text-green-600 font-bold">Low</span>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200 px-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('catalog')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'catalog' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <Lock className="w-4 h-4 mr-2" /> Approved Catalog
                    </button>
                    <button
                        onClick={() => setActiveTab('seats')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'seats' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <Users className="w-4 h-4 mr-2" /> Team Seats
                    </button>
                    <button
                        onClick={() => setActiveTab('audit')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === 'audit' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <Activity className="w-4 h-4 mr-2" /> Audit Logs
                    </button>
                </nav>
            </div>

            <div className="p-6">
                {activeTab === 'catalog' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <div className="relative max-w-md w-full">
                                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                                <input 
                                    type="text" 
                                    placeholder="Search ecosystem..." 
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <button className="text-gray-600 text-sm font-medium hover:text-gray-900">Export Policy</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trust Score</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {agents.map(agent => (
                                        <tr key={agent.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                                                        {agent.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                                                        <div className="text-xs text-gray-500">{agent.category}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className={`font-bold mr-2 ${agent.trustScore >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {agent.trustScore}
                                                    </span>
                                                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                                        <div className={`h-1.5 rounded-full ${agent.trustScore >= 90 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${agent.trustScore}%`}}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    {agent.securitySignals?.signed && <span title="Signed" className="px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded border border-green-200">Signed</span>}
                                                    {agent.securitySignals?.docs && <span title="Documented" className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-200">Docs</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Approved
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button className="text-red-600 hover:text-red-900">Block</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'seats' && (
                    <div className="text-center py-12 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Team management module coming soon.</p>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Salesforce Agent v2.4 Downloaded</p>
                                        <p className="text-xs text-gray-500">User: Jason Bourne • IP: 192.168.x.x</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">2 mins ago</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
