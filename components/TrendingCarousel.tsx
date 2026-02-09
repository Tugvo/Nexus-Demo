import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Agent } from '../types';
import AgentCard from './AgentCard';

interface TrendingCarouselProps {
  agents: Agent[];
}

const TrendingCarousel: React.FC<TrendingCarouselProps> = ({ agents }) => {
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
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
       {/* Left Navigation */}
       <button
         onClick={() => scrollByOne('left')}
         disabled={!canScrollLeft}
         className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 p-2 rounded-full bg-theme-card shadow-lg border border-theme-border text-theme-text transition-all duration-200 ${
           !canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 hover:border-indigo-500'
         }`}
         aria-label="Scroll left"
       >
         <ChevronLeft className="w-6 h-6" />
       </button>

       {/* Carousel Container */}
       <div
         ref={carouselRef}
         onScroll={checkScroll}
         className="flex overflow-x-auto gap-6 pb-8 -mx-4 px-4 scrollbar-hide snap-x py-4"
         style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
       >
         {agents.map((agent) => (
            <div 
                key={agent.id} 
                className="min-w-[300px] md:min-w-[340px] snap-center h-auto transition-all duration-300 hover:scale-105 hover:z-10 opacity-90 hover:opacity-100"
            >
                <div className="h-full">
                    <AgentCard agent={agent} />
                </div>
            </div>
         ))}
       </div>

       {/* Right Navigation */}
       <button
         onClick={() => scrollByOne('right')}
         disabled={!canScrollRight}
         className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 p-2 rounded-full bg-theme-card shadow-lg border border-theme-border text-theme-text transition-all duration-200 ${
           !canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:scale-110 hover:border-indigo-500'
         }`}
         aria-label="Scroll right"
       >
         <ChevronRight className="w-6 h-6" />
       </button>
    </div>
  );
};

export default TrendingCarousel;
