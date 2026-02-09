
import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, ChevronRight, User, Sparkles, MessageSquare, ArrowRight, CheckCircle } from 'lucide-react';
import { getAgentRecommendations } from '../services/geminiService';
import { MOCK_AGENTS } from '../data';
import { Link } from 'react-router-dom';

interface Message {
    role: 'assistant' | 'user';
    content: string;
    type?: 'text' | 'agents' | 'lead-form';
    options?: string[];
}

const FloatingConcierge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0); // 0: Init, 1: Role, 2: Goal, 3: Tools, 4: Result, 5: Lead
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // User Data
  const [userData, setUserData] = useState({
      role: '',
      goal: '',
      tools: ''
  });
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial Message
  useEffect(() => {
      if (isOpen && messages.length === 0) {
          setMessages([
              { role: 'assistant', content: "Hi! I'm your NexusAI Concierge. Let's find your perfect agent stack." },
              { role: 'assistant', content: "First, which best describes you?", options: ['Student', 'Professional', 'Business', 'Enterprise', 'Creator'] }
          ]);
      }
  }, [isOpen]);

  // Auto-scroll
  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [messages, loading]);

  const handleOptionClick = async (option: string) => {
      // Add user response
      const newMessages: Message[] = [...messages, { role: 'user', content: option }];
      setMessages(newMessages);
      setLoading(true);

      // Process Step
      setTimeout(async () => {
          let botResponse: Message[] = [];
          
          if (step === 0) {
              setUserData(prev => ({ ...prev, role: option }));
              botResponse = [{ 
                  role: 'assistant', 
                  content: `Nice to meet you, ${option}. What is your main goal today?`,
                  options: ['Job Search', 'Sales Automation', 'Customer Support', 'Build an Agent', 'Productivity', 'Research']
              }];
              setStep(1);
          } else if (step === 1) {
              setUserData(prev => ({ ...prev, goal: option }));
              botResponse = [{ 
                  role: 'assistant', 
                  content: "Got it. Which tools do you use most often?",
                  options: ['Salesforce', 'Slack', 'HubSpot', 'Gmail', 'VS Code', 'Notion', 'Other']
              }];
              setStep(2);
          } else if (step === 2) {
              setUserData(prev => ({ ...prev, tools: option }));
              
              // Call AI for recommendations
              const prompt = `User is a ${userData.role} trying to ${userData.goal} using ${option}. Recommend 3 agents.`;
              const recommendationText = await getAgentRecommendations(prompt, MOCK_AGENTS);
              
              botResponse = [
                  { role: 'assistant', content: "I've analyzed the marketplace for you. Here are the best agents for your stack:", type: 'agents' },
                  { role: 'assistant', content: "Would you like to connect with a builder for a custom solution?", type: 'lead-form' }
              ];
              setStep(3);
          }

          setMessages(prev => [...prev, ...botResponse]);
          setLoading(false);
      }, 600);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setLeadSubmitted(true);
      // Simulate backend save
      setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', content: "Thanks! We'll be in touch shortly." }]);
      }, 500);
  };

  // Helper to extract agent links from text (simple regex for demo) or just show a curated list based on Mock Data
  // For this demo, we will filter MOCK_AGENTS based on the user selection simply.
  const getSuggestedAgents = () => {
      // Simple keyword matching
      const keywords = [userData.goal, userData.tools, userData.role].join(' ').toLowerCase();
      const relevant = MOCK_AGENTS.filter(a => 
          a.name.toLowerCase().includes(userData.tools.toLowerCase()) || 
          a.category.toLowerCase().includes(userData.goal.split(' ')[0].toLowerCase()) ||
          a.description.toLowerCase().includes(userData.goal.toLowerCase())
      ).slice(0, 3);
      
      // Fallback
      return relevant.length > 0 ? relevant : MOCK_AGENTS.slice(0, 3);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        {isOpen && (
            <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 mb-4 border border-indigo-100 overflow-hidden animate-scale-in flex flex-col max-h-[600px] h-[500px]">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white shrink-0">
                    <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5" />
                        <div>
                            <h3 className="font-bold text-sm">Nexus Concierge</h3>
                            <p className="text-[10px] text-indigo-200">AI Agent Expert</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => { setMessages([]); setStep(0); setIsOpen(false); setTimeout(() => setIsOpen(true), 100); }} className="hover:bg-white/20 p-1 rounded transition-colors" title="Reset">
                            <Sparkles className="w-4 h-4"/>
                        </button>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                            <X className="w-4 h-4"/>
                        </button>
                    </div>
                </div>
                
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scroll-smooth" ref={scrollRef}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            {msg.type !== 'agents' && msg.type !== 'lead-form' && (
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm mb-2 shadow-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                                }`}>
                                    {msg.content}
                                </div>
                            )}

                            {/* Render Options if available and it's the last message */}
                            {msg.options && idx === messages.length - 1 && !loading && (
                                <div className="flex flex-wrap gap-2 mt-1 animate-fade-in">
                                    {msg.options.map(opt => (
                                        <button 
                                            key={opt}
                                            onClick={() => handleOptionClick(opt)}
                                            className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-xs font-medium rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-colors shadow-sm"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Render Agents Recommendation */}
                            {msg.type === 'agents' && (
                                <div className="w-full space-y-3 animate-fade-in mt-2">
                                    <p className="text-xs text-gray-500 ml-1">Recommended for you:</p>
                                    {getSuggestedAgents().map(agent => (
                                        <Link to={`/agent/${agent.id}`} key={agent.id} className="block bg-white p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                                    {agent.logoUrl ? <img src={agent.logoUrl} className="w-6 h-6"/> : <Sparkles className="w-5 h-5 text-indigo-600"/>}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-gray-900 text-sm truncate group-hover:text-indigo-600">{agent.name}</h4>
                                                    <p className="text-xs text-gray-500 line-clamp-1">{agent.tagline}</p>
                                                    <div className="flex items-center mt-1.5">
                                                        <span className="text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-medium">{agent.trustScore} Trust</span>
                                                        <span className="mx-1 text-gray-300">•</span>
                                                        <span className="text-[10px] text-gray-500 font-bold">${agent.price}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 mt-3"/>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Render Lead Form */}
                            {msg.type === 'lead-form' && (
                                <div className="w-full bg-indigo-50 border border-indigo-100 rounded-xl p-4 mt-2 animate-fade-in">
                                    {!leadSubmitted ? (
                                        <form onSubmit={handleLeadSubmit} className="space-y-3">
                                            <p className="text-xs text-indigo-900 font-medium flex items-center">
                                                <MessageSquare className="w-3 h-3 mr-1"/> Chat with a Builder?
                                            </p>
                                            <input 
                                                type="email" 
                                                required
                                                placeholder="Enter your email..."
                                                className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                value={leadEmail}
                                                onChange={e => setLeadEmail(e.target.value)}
                                            />
                                            <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center">
                                                Connect Me <ArrowRight className="w-3 h-3 ml-1"/>
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="text-center py-2">
                                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <CheckCircle className="w-5 h-5"/>
                                            </div>
                                            <p className="text-xs text-green-800 font-medium">Request Sent!</p>
                                            <p className="text-[10px] text-green-600">A builder will email you shortly.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-fade-in">
                            <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm flex gap-1">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 bg-indigo-600 rounded-full shadow-xl flex items-center justify-center text-white hover:bg-indigo-700 hover:scale-110 transition-all active:scale-95 group relative z-50"
        >
            {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-7 h-7" />}
            {!isOpen && (
                <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                    AI Concierge
                    <div className="absolute top-1/2 -right-1 -mt-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </span>
            )}
            {!isOpen && (
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
                </span>
            )}
        </button>
    </div>
  );
};

export default FloatingConcierge;
