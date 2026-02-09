
import React, { useState } from 'react';
import { X, CheckCircle, UploadCloud, Rocket } from 'lucide-react';

interface BecomeBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BecomeBuilderModal: React.FC<BecomeBuilderModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [role, setRole] = useState('independent');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in">
        
        {success ? (
            <div className="p-12 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted</h2>
                <p className="text-gray-600 mb-8">
                    Your request to become a builder is pending review. We will notify you via email within 24 hours.
                </p>
                <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">
                    Got it
                </button>
            </div>
        ) : (
            <>
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-indigo-50/50">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <UploadCloud className="w-5 h-5 text-indigo-600"/> Become a Builder
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5"/></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-gray-600 mb-2">
                        Start selling your AI agents on NexusAI. Tell us a bit about yourself.
                    </p>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Builder Role</label>
                        <select 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                            value={role}
                            onChange={e => setRole(e.target.value)}
                        >
                            <option value="independent">Independent Creator</option>
                            <option value="startup">Startup Team</option>
                            <option value="enterprise">Enterprise Partner</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Company / Organization (Optional)</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" placeholder="e.g. Acme AI" />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Portfolio / Website</label>
                        <input type="url" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" placeholder="https://..." required />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Short Bio</label>
                        <textarea className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" rows={3} placeholder="What kind of agents do you build?" required></textarea>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-70 flex justify-center items-center"
                        >
                            {loading ? 'Submitting...' : <><Rocket className="w-4 h-4 mr-2" /> Submit Application</>}
                        </button>
                    </div>
                </form>
            </>
        )}
      </div>
    </div>
  );
};

export default BecomeBuilderModal;
