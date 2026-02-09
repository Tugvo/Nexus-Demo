
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShieldCheck, MessageSquare, ThumbsUp, Calendar, MapPin, Award, Activity, Heart, Star } from 'lucide-react';
import { MOCK_BUILDERS } from '../data'; 
import { User } from '../types';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Mock data fetching based on ID. In real app, fetch from API.
  // For demo, we'll try to find in mock builders or default to a generic user
  let profileUser: User | undefined = MOCK_BUILDERS.find(b => b.id === id);
  
  if (!profileUser) {
      // Fallback dummy user for demo purposes if ID doesn't match builders
      profileUser = {
          id: id || 'unknown',
          name: 'Alex Johnson',
          avatar: `https://ui-avatars.com/api/?name=Alex+Johnson&background=random`,
          role: 'buyer',
          verified: true,
          bio: 'AI enthusiast and automation specialist. Always looking for new tools to optimize workflow. Passionate about productivity and no-code solutions.',
          persona: 'Professional',
          joinedDate: 'Nov 2023',
          location: 'New York, USA',
          contributionScore: 450,
          activePoints: 120,
          interests: ['Automation', 'Marketing', 'No-Code', 'Productivity'],
          stats: {
              totalAgents: 0,
              totalDownloads: 15,
              avgRating: 0,
              avgTrust: 0
          }
      };
  }

  const [activeTab, setActiveTab] = useState<'activity' | 'reviews'>('activity');

  return (
    <div className="min-h-screen bg-theme-bg-sec py-12 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="bg-theme-card rounded-2xl shadow-sm border border-theme-border overflow-hidden mb-8 animate-fade-in">
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
            <div className="px-8 pb-8">
                <div className="relative flex justify-between items-end -mt-12 mb-6">
                    <div className="relative">
                        <img 
                            src={profileUser.avatar} 
                            alt={profileUser.name} 
                            className="w-32 h-32 rounded-2xl border-4 border-theme-card object-cover shadow-md bg-white"
                        />
                        {profileUser.verified && (
                            <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-theme-card shadow-sm" title="Verified User">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-3 mb-2">
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm">
                            Follow
                        </button>
                        <button className="px-4 py-2 border border-theme-border bg-theme-bg-sec text-theme-text rounded-lg font-medium text-sm hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
                            Message
                        </button>
                    </div>
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-theme-text flex items-center gap-2">
                        {profileUser.name}
                        <span className="text-sm font-normal text-theme-text-sec bg-theme-bg-sec px-2 py-0.5 rounded-full border border-theme-border">
                            {profileUser.persona || 'Member'}
                        </span>
                    </h1>
                    <p className="text-theme-text-sec mt-2 max-w-2xl leading-relaxed">
                        {profileUser.bio || 'No bio provided.'}
                    </p>
                    
                    <div className="flex flex-wrap gap-6 mt-6 text-sm text-theme-text-sec">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> Joined {profileUser.joinedDate || 'recently'}
                        </div>
                        {profileUser.location && (
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" /> {profileUser.location}
                            </div>
                        )}
                        <div className="flex items-center gap-1 text-orange-600 font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded border border-orange-100 dark:border-orange-800/30">
                            <Award className="w-4 h-4" /> {profileUser.contributionScore || 0} Contribution Score
                        </div>
                    </div>

                    {profileUser.interests && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {profileUser.interests.map(int => (
                                <span key={int} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded border border-indigo-100 dark:border-indigo-800/30 font-medium">
                                    {int}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar */}
            <div className="space-y-6">
                <div className="bg-theme-card rounded-xl shadow-sm border border-theme-border p-6">
                    <h3 className="font-bold text-theme-text mb-4 flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-green-500" /> Stats
                    </h3>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center p-2 rounded bg-theme-bg-sec/50">
                            <span className="text-theme-text-sec">Active Points</span>
                            <span className="font-bold text-theme-text">{profileUser.activePoints || 0}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-theme-bg-sec/50">
                            <span className="text-theme-text-sec">Reviews Written</span>
                            <span className="font-bold text-theme-text">12</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-theme-bg-sec/50">
                            <span className="text-theme-text-sec">Helpful Votes</span>
                            <span className="font-bold text-theme-text">48</span>
                        </div>
                        {profileUser.role === 'builder' && (
                             <div className="flex justify-between items-center p-2 rounded bg-theme-bg-sec/50">
                                <span className="text-theme-text-sec">Total Agents</span>
                                <span className="font-bold text-theme-text">{profileUser.stats?.totalAgents || 0}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex gap-6 border-b border-theme-border mb-4">
                    <button 
                        onClick={() => setActiveTab('activity')}
                        className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'activity' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-theme-text-sec hover:text-theme-text'}`}
                    >
                        Recent Activity
                    </button>
                    <button 
                        onClick={() => setActiveTab('reviews')}
                        className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-theme-text-sec hover:text-theme-text'}`}
                    >
                        Reviews
                    </button>
                </div>

                {activeTab === 'activity' && (
                    <div className="space-y-4 animate-slide-up">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-theme-card p-4 rounded-xl border border-theme-border flex gap-4 hover:border-indigo-300 transition-colors">
                                <div className="mt-1 bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full h-fit">
                                    <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-theme-text">
                                        <span className="font-bold">{profileUser?.name}</span> replied to a thread in <span className="text-indigo-600 font-medium cursor-pointer hover:underline">Salesforce Agent Support</span>
                                    </p>
                                    <p className="text-xs text-theme-text-sec mt-1">2 days ago</p>
                                    <div className="mt-2 text-sm text-theme-text-sec bg-theme-bg-sec p-3 rounded-lg border border-theme-border italic">
                                        "I found that increasing the API timeout helped resolve this issue..."
                                    </div>
                                </div>
                            </div>
                        ))}
                         <div className="bg-theme-card p-4 rounded-xl border border-theme-border flex gap-4 hover:border-indigo-300 transition-colors">
                                <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-2 rounded-full h-fit">
                                    <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-theme-text">
                                        <span className="font-bold">{profileUser?.name}</span> liked a post in <span className="text-indigo-600 font-medium cursor-pointer hover:underline">General Discussion</span>
                                    </p>
                                    <p className="text-xs text-theme-text-sec mt-1">5 days ago</p>
                                </div>
                            </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="space-y-4 animate-slide-up">
                        <div className="bg-theme-card p-5 rounded-xl border border-theme-border">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-theme-text text-sm">Review on <span className="text-indigo-600">HubSpot Campaign Optimizer</span></div>
                                <div className="flex text-yellow-400">
                                    <Star className="w-3 h-3 fill-current"/>
                                    <Star className="w-3 h-3 fill-current"/>
                                    <Star className="w-3 h-3 fill-current"/>
                                    <Star className="w-3 h-3 fill-current"/>
                                    <Star className="w-3 h-3 fill-current"/>
                                </div>
                            </div>
                            <p className="text-sm text-theme-text-sec leading-relaxed">"Great tool, saved us tons of time on automation. Highly recommend for any marketing team using HubSpot."</p>
                            <p className="text-xs text-theme-text-sec mt-2">1 week ago</p>
                        </div>
                         <div className="text-center py-8 text-theme-text-sec bg-theme-card rounded-xl border border-dashed border-theme-border text-sm">
                            No more reviews to show.
                        </div>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
