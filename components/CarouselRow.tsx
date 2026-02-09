
import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Agent } from '../types';
import AgentCard from './AgentCard';
import { Link } from 'react-router-dom';

interface CarouselRowProps {
  title: string;
  subtitle?: string;
  agents: Agent[];
  viewAllLink?: string;
}

const CarouselRow: React.FC<CarouselRowProps> = ({ title, subtitle, agents, viewAllLink }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [agents]);

  const scrollByOne = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (agents.length === 0) return null;

  return (
    <div className="relative group py-8 border-b border-theme-border last:border-0 transition-colors duration-300">
       <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-6 flex justify-between items-end">
           <div>
               <h2 className="text-2xl font-bold tracking-tight text-theme-text">{title}</h2>
               {subtitle && <p className="mt-1 text-sm text-theme-text-sec">{subtitle}</p>}
           </div>
           {viewAllLink && (
               <Link to={viewAllLink} className="text-indigo-600 hover:text-indigo-500 text-sm font-semibold flex items-center group/link">
                   View All <ArrowRight className="ml-1 w-4 h-4 group-hover/link:translate-x-1 transition-transform"/>
               </Link>
           )}
       </div>

       {/* Left Navigation */}
       <button
         onClick={() => scrollByOne('left')}
         disabled={!canScrollLeft}
         className={`absolute left-2 top-[60%] -translate-y-1/2 z-20 p-3 rounded-full bg-theme-card shadow-lg border border-theme-border text-theme-text transition-all duration-200 ${
           !canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 hover:border-indigo-500'
         }`}
         aria-label="Scroll left"
       >
         <ChevronLeft className="w-5 h-5" />
       </button>

       {/* Carousel Container */}
       <div
         ref={carouselRef}
         onScroll={checkScroll}
         className="flex overflow-x-auto gap-6 pb-8 px-6 lg:px-8 scrollbar-hide snap-x"
         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
       >
         {agents.map((agent) => (
            <div 
                key={agent.id} 
                className="min-w-[300px] md:min-w-[340px] snap-center h-auto"
            >
                <div className="h-full">
                    <AgentCard agent={agent} />
                </div>
            </div>
         ))}
         {/* Padding for end */}
         <div className="min-w-[20px]"></div>
       </div>

       {/* Right Navigation */}
       <button
         onClick={() => scrollByOne('right')}
         disabled={!canScrollRight}
         className={`absolute right-2 top-[60%] -translate-y-1/2 z-20 p-3 rounded-full bg-theme-card shadow-lg border border-theme-border text-theme-text transition-all duration-200 ${
           !canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 hover:border-indigo-500'
         }`}
         aria-label="Scroll right"
       >
         <ChevronRight className="w-5 h-5" />
       </button>
    </div>
  );
};

export default CarouselRow;
