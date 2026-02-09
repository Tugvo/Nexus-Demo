import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Hexagon, PenTool, Users, Zap, LayoutGrid, ArrowRight } from 'lucide-react';

const PlatformSelector: React.FC = () => {
  const { availablePlatforms, selectPlatform, logout, user } = useAuth();

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'Hexagon': return <Hexagon className="w-8 h-8 text-indigo-600" />;
      case 'PenTool': return <PenTool className="w-8 h-8 text-purple-600" />;
      case 'Users': return <Users className="w-8 h-8 text-blue-600" />;
      case 'Zap': return <Zap className="w-8 h-8 text-yellow-500" />;
      default: return <LayoutGrid className="w-8 h-8 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-scale-in">
        <div className="p-8 border-b border-gray-100 text-center">
            <h2 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h2>
            <p className="text-gray-500 mt-2">Select a platform to access</p>
        </div>
        
        <div className="p-8 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availablePlatforms.map((platform) => (
                    <button
                        key={platform.id}
                        onClick={() => selectPlatform(platform.id)}
                        className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border-2 border-transparent hover:border-indigo-500 hover:shadow-md transition-all group text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                            {getIcon(platform.iconName)}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{platform.name}</h3>
                        <p className="text-sm text-gray-500">{platform.description}</p>
                        <div className="mt-4 text-indigo-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                            Enter Platform <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                    </button>
                ))}
            </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-center">
            <button onClick={logout} className="text-sm text-gray-500 hover:text-red-600 transition-colors">
                Sign Out
            </button>
        </div>
      </div>
    </div>
  );
};

export default PlatformSelector;
