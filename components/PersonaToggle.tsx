
import React from 'react';
import { Persona } from '../types';
import { GraduationCap, Briefcase, Building2, Building, Code2 } from 'lucide-react';

interface PersonaToggleProps {
  selectedPersona: Persona;
  onSelect: (persona: Persona) => void;
}

const PERSONAS: { id: Persona; label: string; icon: any }[] = [
  { id: 'Students', label: 'Students', icon: GraduationCap },
  { id: 'Professionals', label: 'Professionals', icon: Briefcase },
  { id: 'Business Teams', label: 'Business Teams', icon: Building2 },
  { id: 'Enterprise', label: 'Enterprise', icon: Building },
  { id: 'Creators & Builders', label: 'Creators', icon: Code2 },
];

const PersonaToggle: React.FC<PersonaToggleProps> = ({ selectedPersona, onSelect }) => {
  return (
    <div className="w-full bg-theme-bg-sec border-b border-theme-border sticky top-16 z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 py-3 overflow-x-auto scrollbar-hide no-scrollbar">
          <span className="text-xs font-semibold text-theme-text-sec uppercase tracking-wider mr-2 hidden sm:block">Discover for:</span>
          {PERSONAS.map((p) => {
            const Icon = p.icon;
            const isSelected = selectedPersona === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105'
                    : 'bg-theme-card text-theme-text-sec border-theme-border hover:border-indigo-300 hover:text-theme-text'
                }`}
              >
                <Icon className={`w-4 h-4 mr-2 ${isSelected ? 'text-indigo-200' : 'text-theme-text-sec'}`} />
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PersonaToggle;
