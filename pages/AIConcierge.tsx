import React, { useState } from 'react';
import { Sparkles, Send, Bot, User as UserIcon } from 'lucide-react';
import { getAgentRecommendations } from '../services/geminiService';
import { MOCK_AGENTS } from '../data';
import { ChatMessage } from '../types';

const AIConcierge: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your Nexus Concierge. Tell me about your business problem or workflow bottleneck, and I will recommend the perfect AI agents to automate it.',
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    // Call Gemini Service
    const aiResponseText = await getAgentRecommendations(inputValue, MOCK_AGENTS);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiResponseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center justify-between">
            <div className="flex items-center text-white">
                <div className="bg-white/20 p-2 rounded-lg mr-3">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold">Nexus Concierge</h2>
                    <p className="text-indigo-100 text-xs">Powered by Gemini 2.5 Flash</p>
                </div>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mx-2 ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-purple-100'}`}>
                            {msg.role === 'user' ? <UserIcon className="w-5 h-5 text-indigo-600" /> : <Bot className="w-5 h-5 text-purple-600" />}
                        </div>
                        <div className={`p-4 rounded-2xl shadow-sm text-sm whitespace-pre-wrap ${
                            msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                        }`}>
                            {msg.content}
                        </div>
                    </div>
                </div>
            ))}
            {loading && (
                 <div className="flex justify-start">
                    <div className="flex flex-row items-center ml-12 bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                        <span className="ml-3 text-xs text-gray-400">Analyzing marketplace...</span>
                    </div>
                 </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Describe your task (e.g., 'I need to automate sales outreach on LinkedIn')"
                    className="w-full bg-gray-100 border-0 rounded-xl px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                />
                <button 
                    onClick={handleSend}
                    disabled={!inputValue.trim() || loading}
                    className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
                AI can make mistakes. Please verify recommendations.
            </p>
        </div>
      </div>
    </div>
  );
};

export default AIConcierge;
