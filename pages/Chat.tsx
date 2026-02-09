
import React, { useState, useEffect, useRef } from 'react';
import { useCommunication } from '../context/CommunicationContext';
import { Send, Paperclip, CheckCheck, User, Search, MoreVertical, MessageSquare, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const { threads, sendMessage, markThreadRead } = useCommunication();
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter threads
  const filteredThreads = threads.filter(t => {
      const matchesSearch = t.builderName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            t.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || (filter === 'unread' && t.unread);
      return matchesSearch && matchesFilter;
  });

  const activeThread = threads.find(t => t.id === activeThreadId);

  // Auto-select first thread if none selected
  useEffect(() => {
      if (!activeThreadId && filteredThreads.length > 0) {
          setActiveThreadId(filteredThreads[0].id);
      }
  }, [threads, activeThreadId]); 

  // Mark read when thread opens
  useEffect(() => {
      if (activeThreadId) {
          markThreadRead(activeThreadId);
      }
  }, [activeThreadId]);

  // Scroll to bottom
  useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  const handleSend = () => {
      if (inputText.trim() && activeThreadId) {
          sendMessage(activeThreadId, inputText);
          setInputText('');
      }
  };

  if (!user) return <div className="p-8 text-center text-theme-text">Please login to view messages.</div>;

  return (
    <div className="bg-theme-bg-sec min-h-screen py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[calc(100vh-100px)]">
        
        <div className="bg-theme-card rounded-2xl shadow-sm border border-theme-border h-full flex overflow-hidden">
            
            {/* LEFT SIDEBAR */}
            <div className="w-80 border-r border-theme-border flex flex-col bg-theme-bg-sec/30">
                <div className="p-4 border-b border-theme-border">
                    <h2 className="text-lg font-bold text-theme-text mb-4">Messages</h2>
                    <div className="flex gap-2 mb-3">
                        <button 
                            onClick={() => setFilter('all')}
                            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${filter === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-theme-card text-theme-text-sec border border-theme-border'}`}
                        >
                            All
                        </button>
                        <button 
                            onClick={() => setFilter('unread')}
                            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${filter === 'unread' ? 'bg-indigo-100 text-indigo-700' : 'bg-theme-card text-theme-text-sec border border-theme-border'}`}
                        >
                            Unread
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="w-4 h-4 text-theme-text-sec absolute left-3 top-2.5" />
                        <input 
                            type="text" 
                            placeholder="Search chats..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-theme-card border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {filteredThreads.length === 0 ? (
                        <div className="p-6 text-center text-theme-text-sec text-sm">
                            No conversations found.
                        </div>
                    ) : (
                        filteredThreads.map(thread => (
                            <div 
                                key={thread.id}
                                onClick={() => setActiveThreadId(thread.id)}
                                className={`p-4 border-b border-theme-border cursor-pointer transition-colors hover:bg-theme-bg-sec ${activeThreadId === thread.id ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex gap-3">
                                    <img src={thread.builderAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm truncate ${thread.unread ? 'font-bold text-theme-text' : 'font-medium text-theme-text'}`}>
                                                {thread.builderName}
                                            </h4>
                                            <span className="text-[10px] text-theme-text-sec whitespace-nowrap ml-2">
                                                {new Date(thread.lastUpdated).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${thread.unread ? 'text-theme-text font-medium' : 'text-theme-text-sec'}`}>
                                            {thread.messages[thread.messages.length - 1].content}
                                        </p>
                                        {thread.agentId && (
                                            <span className="inline-block mt-1 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[9px] rounded border border-gray-200">
                                                Re: Sales Agent
                                            </span>
                                        )}
                                    </div>
                                    {thread.unread && (
                                        <div className="h-2 w-2 bg-indigo-600 rounded-full mt-2"></div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT MAIN CHAT */}
            <div className="flex-1 flex flex-col bg-theme-card">
                {activeThread ? (
                    <>
                        {/* Thread Header */}
                        <div className="p-4 border-b border-theme-border flex justify-between items-center bg-theme-bg-sec/50">
                            <div className="flex items-center gap-3">
                                <Link to={`/builder/${activeThread.builderId}`}>
                                    <img src={activeThread.builderAvatar} alt="" className="w-10 h-10 rounded-full object-cover hover:ring-2 ring-indigo-300 transition-all" />
                                </Link>
                                <div>
                                    <Link to={`/builder/${activeThread.builderId}`} className="font-bold text-theme-text hover:text-indigo-600 transition-colors">
                                        {activeThread.builderName}
                                    </Link>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-theme-text-sec">{activeThread.subject}</p>
                                        {activeThread.sla && (
                                            <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100">
                                                {activeThread.sla}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button className="text-theme-text-sec hover:text-theme-text"><MoreVertical className="w-5 h-5"/></button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {activeThread.messages.map(msg => {
                                const isMe = msg.senderId === user.id;
                                return (
                                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mx-2 overflow-hidden border border-theme-border`}>
                                                {isMe ? (
                                                    user.avatar ? (
                                                        <Link to={`/user/${user.id}`}>
                                                            <img src={user.avatar} className="w-full h-full object-cover hover:opacity-80 transition-opacity" alt=""/>
                                                        </Link>
                                                    ) : (
                                                        <Link to={`/user/${user.id}`}>
                                                            <User className="w-5 h-5 text-theme-text-sec hover:text-indigo-600 transition-colors"/>
                                                        </Link>
                                                    )
                                                ) : (
                                                    <Link to={`/builder/${activeThread.builderId}`}>
                                                        <img src={activeThread.builderAvatar} className="w-full h-full object-cover hover:opacity-80 transition-opacity" alt=""/>
                                                    </Link>
                                                )}
                                            </div>
                                            <div>
                                                <div className={`p-4 rounded-2xl shadow-sm text-sm whitespace-pre-wrap ${
                                                    isMe 
                                                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                                                        : 'bg-theme-bg-sec text-theme-text rounded-tl-none border border-theme-border'
                                                }`}>
                                                    {msg.content}
                                                </div>
                                                <div className={`text-[10px] text-theme-text-sec mt-1 flex items-center ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                    {isMe && <CheckCheck className="w-3 h-3 ml-1 text-indigo-400" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-theme-border bg-theme-card">
                            <div className="flex items-end gap-2 bg-theme-bg-sec border border-theme-border rounded-xl p-2">
                                <button className="p-2 text-theme-text-sec hover:text-indigo-600 transition-colors">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <textarea 
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-theme-text max-h-32 resize-none py-2"
                                    placeholder="Type a message..."
                                    rows={1}
                                    value={inputText}
                                    onChange={e => setInputText(e.target.value)}
                                    onKeyDown={e => {
                                        if(e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                ></textarea>
                                <button 
                                    onClick={handleSend}
                                    disabled={!inputText.trim()}
                                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-theme-text-sec">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};

export default Chat;
