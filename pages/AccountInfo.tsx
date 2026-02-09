
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Phone, Calendar, Edit2, Save, X, Briefcase, GraduationCap, Building2, Building, Code2, Link as LinkIcon, Users } from 'lucide-react';

export default function AccountInfo() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(user || {});

  if (!user) return <div className="p-8">Please login to view this page.</div>;

  const handleSave = () => {
      // Simulate API call
      setIsEditing(false);
      // In real app, call updateUser(formData) context method
      // For demo, we just toggle state back
      alert("Profile updated successfully!");
  };

  const handleChange = (field: string, value: string | string[]) => {
      setFormData({ ...formData, [field]: value });
  };

  const renderPersonaFields = () => {
      switch (user.persona) {
          case 'Student':
              return (
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">University / Institution</label>
                          <div className="flex items-center gap-2 text-gray-900 mt-1">
                              <GraduationCap className="w-4 h-4 text-gray-400" />
                              {isEditing ? (
                                  <input className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 bg-transparent" placeholder="University Name" value={formData.university || ''} onChange={e => handleChange('university', e.target.value)} />
                              ) : (
                                  user.university || 'N/A'
                              )}
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Major / Focus</label>
                          <div className="flex items-center gap-2 text-gray-900 mt-1">
                              <Briefcase className="w-4 h-4 text-gray-400" />
                              {isEditing ? (
                                  <input className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 bg-transparent" placeholder="Computer Science" value={formData.major || ''} onChange={e => handleChange('major', e.target.value)} />
                              ) : (
                                  user.major || 'N/A'
                              )}
                          </div>
                      </div>
                  </div>
              );
          case 'Professional':
              return (
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Job Title</label>
                          <div className="flex items-center gap-2 text-gray-900 mt-1">
                              <Briefcase className="w-4 h-4 text-gray-400" />
                              {isEditing ? (
                                  <input className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 bg-transparent" placeholder="Senior Developer" value={formData.jobTitle || ''} onChange={e => handleChange('jobTitle', e.target.value)} />
                              ) : (
                                  user.jobTitle || 'N/A'
                              )}
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Industry</label>
                          <div className="flex items-center gap-2 text-gray-900 mt-1">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              {isEditing ? (
                                  <input className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 bg-transparent" placeholder="FinTech" value={formData.industry || ''} onChange={e => handleChange('industry', e.target.value)} />
                              ) : (
                                  user.industry || 'N/A'
                              )}
                          </div>
                      </div>
                  </div>
              );
          case 'Business':
              return (
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Company Name</label>
                          <div className="flex items-center gap-2 text-gray-900 mt-1">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              {isEditing ? (
                                  <input className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 bg-transparent" placeholder="Acme Inc." value={formData.companyName || ''} onChange={e => handleChange('companyName', e.target.value)} />
                              ) : (
                                  user.companyName || 'N/A'
                              )}
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Team Size</label>
                          <div className="flex items-center gap-2 text-gray-900 mt-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              {isEditing ? (
                                  <select className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 bg-transparent" value={formData.teamSize || ''} onChange={e => handleChange('teamSize', e.target.value)}>
                                      <option value="1-10">1-10 Employees</option>
                                      <option value="11-50">11-50 Employees</option>
                                      <option value="50+">50+ Employees</option>
                                  </select>
                              ) : (
                                  user.teamSize || 'N/A'
                              )}
                          </div>
                      </div>
                  </div>
              );
          case 'Enterprise':
              return (
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Organization</label>
                          <div className="flex items-center gap-2 text-gray-900 mt-1">
                              <Building className="w-4 h-4 text-gray-400" />
                              {isEditing ? (
                                  <input className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 bg-transparent" placeholder="Global Corp" value={formData.companyName || ''} onChange={e => handleChange('companyName', e.target.value)} />
                              ) : (
                                  user.companyName || 'N/A'
                              )}
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Department</label>
                          <div className="flex items-center gap-2 text-gray-900 mt-1">
                              <Users className="w-4 h-4 text-gray-400" />
                              {isEditing ? (
                                  <input className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 bg-transparent" placeholder="IT / Engineering" value={formData.department || ''} onChange={e => handleChange('department', e.target.value)} />
                              ) : (
                                  user.department || 'N/A'
                              )}
                          </div>
                      </div>
                  </div>
              );
          case 'Creator':
              return (
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Portfolio / Website</label>
                          <div className="flex items-center gap-2 text-gray-900 mt-1">
                              <LinkIcon className="w-4 h-4 text-gray-400" />
                              {isEditing ? (
                                  <input className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 bg-transparent" placeholder="https://..." value={formData.website || ''} onChange={e => handleChange('website', e.target.value)} />
                              ) : (
                                  user.website ? <a href={user.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{user.website}</a> : 'N/A'
                              )}
                          </div>
                      </div>
                      <div>
                          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Primary Skills</label>
                          <div className="flex items-center gap-2 text-gray-900 mt-1">
                              <Code2 className="w-4 h-4 text-gray-400" />
                              {isEditing ? (
                                  <input className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 bg-transparent" placeholder="Python, React, AI" value={formData.expertise?.join(', ') || ''} onChange={e => handleChange('expertise', e.target.value.split(','))} />
                              ) : (
                                  user.expertise?.join(', ') || 'N/A'
                              )}
                          </div>
                      </div>
                  </div>
              );
          default:
              return null;
      }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Account Information</h1>
            {isEditing ? (
                <div className="flex gap-2">
                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 flex items-center">
                        <X className="w-4 h-4 mr-2" /> Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center">
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                    </button>
                </div>
            ) : (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 flex items-center">
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                </button>
            )}
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header / Banner */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
                <div className="absolute -bottom-10 left-8">
                    <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-lg relative group cursor-pointer">
                        <img 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                          alt="" 
                          className="w-full h-full object-cover rounded-xl"
                        />
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                Change
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-14 px-8 pb-8">
                <div className="mb-6">
                    {isEditing ? (
                        <input 
                            type="text" 
                            className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-indigo-500 outline-none w-full bg-transparent"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                        />
                    ) : (
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            {user.name} 
                            {user.verified && <ShieldCheck className="w-5 h-5 text-blue-500" />}
                        </h2>
                    )}
                    
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {user.persona || user.role}
                        </span>
                        {user.type && <span className="text-xs text-gray-500">({user.type.replace('_', ' ')})</span>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                            <div className="flex items-center gap-2 text-gray-900 mt-1">
                                <Mail className="w-4 h-4 text-gray-400" />
                                {isEditing ? (
                                    <input className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 bg-transparent" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                                ) : (
                                    user.email || 'No email provided'
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</label>
                            <div className="flex items-center gap-2 text-gray-900 mt-1">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {isEditing ? (
                                    <input className="border-b border-gray-300 focus:border-indigo-500 outline-none flex-1 bg-transparent" value={formData.phone || ''} placeholder="+1..." onChange={e => handleChange('phone', e.target.value)} />
                                ) : (
                                    user.phone || 'No phone provided'
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Member Since</label>
                            <div className="flex items-center gap-2 text-gray-900 mt-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {user.joinedDate || 'Oct 2023'}
                            </div>
                        </div>
                    </div>
                    
                    {/* Persona Specific Fields */}
                    {renderPersonaFields()}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Bio</label>
                    {isEditing ? (
                        <textarea 
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-transparent" 
                            rows={3} 
                            value={formData.bio || ''} 
                            onChange={e => handleChange('bio', e.target.value)}
                        ></textarea>
                    ) : (
                        <p className="text-gray-600 text-sm leading-relaxed">{user.bio || 'No bio provided.'}</p>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}
