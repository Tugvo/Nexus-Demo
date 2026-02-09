
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCommunity } from '../context/CommunityContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, ThumbsUp, MessageSquare, Share2, Bookmark, CheckCircle, Send, MoreVertical, ShieldCheck, Flag, ArrowDownUp, Edit2 } from 'lucide-react';

const ThreadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getPostById, addReply, markAnswer, toggleLike, toggleReplyLike, reportContent, incrementView, editPost, editReply } = useCommunity();
  const { user, openLoginModal } = useAuth();
  const [replyText, setReplyText] = useState('');
  
  // Sorting State
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'likes'>('newest');

  // Reporting State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportTargetId, setReportTargetId] = useState('');
  const [reportReason, setReportReason] = useState('spam');

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const post = getPostById(id || '');

  // Increment View on Mount
  useEffect(() => {
      if (id) {
          incrementView(id);
      }
  }, [id, incrementView]);

  const sortedReplies = useMemo(() => {
      if (!post) return [];
      const replies = [...post.replies];
      
      if (sortOrder === 'newest') {
          return replies.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()); // Mock timestamp parsing
      } else if (sortOrder === 'oldest') {
          // For simple strings like "2 hours ago", real sorting needs real dates. 
          // Assuming mocks might have real ISO strings in future or simple reverse.
          return replies; // Default mock order is usually chronological
      } else if (sortOrder === 'likes') {
          return replies.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      }
      return replies;
  }, [post, sortOrder]);

  if (!post) return <div className="p-8 text-center text-theme-text">Thread not found</div>;

  const handleReply = (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
          openLoginModal();
          return;
      }
      if (replyText.trim()) {
          addReply(post.id, replyText);
          setReplyText('');
      }
  };

  const openReport = (targetId: string) => {
      if (!user) {
          openLoginModal();
          return;
      }
      setReportTargetId(targetId);
      setReportModalOpen(true);
  };

  const submitReport = () => {
      reportContent(reportTargetId, 'comment', reportReason);
      setReportModalOpen(false);
      alert("Report submitted. An admin ticket has been created.");
  };

  const handleEditStart = (id: string, content: string) => {
      setEditingId(id);
      setEditContent(content);
  };

  const handleEditCancel = () => {
      setEditingId(null);
      setEditContent('');
  };

  const handleEditSave = (type: 'post' | 'reply', postId: string, replyId?: string) => {
      if (type === 'post') {
          editPost(postId, editContent);
      } else if (type === 'reply' && replyId) {
          editReply(postId, replyId, editContent);
      }
      setEditingId(null);
      setEditContent('');
  };

  const isAuthor = user?.id === post.author.id;

  return (
    <div className="bg-theme-bg-sec min-h-screen py-8 transition-colors duration-300">
      
      {/* Report Modal */}
      {reportModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl animate-scale-in">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Report Content</h3>
                  <p className="text-sm text-gray-500 mb-4">Why are you reporting this?</p>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-sm"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  >
                      <option value="spam">Spam</option>
                      <option value="harassment">Harassment</option>
                      <option value="misinformation">Misinformation</option>
                      <option value="off-topic">Off-topic</option>
                      <option value="other">Other</option>
                  </select>
                  <div className="flex justify-end gap-2">
                      <button onClick={() => setReportModalOpen(false)} className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg">Cancel</button>
                      <button onClick={submitReport} className="px-4 py-2 bg-red-600 text-white text-sm font-medium hover:bg-red-700 rounded-lg">Submit Report</button>
                  </div>
              </div>
          </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/community" className="inline-flex items-center text-sm text-theme-text-sec hover:text-theme-text mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Discussions
        </Link>

        {/* Main Post */}
        <div className="bg-theme-card rounded-xl shadow-sm border border-theme-border p-8 mb-6 animate-scale-in group">
            <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-1">
                        <button onClick={() => toggleLike(post.id)} className="text-theme-text-sec hover:text-indigo-600 transition-colors">
                            <ThumbsUp className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-theme-text">{post.likes}</span>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-theme-text mb-2">{post.title}</h1>
                        <div className="flex items-center gap-3 text-sm text-theme-text-sec">
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">{post.category}</span>
                            <span>Posted {post.date}</span>
                            <span>• {post.views || 0} Views</span>
                            {post.status === 'answered' && <span className="flex items-center text-green-600 font-medium"><CheckCircle className="w-3 h-3 mr-1"/> Answered</span>}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 text-theme-text-sec hover:bg-theme-bg-sec rounded-lg"><Bookmark className="w-5 h-5"/></button>
                    {isAuthor ? (
                        <button 
                            onClick={() => handleEditStart(post.id, post.content)} 
                            className="p-2 text-theme-text-sec hover:text-indigo-600 rounded-lg"
                            title="Edit Post"
                        >
                            <Edit2 className="w-5 h-5" />
                        </button>
                    ) : (
                        <button 
                            onClick={() => openReport(post.id)} 
                            className="p-2 text-theme-text-sec hover:text-red-500 rounded-lg" 
                            title="Report"
                        >
                            <Flag className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="pl-10">
                {editingId === post.id ? (
                    <div className="mb-6">
                        <textarea 
                            className="w-full p-4 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            rows={6}
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <button onClick={handleEditCancel} className="px-3 py-1.5 text-xs font-medium text-theme-text-sec hover:text-theme-text">Cancel</button>
                            <button onClick={() => handleEditSave('post', post.id)} className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                        </div>
                    </div>
                ) : (
                    <p className="text-theme-text leading-relaxed whitespace-pre-wrap mb-6">
                        {post.content}
                    </p>
                )}

                {/* Attachments */}
                {post.attachments && post.attachments.length > 0 && (
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {post.attachments.map((url, idx) => (
                            <img 
                                key={idx} 
                                src={url} 
                                alt={`Attachment ${idx + 1}`} 
                                loading="lazy"
                                className="rounded-lg border border-theme-border w-full h-auto object-cover max-h-96"
                            />
                        ))}
                    </div>
                )}
                
                {post.relatedAgentId && (
                    <div className="mb-6 p-3 bg-theme-bg-sec border border-theme-border rounded-lg inline-flex items-center gap-3">
                        <div className="text-xs font-bold text-theme-text-sec uppercase">Referenced Agent:</div>
                        <Link to={`/agent/${post.relatedAgentId}`} className="text-sm font-medium text-indigo-600 hover:underline">
                            View Agent Details
                        </Link>
                    </div>
                )}

                <div className="flex items-center gap-3 pt-6 border-t border-theme-border">
                    <Link to={post.author.role === 'builder' ? `/builder/${post.author.id}` : `/user/${post.author.id}`}>
                        <img src={post.author.avatar} alt="" className="w-8 h-8 rounded-full hover:ring-2 ring-indigo-300 transition-all" />
                    </Link>
                    <div>
                        <Link to={post.author.role === 'builder' ? `/builder/${post.author.id}` : `/user/${post.author.id}`} className="text-sm font-bold text-theme-text hover:text-indigo-600">
                            {post.author.name}
                        </Link>
                        <div className="text-xs text-theme-text-sec">{post.author.role}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Replies Header & Sorting */}
        <div className="flex items-center justify-between mb-6 px-2">
            <h3 className="text-lg font-bold text-theme-text">{post.repliesCount} Replies</h3>
            <div className="flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4 text-theme-text-sec" />
                <select 
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="bg-transparent text-sm font-medium text-theme-text border-none focus:ring-0 cursor-pointer"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="likes">Most Liked</option>
                </select>
            </div>
        </div>

        {/* Replies */}
        <div className="space-y-6">
            {sortedReplies.map(reply => (
                <div key={reply.id} className={`bg-theme-card p-6 rounded-xl border shadow-sm transition-all group/reply ${reply.isAcceptedAnswer ? 'border-green-300 ring-1 ring-green-300' : 'border-theme-border'}`}>
                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <Link to={reply.author.role === 'builder' ? `/builder/${reply.author.id}` : `/user/${reply.author.id}`}>
                                <img src={reply.author.avatar} alt="" className="w-10 h-10 rounded-full hover:ring-2 ring-indigo-300 transition-all" />
                            </Link>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <Link to={reply.author.role === 'builder' ? `/builder/${reply.author.id}` : `/user/${reply.author.id}`} className="font-bold text-theme-text mr-2 hover:text-indigo-600 transition-colors">
                                        {reply.author.name}
                                    </Link>
                                    {reply.author.verified && <ShieldCheck className="w-4 h-4 text-blue-500 inline mr-2"/>}
                                    <span className="text-xs text-theme-text-sec">{reply.timestamp}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {isAuthor && !post.status.includes('answered') && (
                                        <button 
                                            onClick={() => markAnswer(post.id, reply.id)}
                                            className="text-xs font-medium text-theme-text-sec hover:text-green-600 flex items-center gap-1"
                                        >
                                            <CheckCircle className="w-3 h-3" /> Mark as Answer
                                        </button>
                                    )}
                                    {reply.isAcceptedAnswer && (
                                        <span className="text-xs font-bold text-green-600 flex items-center bg-green-50 px-2 py-1 rounded-full">
                                            <CheckCircle className="w-3 h-3 mr-1" /> Accepted Answer
                                        </span>
                                    )}
                                    
                                    {user?.id === reply.author.id ? (
                                        <button 
                                            onClick={() => handleEditStart(reply.id, reply.content)}
                                            className="text-gray-300 hover:text-indigo-600 opacity-0 group-hover/reply:opacity-100 transition-opacity" 
                                            title="Edit Reply"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => openReport(reply.id)}
                                            className="text-gray-300 hover:text-red-500 opacity-0 group-hover/reply:opacity-100 transition-opacity" 
                                            title="Report"
                                        >
                                            <Flag className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {editingId === reply.id ? (
                                <div className="mb-2">
                                    <textarea 
                                        className="w-full p-3 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        rows={3}
                                        value={editContent}
                                        onChange={e => setEditContent(e.target.value)}
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button onClick={handleEditCancel} className="px-3 py-1.5 text-xs font-medium text-theme-text-sec hover:text-theme-text">Cancel</button>
                                        <button onClick={() => handleEditSave('reply', post.id, reply.id)} className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-theme-text text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                            )}
                            
                            {/* Reply Attachments (Future Proofing) */}
                            {reply.attachments && reply.attachments.length > 0 && (
                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {reply.attachments.map((url, idx) => (
                                        <img key={idx} src={url} alt="reply attachment" className="rounded border border-theme-border w-full h-auto max-h-40 object-cover" />
                                    ))}
                                </div>
                            )}

                            {/* Reply Actions */}
                            <div className="mt-3 flex items-center gap-4">
                                <button 
                                    onClick={() => toggleReplyLike(post.id, reply.id)}
                                    className="flex items-center text-xs font-medium text-theme-text-sec hover:text-indigo-600 transition-colors"
                                >
                                    <ThumbsUp className="w-3.5 h-3.5 mr-1" /> {reply.likes || 0}
                                </button>
                                <button className="text-xs font-medium text-theme-text-sec hover:text-indigo-600 transition-colors">
                                    Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Reply Box */}
            <div className="bg-theme-card p-6 rounded-xl border border-theme-border mt-8">
                <h4 className="text-sm font-bold text-theme-text mb-4">Post a Reply</h4>
                {user ? (
                    <form onSubmit={handleReply}>
                        <textarea
                            className="w-full p-4 bg-theme-bg-sec border border-theme-border rounded-xl text-sm text-theme-text focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            rows={4}
                            placeholder="Add to the discussion..."
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end mt-4">
                            <button 
                                type="submit"
                                disabled={!replyText.trim()}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                            >
                                Post Reply
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center py-6 bg-theme-bg-sec rounded-lg border border-dashed border-theme-border">
                        <p className="text-sm text-theme-text-sec mb-3">Log in to join the conversation.</p>
                        <button onClick={openLoginModal} className="text-indigo-600 font-bold hover:underline">Sign In</button>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default ThreadDetail;
