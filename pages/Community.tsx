
import React, { useState, useMemo } from 'react';
import { MessageSquare, ThumbsUp, AlertCircle, Lightbulb, Search, Plus, Filter, MessageCircle, Eye, Image as ImageIcon } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { Link, useSearchParams } from 'react-router-dom';
import NewPostModal from '../components/NewPostModal';
import { useAuth } from '../context/AuthContext';

const Community: React.FC = () => {
  const { posts } = useCommunity();
  const { user, openLoginModal } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentView = searchParams.get('view') || 'all';

  const handleNewPost = () => {
      if (!user) {
          openLoginModal();
          return;
      }
      setShowNewPostModal(true);
  };

  const filteredPosts = useMemo(() => {
      let result = [...posts];

      // Search
      if (searchTerm) {
          const lower = searchTerm.toLowerCase();
          result = result.filter(p => 
            p.title.toLowerCase().includes(lower) || 
            p.content.toLowerCase().includes(lower) || 
            p.tags.some(t => t.toLowerCase().includes(lower))
          );
      }

      // Views
      if (currentView === 'trending') {
          result.sort((a, b) => (b.views * 0.4 + b.likes * 0.4 + b.repliesCount * 0.2) - (a.views * 0.4 + a.likes * 0.4 + a.repliesCount * 0.2));
      } else if (currentView === 'unanswered') {
          result = result.filter(p => p.status === 'open' && p.repliesCount === 0);
      } else {
          // Default: Newest
          result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Simplified date sort
      }

      return result;
  }, [posts, searchTerm, currentView]);

  return (
    <div className="bg-theme-bg-sec min-h-screen py-8 transition-colors duration-300">
      
      {showNewPostModal && <NewPostModal onClose={() => setShowNewPostModal(false)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-slide-up">
          <div>
            <h1 className="text-3xl font-bold text-theme-text">Community Hub</h1>
            <p className="text-theme-text-sec mt-1">Collaborate, request features, and solve problems together.</p>
          </div>
          <button 
            onClick={handleNewPost}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105"
          >
             <Plus className="w-4 h-4 mr-2" /> New Post
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Stats */}
            <div className="hidden lg:block space-y-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                 <div className="bg-theme-card p-6 rounded-xl shadow-sm border border-theme-border transition-colors">
                    <h3 className="font-bold text-theme-text mb-4">Topics</h3>
                    <ul className="space-y-3 text-sm">
                        <li className="flex justify-between items-center text-theme-text-sec hover:text-indigo-600 cursor-pointer transition-colors group">
                            <span>General Discussion</span>
                            <span className="bg-theme-bg-sec text-theme-text-sec px-2 py-0.5 rounded-full text-xs group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">124</span>
                        </li>
                        <li className="flex justify-between items-center text-theme-text-sec hover:text-indigo-600 cursor-pointer transition-colors group">
                            <span>Feature Requests</span>
                            <span className="bg-theme-bg-sec text-theme-text-sec px-2 py-0.5 rounded-full text-xs group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">45</span>
                        </li>
                        <li className="flex justify-between items-center text-theme-text-sec hover:text-indigo-600 cursor-pointer transition-colors group">
                            <span>Bug Reports</span>
                            <span className="bg-theme-bg-sec text-theme-text-sec px-2 py-0.5 rounded-full text-xs group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">12</span>
                        </li>
                    </ul>
                 </div>
                 
                 <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-md text-white transform hover:scale-[1.02] transition-transform duration-300">
                     <h3 className="font-bold mb-2">Top Contributor</h3>
                     <div className="flex items-center gap-3 mt-4">
                         <img src="https://picsum.photos/id/64/100/100" className="w-10 h-10 rounded-full border-2 border-white/50" alt="Sarah" />
                         <div>
                             <p className="font-medium text-sm">Sarah Chen</p>
                             <p className="text-indigo-100 text-xs">1,240 Reputation</p>
                         </div>
                     </div>
                 </div>
            </div>

            {/* Feed */}
            <div className="lg:col-span-3 space-y-6">
                
                {/* Controls */}
                <div className="bg-theme-card p-4 rounded-xl shadow-sm border border-theme-border flex flex-col md:flex-row gap-4 justify-between animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="flex gap-2 bg-theme-bg-sec p-1 rounded-lg self-start">
                        {['all', 'trending', 'unanswered'].map(view => (
                            <button 
                                key={view}
                                onClick={() => setSearchParams({ view })}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-all ${
                                    currentView === view 
                                    ? 'bg-white text-indigo-600 shadow-sm' 
                                    : 'text-theme-text-sec hover:text-theme-text'
                                }`}
                            >
                                {view}
                            </button>
                        ))}
                    </div>
                    
                    <div className="relative flex-grow md:max-w-xs">
                        <Search className="w-4 h-4 text-theme-text-sec absolute left-3 top-2.5" />
                        <input 
                            type="text" 
                            placeholder="Search discussions..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-theme-border bg-theme-bg-sec rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-theme-text-sec transition-colors" 
                        />
                    </div>
                </div>

                {/* Posts List */}
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-12 bg-theme-card rounded-xl border border-dashed border-theme-border">
                        <MessageCircle className="w-12 h-12 text-theme-text-sec mx-auto mb-3 opacity-50" />
                        <h3 className="text-theme-text font-medium">No discussions found</h3>
                        <p className="text-theme-text-sec text-sm mt-1">Be the first to start a conversation!</p>
                    </div>
                ) : (
                    filteredPosts.map((post, index) => (
                        <div key={post.id} className="bg-theme-card p-6 rounded-xl shadow-sm border border-theme-border hover:border-indigo-300 transition-all cursor-pointer group animate-slide-up" style={{ animationDelay: `${0.3 + index * 0.1}s` }}>
                            <div className="flex gap-4">
                                <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                                    <button className="text-theme-text-sec hover:text-indigo-600 transition-colors transform group-hover:scale-110">
                                        <ThumbsUp className="w-5 h-5" />
                                    </button>
                                    <span className="font-bold text-theme-text-sec">{post.likes}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1 border ${
                                            post.category === 'Bug' ? 'bg-red-50 text-red-700 border-red-100' :
                                            post.category === 'Feature Request' ? 'bg-green-50 text-green-700 border-green-100' :
                                            'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                            {post.category}
                                        </span>
                                        <span className="text-theme-text-sec text-xs">• {post.date}</span>
                                    </div>
                                    
                                    <Link to={`/community/thread/${post.id}`}>
                                        <h3 className="text-lg font-bold text-theme-text group-hover:text-indigo-600 mb-2 transition-colors">{post.title}</h3>
                                    </Link>
                                    
                                    <p className="text-theme-text-sec line-clamp-2 mb-4 text-sm leading-relaxed">{post.content}</p>
                                    
                                    {/* Media Preview in Card */}
                                    {post.attachments && post.attachments.length > 0 && (
                                        <div className="mb-4">
                                            <div className="inline-flex items-center gap-2 bg-theme-bg-sec border border-theme-border px-3 py-2 rounded-lg text-xs font-medium text-theme-text-sec">
                                                <ImageIcon className="w-4 h-4" />
                                                <span>{post.attachments.length} Attachment{post.attachments.length > 1 ? 's' : ''}</span>
                                            </div>
                                            {/* Preview first image lazily */}
                                            <img 
                                                src={post.attachments[0]} 
                                                loading="lazy"
                                                alt="attachment preview" 
                                                className="mt-2 h-20 w-auto object-cover rounded-lg border border-theme-border"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-theme-border">
                                        <Link 
                                            to={post.author.role === 'builder' ? `/builder/${post.author.id}` : `/user/${post.author.id}`}
                                            className="flex items-center gap-2 group/author"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <img src={post.author.avatar} alt="" className="w-5 h-5 rounded-full group-hover/author:ring-2 ring-indigo-300 transition-all" />
                                            <span className="text-xs text-theme-text font-medium group-hover/author:text-indigo-600 transition-colors">{post.author.name}</span>
                                        </Link>
                                        <div className="flex gap-2">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="text-xs text-theme-text-sec bg-theme-bg-sec px-2 py-1 rounded-md border border-theme-border">#{tag}</span>
                                            ))}
                                            <span className="flex items-center text-xs text-theme-text-sec ml-2 border-l border-theme-border pl-2" title="Replies">
                                                <MessageSquare className="w-3.5 h-3.5 mr-1" /> {post.repliesCount}
                                            </span>
                                            <span className="flex items-center text-xs text-theme-text-sec ml-2" title="Views">
                                                <Eye className="w-3.5 h-3.5 mr-1" /> {post.views || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
