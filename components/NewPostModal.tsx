
import React, { useState, useRef } from 'react';
import { X, Send, Tag, Paperclip, MessageSquare, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useCommunity } from '../context/CommunityContext';
import { useNavigate } from 'react-router-dom';
import { MOCK_AGENTS } from '../data';

interface NewPostModalProps {
  onClose: () => void;
  initialAgentId?: string;
  initialCategory?: string;
}

const NewPostModal: React.FC<NewPostModalProps> = ({ onClose, initialAgentId, initialCategory }) => {
  const navigate = useNavigate();
  const { createPost } = useCommunity();
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
      title: '',
      category: initialCategory || '', 
      relatedAgentId: initialAgentId || '',
      content: '',
      tags: ''
  });
  
  const [attachments, setAttachments] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          
          // Validation: 50MB
          if (file.size > 50 * 1024 * 1024) {
              alert("File too large. Maximum size is 50MB.");
              return;
          }

          // Create Object URL for preview
          const url = URL.createObjectURL(file);
          setAttachments(prev => [...prev, url]);
      }
  };

  const removeAttachment = (index: number) => {
      setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!formData.category) {
          alert("Please select a category.");
          return;
      }

      setLoading(true);
      
      setTimeout(() => {
          const newPostId = createPost({
              title: formData.title,
              category: formData.category as any,
              relatedAgentId: formData.relatedAgentId || undefined,
              content: formData.content,
              tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
              attachments: attachments
          });
          
          setLoading(false);
          onClose();
          
          if (newPostId) {
              navigate(`/community/thread/${newPostId}`);
          } else {
              window.location.reload(); 
          }
      }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative bg-theme-card rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-in border border-theme-border flex flex-col max-h-[90vh]">
         <div className="px-6 py-4 border-b border-theme-border flex justify-between items-center bg-theme-bg-sec">
             <h3 className="font-bold text-theme-text text-lg flex items-center gap-2">
                 <MessageSquare className="w-5 h-5 text-indigo-600"/> Start a Discussion
             </h3>
             <button onClick={onClose} className="text-theme-text-sec hover:text-theme-text"><X className="w-5 h-5"/></button>
         </div>

         <div className="p-6 overflow-y-auto">
             <form onSubmit={handleSubmit} className="space-y-4">
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                         <label className="block text-xs font-medium text-theme-text mb-1">Title <span className="text-red-500">*</span></label>
                         <input 
                            required
                            type="text" 
                            className="w-full px-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g. How to configure OAuth?"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                         />
                     </div>
                     <div>
                         <label className="block text-xs font-medium text-theme-text mb-1">Category <span className="text-red-500">*</span></label>
                         <select 
                            required
                            className="w-full px-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                         >
                             <option value="" disabled>-- Select Category --</option>
                             <option value="Bug">Bug Report</option>
                             <option value="Feature Request">Feature Request</option>
                             <option value="Integration Help">Integration Help</option>
                             <option value="Pricing">Pricing Question</option>
                             <option value="Best Practices">Best Practices</option>
                             <option value="Security">Security</option>
                             <option value="Performance">Performance</option>
                             <option value="General">General</option>
                         </select>
                     </div>
                 </div>

                 <div>
                     <label className="block text-xs font-medium text-theme-text mb-1">Related Agent (Optional)</label>
                     <select 
                        className="w-full px-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.relatedAgentId}
                        onChange={e => setFormData({...formData, relatedAgentId: e.target.value})}
                     >
                         <option value="">-- Select an Agent --</option>
                         {MOCK_AGENTS.map(agent => (
                             <option key={agent.id} value={agent.id}>{agent.name}</option>
                         ))}
                     </select>
                 </div>

                 <div>
                     <label className="block text-xs font-medium text-theme-text mb-1">Content <span className="text-red-500">*</span></label>
                     <textarea 
                        required
                        rows={6}
                        className="w-full px-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-sans"
                        placeholder="Describe your issue or idea..."
                        value={formData.content}
                        onChange={e => setFormData({...formData, content: e.target.value})}
                     ></textarea>
                 </div>

                 {/* Attachments Preview */}
                 {attachments.length > 0 && (
                     <div className="flex gap-2 overflow-x-auto py-2">
                         {attachments.map((url, idx) => (
                             <div key={idx} className="relative group flex-shrink-0">
                                 <img src={url} alt="preview" className="h-20 w-20 object-cover rounded-lg border border-theme-border" />
                                 <button
                                    type="button" 
                                    onClick={() => removeAttachment(idx)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                 >
                                     <Trash2 className="w-3 h-3" />
                                 </button>
                             </div>
                         ))}
                     </div>
                 )}

                 <div>
                     <label className="block text-xs font-medium text-theme-text mb-1">Tags (Comma separated)</label>
                     <div className="relative">
                         <Tag className="w-4 h-4 text-theme-text-sec absolute left-3 top-2.5" />
                         <input 
                            type="text" 
                            className="w-full pl-9 pr-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="salesforce, api, python"
                            value={formData.tags}
                            onChange={e => setFormData({...formData, tags: e.target.value})}
                         />
                     </div>
                 </div>

                 <div className="flex justify-between items-center pt-4 border-t border-theme-border">
                     <div>
                         <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleFileSelect}
                         />
                         <button 
                            type="button" 
                            onClick={() => fileInputRef.current?.click()}
                            className="text-theme-text-sec hover:text-theme-text flex items-center text-sm transition-colors"
                         >
                             <Paperclip className="w-4 h-4 mr-1"/> Attach files (Max 50MB)
                         </button>
                     </div>
                     <div className="flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-theme-text-sec hover:text-theme-text font-medium text-sm transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 disabled:opacity-70 transition-colors"
                        >
                            {loading ? 'Publishing...' : <><Send className="w-4 h-4 mr-2"/> Publish Post</>}
                        </button>
                     </div>
                 </div>
             </form>
         </div>
      </div>
    </div>
  );
};

export default NewPostModal;
