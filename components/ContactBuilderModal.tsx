
import React, { useState } from 'react';
import { X, Send, User, Building, Mail, MessageSquare } from 'lucide-react';
import { useCommunication } from '../context/CommunicationContext';
import { useNavigate } from 'react-router-dom';

interface ContactBuilderModalProps {
  builderId: string;
  builderName: string;
  builderAvatar: string;
  agentId?: string; // Optional context
  agentName?: string;
  onClose: () => void;
}

const ContactBuilderModal: React.FC<ContactBuilderModalProps> = ({ 
    builderId, builderName, builderAvatar, agentId, agentName, onClose 
}) => {
  const navigate = useNavigate();
  const { createThread } = useCommunication();
  const [formData, setFormData] = useState({
      name: '',
      company: '',
      email: '',
      subject: agentName ? `Inquiry regarding ${agentName}` : 'General Inquiry',
      message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      
      // Simulate network delay
      setTimeout(() => {
          createThread(
              builderId, 
              builderName, 
              builderAvatar,
              formData.subject,
              formData.message,
              agentId
          );
          setLoading(false);
          onClose();
          navigate('/chat');
      }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-theme-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in border border-theme-border flex flex-col max-h-[90vh]">
         
         <div className="px-6 py-4 border-b border-theme-border flex justify-between items-center bg-theme-bg-sec">
             <div>
                 <h3 className="font-bold text-theme-text text-lg">Contact {builderName}</h3>
                 {agentName && <p className="text-xs text-theme-text-sec">Re: {agentName}</p>}
             </div>
             <button onClick={onClose} className="text-theme-text-sec hover:text-theme-text"><X className="w-5 h-5"/></button>
         </div>

         <div className="p-6 overflow-y-auto">
             <form onSubmit={handleSubmit} className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                         <label className="block text-xs font-medium text-theme-text mb-1">Your Name</label>
                         <div className="relative">
                             <User className="w-4 h-4 text-theme-text-sec absolute left-3 top-2.5" />
                             <input 
                                required
                                type="text" 
                                className="w-full pl-9 pr-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                             />
                         </div>
                     </div>
                     <div>
                         <label className="block text-xs font-medium text-theme-text mb-1">Company (Optional)</label>
                         <div className="relative">
                             <Building className="w-4 h-4 text-theme-text-sec absolute left-3 top-2.5" />
                             <input 
                                type="text" 
                                className="w-full pl-9 pr-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.company}
                                onChange={e => setFormData({...formData, company: e.target.value})}
                             />
                         </div>
                     </div>
                 </div>

                 <div>
                     <label className="block text-xs font-medium text-theme-text mb-1">Email Address</label>
                     <div className="relative">
                         <Mail className="w-4 h-4 text-theme-text-sec absolute left-3 top-2.5" />
                         <input 
                            required
                            type="email" 
                            className="w-full pl-9 pr-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                         />
                     </div>
                 </div>

                 <div>
                     <label className="block text-xs font-medium text-theme-text mb-1">Subject</label>
                     <select 
                        className="w-full px-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                     >
                         <option>Integration Help</option>
                         <option>Pricing / Enterprise Inquiry</option>
                         <option>Custom Feature Request</option>
                         <option>Partnership</option>
                         <option>Other</option>
                     </select>
                 </div>

                 <div>
                     <label className="block text-xs font-medium text-theme-text mb-1">Message</label>
                     <div className="relative">
                         <MessageSquare className="w-4 h-4 text-theme-text-sec absolute left-3 top-3" />
                         <textarea 
                            required
                            rows={4}
                            className="w-full pl-9 pr-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            placeholder="How can we help you?"
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                         ></textarea>
                     </div>
                 </div>

                 <div className="flex justify-end gap-3 pt-2">
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
                         {loading ? 'Sending...' : <><Send className="w-4 h-4 mr-2"/> Send Message</>}
                     </button>
                 </div>
             </form>
         </div>
      </div>
    </div>
  );
};

export default ContactBuilderModal;
