
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: '1',
    quote: "Salesforce Lead Prioritizer cut our SDR ramp time by 40%. It's not just a tool; it's our best hire.",
    authorName: "Elena Rodriguez",
    authorRole: "VP of Sales, TechFlow",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    agentId: 't-1',
    agentName: 'Salesforce Lead Prioritizer',
    agentLogo: 'https://cdn-icons-png.flaticon.com/512/5968/5968914.png'
  },
  {
    id: '2',
    quote: "The Code Refactorer caught a critical security flaw that two senior engineers missed. Indispensable.",
    authorName: "Marcus Chen",
    authorRole: "CTO, DevScale",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    agentId: 't-5',
    agentName: 'Python Code Refactorer',
    agentLogo: 'https://cdn-icons-png.flaticon.com/512/5968/5968350.png'
  },
  {
    id: '3',
    quote: "We automated 90% of our invoice processing in week one. The ROI was immediate.",
    authorName: "Sarah Jenkins",
    authorRole: "CFO, GrowthWorks",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    agentId: 't-6',
    agentName: 'Invoice Approver AI',
    agentLogo: 'https://cdn-icons-png.flaticon.com/512/2855/2855198.png'
  }
];

const TestimonialsCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-20 bg-theme-bg-sec border-b border-theme-border">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        <div className="relative h-[280px] sm:h-[240px] flex items-center justify-center">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={item.id}
              className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out transform ${
                index === activeIndex 
                  ? 'opacity-100 translate-y-0 pointer-events-auto' 
                  : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
            >
              <Quote className="w-8 h-8 text-indigo-300 mb-6 opacity-50" />
              <blockquote className="text-xl sm:text-2xl font-medium text-theme-text mb-8 leading-relaxed">
                "{item.quote}"
              </blockquote>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in">
                <div className="flex items-center gap-3">
                    <img 
                      src={item.authorAvatar} 
                      alt={item.authorName} 
                      className="w-10 h-10 rounded-full object-cover grayscale border border-theme-border"
                    />
                    <div className="text-left">
                      <div className="text-sm font-bold text-theme-text">{item.authorName}</div>
                      <div className="text-xs text-theme-text-sec">{item.authorRole}</div>
                    </div>
                </div>

                <div className="hidden sm:block h-8 w-px bg-theme-border mx-2"></div>

                <Link 
                  to={`/agent/${item.agentId}`} 
                  className="flex items-center gap-2 hover:bg-theme-card px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-theme-border group"
                >
                    <img src={item.agentLogo} alt="" className="w-5 h-5 object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-semibold text-indigo-600 group-hover:underline">
                        {item.agentName}
                    </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-4 sm:mt-0">
          {TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? 'bg-indigo-600 w-4' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;
