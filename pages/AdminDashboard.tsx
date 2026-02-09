
import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Box, ShoppingBag, MessageSquare, 
  Star, CheckCircle, XCircle, MoreVertical, Search, ShieldCheck, 
  AlertTriangle, Filter, Flag, Trash2, Pin, Eye, Lock, Activity
} from 'lucide-react';
import { MOCK_AGENTS, MOCK_BUILDERS, MOCK_POSTS, MOCK_LEADS } from '../data';
import { Agent, User, CommunityPost, Lead } from '../types';
import PriceDisplay from '../components/PriceDisplay';
import { useCommunity } from '../context/CommunityContext';

type Tab = 'overview' | 'agents' | 'builders' | 'sales' | 'community' | 'marketplace' | 'reports';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { reports } = useCommunity();
  
  // Local state for management actions
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [builders, setBuilders] = useState(MOCK_BUILDERS);
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [searchTerm, setSearchTerm] = useState('');

  // Agent Actions
  const toggleAgentStatus = (id: string, status: 'production' | 'submission' | 'draft') => {
      setAgents(prev => prev.map(a => a.id === id ? { ...a, state: status } : a));
  };
  
  const toggleVerification = (id: string) => {
      setAgents(prev => prev.map(a => a.id === id ? { ...a, verified: !a.verified } : a));
  };

  const toggleBadge = (id: string, badge: string) => {
      setAgents(prev => prev.map(a => {
          if (a.id !== id) return a;
          const badges = a.badges || [];
          const exists = badges.includes(badge as any);
          return {
              ...a,
              badges: exists ? badges.filter(b => b !== badge) : [...badges, badge as any]
          };
      }));
  };

  // Builder Actions
  const toggleBuilderStatus = (id: string) => {
      setBuilders(prev => prev.map(b => b.id === id ? { ...b, verified: !b.verified } : b));
  };

  // Lead Actions
  const updateLeadStatus = (id: string, status: Lead['status']) => {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  // Community Actions
  const deletePost = (id: string) => {
      if (confirm('Are you sure you want to delete this post?')) {
          setPosts(prev => prev.filter(p => p.id !== id));
      }
  };

  // Report Actions
  const handleTicketAction = (id: string, action: 'warn' | 'delete' | 'suspend') => {
      alert(`Action '${action}' executed for Ticket ${id}`);
      // In real app: call API to update report status and perform action
  };

  // Render Functions
  const renderOverview = () => {
      const pendingAgents = agents.filter(a => a.state === 'submission').length;
      const totalRevenue = agents.reduce((sum, a) => sum + (a.revenue || 0), 0);
      const newLeads = leads.filter(l => l.status === 'New').length;
      const openReports = reports.filter(r => r.status === 'pending').length;

      return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              <div className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-theme-text-sec text-xs font-bold uppercase tracking-wider">Total Revenue</p>
                          <h3 className="text-2xl font-bold text-theme-text mt-1"><PriceDisplay amount={totalRevenue} /></h3>
                      </div>
                      <div className="p-2 bg-green-100 text-green-600 rounded-lg"><ShoppingBag className="w-5 h-5"/></div>
                  </div>
              </div>
              <div className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-theme-text-sec text-xs font-bold uppercase tracking-wider">Pending Approvals</p>
                          <h3 className="text-2xl font-bold text-theme-text mt-1">{pendingAgents}</h3>
                      </div>
                      <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg"><Box className="w-5 h-5"/></div>
                  </div>
              </div>
              <div className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-theme-text-sec text-xs font-bold uppercase tracking-wider">New Leads</p>
                          <h3 className="text-2xl font-bold text-theme-text mt-1">{newLeads}</h3>
                      </div>
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users className="w-5 h-5"/></div>
                  </div>
              </div>
              <div className="bg-theme-card p-6 rounded-xl border border-theme-border shadow-sm">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-theme-text-sec text-xs font-bold uppercase tracking-wider">Active Disputes</p>
                          <h3 className="text-2xl font-bold text-theme-text mt-1">{openReports}</h3>
                      </div>
                      <div className="p-2 bg-red-100 text-red-600 rounded-lg"><Flag className="w-5 h-5"/></div>
                  </div>
              </div>
          </div>
      );
  };

  const renderAgentsTable = () => {
      const filtered = agents.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
      return (
          <div className="bg-theme-card rounded-xl border border-theme-border overflow-hidden">
              <div className="p-4 border-b border-theme-border flex justify-between items-center">
                  <div className="relative max-w-sm w-full">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-theme-text-sec" />
                      <input 
                        type="text" 
                        placeholder="Search agents..." 
                        className="w-full pl-9 pr-4 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                  </div>
                  <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium border border-theme-border rounded-lg flex items-center bg-theme-bg-sec"><Filter className="w-3 h-3 mr-1"/> Status</button>
                  </div>
              </div>
              <table className="min-w-full divide-y divide-theme-border">
                  <thead className="bg-theme-bg-sec">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Agent</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Builder</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Trust</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-theme-text-sec uppercase tracking-wider">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-theme-border">
                      {filtered.map(agent => (
                          <tr key={agent.id} className="hover:bg-theme-bg-sec/50">
                              <td className="px-6 py-4">
                                  <div className="flex items-center">
                                      <div className="h-8 w-8 rounded bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">{agent.name[0]}</div>
                                      <div>
                                          <div className="text-sm font-medium text-theme-text">{agent.name}</div>
                                          <div className="text-xs text-theme-text-sec">{agent.category}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-theme-text-sec">{agent.builder.name}</td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      agent.state === 'production' ? 'bg-green-100 text-green-700' :
                                      agent.state === 'submission' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                      {agent.state || 'Production'}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-sm font-medium text-theme-text">{agent.trustScore}</td>
                              <td className="px-6 py-4 text-right flex justify-end gap-2">
                                  {agent.state === 'submission' && (
                                      <button onClick={() => toggleAgentStatus(agent.id, 'production')} className="text-green-600 hover:text-green-700 p-1" title="Approve"><CheckCircle className="w-4 h-4"/></button>
                                  )}
                                  <button onClick={() => toggleVerification(agent.id)} className={`p-1 ${agent.verified ? 'text-blue-600' : 'text-gray-400'}`} title="Verify"><ShieldCheck className="w-4 h-4"/></button>
                                  <button className="text-gray-400 hover:text-red-500 p-1" title="Reject/Suspend"><XCircle className="w-4 h-4"/></button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      );
  };

  const renderBuildersTable = () => (
      <div className="bg-theme-card rounded-xl border border-theme-border overflow-hidden">
          <table className="min-w-full divide-y divide-theme-border">
              <thead className="bg-theme-bg-sec">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Builder</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Reputation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Verification</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-theme-text-sec uppercase tracking-wider">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                  {builders.map(builder => (
                      <tr key={builder.id} className="hover:bg-theme-bg-sec/50">
                          <td className="px-6 py-4 flex items-center gap-3">
                              <img src={builder.avatar} className="w-8 h-8 rounded-full" alt="" />
                              <span className="text-sm font-medium text-theme-text">{builder.name}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-theme-text-sec capitalize">{builder.type?.replace('_', ' ')}</td>
                          <td className="px-6 py-4 text-sm text-theme-text-sec">{builder.stats?.avgTrust}% Trust</td>
                          <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${builder.verified ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                                  {builder.verified ? 'Verified' : 'Unverified'}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                              <button onClick={() => toggleBuilderStatus(builder.id)} className="text-sm text-indigo-600 hover:underline">
                                  {builder.verified ? 'Revoke' : 'Verify'}
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );

  const renderSalesLeads = () => (
      <div className="space-y-8">
          {/* Leads */}
          <div className="bg-theme-card rounded-xl border border-theme-border p-6">
              <h3 className="font-bold text-theme-text mb-4">High-Intent Leads</h3>
              <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                      <thead className="text-xs text-theme-text-sec uppercase bg-theme-bg-sec">
                          <tr>
                              <th className="px-4 py-2">Name</th>
                              <th className="px-4 py-2">Agent Interest</th>
                              <th className="px-4 py-2">Contact</th>
                              <th className="px-4 py-2">Status</th>
                              <th className="px-4 py-2 text-right">Action</th>
                          </tr>
                      </thead>
                      <tbody>
                          {leads.map(lead => (
                              <tr key={lead.id} className="border-b border-theme-border hover:bg-theme-bg-sec/30">
                                  <td className="px-4 py-3 font-medium text-theme-text">{lead.name} <span className="text-xs text-theme-text-sec block">{lead.organization}</span></td>
                                  <td className="px-4 py-3 text-theme-text-sec">{lead.agentName}</td>
                                  <td className="px-4 py-3 text-theme-text-sec">{lead.phone} <br/> {lead.email}</td>
                                  <td className="px-4 py-3">
                                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                                          lead.status === 'New' ? 'bg-green-100 text-green-700' : 
                                          lead.status === 'Contacted' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                      }`}>
                                          {lead.status}
                                      </span>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                      <select 
                                          className="text-xs bg-theme-bg-sec border border-theme-border rounded px-2 py-1"
                                          value={lead.status}
                                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                                      >
                                          <option value="New">New</option>
                                          <option value="Contacted">Contacted</option>
                                          <option value="Qualified">Qualified</option>
                                          <option value="Rejected">Rejected</option>
                                      </select>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          {/* Disputes */}
          <div className="bg-theme-card rounded-xl border border-theme-border p-6">
              <h3 className="font-bold text-theme-text mb-4">Purchase Disputes</h3>
              <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">User @jason.b reported "Agent Crash on Launch"</p>
                      <p className="text-xs text-gray-600">Agent: Salesforce Lead Prioritizer • ID: #DIS-921</p>
                  </div>
                  <div className="flex gap-2">
                      <button className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium">Review Logs</button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium">Refund</button>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderCommunity = () => (
      <div className="bg-theme-card rounded-xl border border-theme-border overflow-hidden">
          {posts.map(post => (
              <div key={post.id} className="p-4 border-b border-theme-border flex justify-between items-start hover:bg-theme-bg-sec/30">
                  <div className="flex gap-3">
                      <Flag className="w-4 h-4 text-theme-text-sec mt-1" />
                      <div>
                          <h4 className="text-sm font-bold text-theme-text">{post.title}</h4>
                          <p className="text-xs text-theme-text-sec mt-1 line-clamp-1">{post.content}</p>
                          <div className="flex gap-2 mt-2">
                              <span className="text-xs bg-theme-bg-sec px-2 py-0.5 rounded text-theme-text-sec">by {post.author.name}</span>
                              <span className="text-xs bg-theme-bg-sec px-2 py-0.5 rounded text-theme-text-sec">{post.category}</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <button className="p-2 text-theme-text-sec hover:text-green-600" title="Pin"><Pin className="w-4 h-4"/></button>
                      <button className="p-2 text-theme-text-sec hover:text-yellow-600" title="Close Thread"><Lock className="w-4 h-4"/></button>
                      <button onClick={() => deletePost(post.id)} className="p-2 text-theme-text-sec hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4"/></button>
                  </div>
              </div>
          ))}
      </div>
  );

  const renderReports = () => (
      <div className="bg-theme-card rounded-xl border border-theme-border overflow-hidden">
          <div className="p-4 border-b border-theme-border">
              <h3 className="font-bold text-theme-text">Ticket Management</h3>
          </div>
          <table className="min-w-full divide-y divide-theme-border">
              <thead className="bg-theme-bg-sec">
                  <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Ticket ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Target</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-theme-text-sec uppercase tracking-wider">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-theme-border">
                  {reports.map(report => (
                      <tr key={report.id} className="hover:bg-theme-bg-sec/50">
                          <td className="px-6 py-4 text-sm font-mono text-theme-text-sec">{report.id}</td>
                          <td className="px-6 py-4 text-sm text-theme-text font-medium capitalize">{report.reason}</td>
                          <td className="px-6 py-4 text-sm text-theme-text-sec capitalize">{report.targetType}</td>
                          <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  report.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  report.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                  {report.status}
                              </span>
                          </td>
                          <td className="px-6 py-4 text-right flex justify-end gap-2">
                              <button onClick={() => handleTicketAction(report.id, 'warn')} className="text-yellow-600 hover:text-yellow-700 text-xs font-medium px-2 py-1 border border-yellow-200 rounded hover:bg-yellow-50 transition-colors">Warn</button>
                              <button onClick={() => handleTicketAction(report.id, 'delete')} className="text-red-600 hover:text-red-700 text-xs font-medium px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors">Delete</button>
                              <button onClick={() => handleTicketAction(report.id, 'suspend')} className="text-gray-600 hover:text-gray-900 text-xs font-medium px-2 py-1 border border-gray-200 rounded hover:bg-gray-100 transition-colors">Suspend</button>
                          </td>
                      </tr>
                  ))}
                  {reports.length === 0 && (
                      <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-theme-text-sec text-sm">
                              <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                              No active reports.
                          </td>
                      </tr>
                  )}
              </tbody>
          </table>
      </div>
  );

  const renderMarketplaceControls = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
              <div key={agent.id} className="bg-theme-card p-4 rounded-xl border border-theme-border shadow-sm flex flex-col justify-between">
                  <div className="flex gap-3 mb-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold">{agent.name[0]}</div>
                      <div>
                          <h4 className="font-bold text-sm text-theme-text line-clamp-1">{agent.name}</h4>
                          <p className="text-xs text-theme-text-sec">Trust: {agent.trustScore}</p>
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="flex items-center justify-between text-sm cursor-pointer p-2 bg-theme-bg-sec rounded hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                          <span className="flex items-center text-theme-text"><Star className="w-3 h-3 mr-2 text-yellow-500"/> Featured</span>
                          <input type="checkbox" checked={agent.badges?.includes('featured')} onChange={() => toggleBadge(agent.id, 'featured')} className="rounded text-indigo-600 focus:ring-indigo-500"/>
                      </label>
                      <label className="flex items-center justify-between text-sm cursor-pointer p-2 bg-theme-bg-sec rounded hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                          <span className="flex items-center text-theme-text"><Activity className="w-3 h-3 mr-2 text-red-500"/> Trending</span>
                          <input type="checkbox" checked={agent.segment === 'trending'} onChange={() => toggleAgentStatus(agent.id, agent.state === 'production' ? 'production' : 'draft')} className="rounded text-indigo-600 focus:ring-indigo-500"/>
                      </label>
                      <label className="flex items-center justify-between text-sm cursor-pointer p-2 bg-theme-bg-sec rounded hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                          <span className="flex items-center text-theme-text"><CheckCircle className="w-3 h-3 mr-2 text-blue-500"/> Sponsored</span>
                          <input type="checkbox" checked={agent.badges?.includes('sponsored')} onChange={() => toggleBadge(agent.id, 'sponsored')} className="rounded text-indigo-600 focus:ring-indigo-500"/>
                      </label>
                  </div>
              </div>
          ))}
      </div>
  );

  return (
    <div className="min-h-screen bg-theme-bg-sec flex">
        
        {/* Left Sidebar */}
        <div className="w-64 bg-theme-card border-r border-theme-border hidden md:flex flex-col">
            <div className="p-6 border-b border-theme-border">
                <h2 className="text-xl font-bold text-theme-text flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-indigo-600"/> Admin Panel
                </h2>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {[
                    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                    { id: 'agents', label: 'Agents', icon: Box },
                    { id: 'builders', label: 'Builders', icon: Users },
                    { id: 'sales', label: 'Sales & Leads', icon: ShoppingBag },
                    { id: 'community', label: 'Community', icon: MessageSquare },
                    { id: 'reports', label: 'Reports & Safety', icon: Flag },
                    { id: 'marketplace', label: 'Marketplace', icon: Star }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as Tab)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === item.id 
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
                            : 'text-theme-text-sec hover:bg-theme-bg-sec hover:text-theme-text'
                        }`}
                    >
                        <item.icon className="w-5 h-5 mr-3"/>
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-theme-text capitalize">{activeTab.replace('_', ' ')}</h1>
                <p className="text-theme-text-sec text-sm">Manage platform resources and moderation.</p>
            </div>

            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'agents' && renderAgentsTable()}
            {activeTab === 'builders' && renderBuildersTable()}
            {activeTab === 'sales' && renderSalesLeads()}
            {activeTab === 'community' && renderCommunity()}
            {activeTab === 'reports' && renderReports()}
            {activeTab === 'marketplace' && renderMarketplaceControls()}
        </div>

    </div>
  );
};

export default AdminDashboard;
