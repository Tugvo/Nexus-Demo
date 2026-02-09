import React, { useState } from 'react';
import { 
  UploadCloud, FileText, CheckCircle, 
  AlertCircle, ArrowRight, Box, Zap, 
  Database, Shield 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AgentStudio: React.FC = () => {
  const [step, setStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Mock file handling
      setStep(3);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
           <h1 className="text-3xl font-bold text-gray-900">Publish to Ecosystem</h1>
           <p className="mt-2 text-gray-600">
             Upload your verified agent package. We handle the distribution, versioning, and trust scoring.
           </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-12">
            {[
                { id: 1, label: 'Platform Source' },
                { id: 2, label: 'Metadata' },
                { id: 3, label: 'Upload Package' },
                { id: 4, label: 'Review' }
            ].map((s, idx) => (
                <div key={s.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold transition-colors ${step >= s.id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                        {step > s.id ? <CheckCircle className="w-6 h-6" /> : s.id}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${step >= s.id ? 'text-indigo-900' : 'text-gray-400'}`}>{s.label}</span>
                    {idx < 3 && <div className={`w-12 h-1 mx-4 ${step > s.id ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>}
                </div>
            ))}
        </div>

        {/* Step 1: Platform Selection */}
        {step === 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Where was this agent built?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Kore.ai', 'Zapier', 'Make.com', 'LangChain (Custom)', 'Microsoft Copilot', 'Other'].map((platform) => (
                        <button
                            key={platform}
                            onClick={() => setSelectedPlatform(platform)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${selectedPlatform === platform ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}
                        >
                            <span className="font-bold text-gray-900 block">{platform}</span>
                            <span className="text-sm text-gray-500">Standard export package supported</span>
                        </button>
                    ))}
                </div>
                <div className="mt-8 flex justify-end">
                    <button 
                        disabled={!selectedPlatform}
                        onClick={() => setStep(2)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        Next Step <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        )}

        {/* Step 2: Metadata (Mock) */}
        {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Agent Details</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500" placeholder="e.g. SalesFlow Pro" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Short Tagline</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500" placeholder="One sentence value prop" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Systems Integrated (Logos)</label>
                        <input type="text" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500" placeholder="Comma separated (e.g. HubSpot, Slack)" />
                    </div>
                </div>
                <div className="mt-8 flex justify-between">
                    <button onClick={() => setStep(1)} className="text-gray-600 font-medium px-4 py-2">Back</button>
                    <button onClick={() => setStep(3)} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 flex items-center">
                        Next Step <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        )}

        {/* Step 3: Upload */}
        {step === 3 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Upload Package</h2>
                
                <div 
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UploadCloud className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium text-gray-900">Drag & drop your agent package</p>
                    <p className="text-sm text-gray-500 mt-2">Supports .zip, .json (Kore.ai), or .tar.gz</p>
                    <button className="mt-6 text-indigo-600 font-medium hover:underline">Browse files</button>
                </div>

                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                        <strong>Quality Check:</strong> Your upload will be automatically scanned for security vulnerabilities and code quality to generate your initial Trust Score.
                    </p>
                </div>

                <div className="mt-8 flex justify-between">
                    <button onClick={() => setStep(2)} className="text-gray-600 font-medium px-4 py-2">Back</button>
                    {/* Mock Upload Completion */}
                    <button onClick={() => setStep(4)} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 flex items-center">
                        Start Upload <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        )}

        {/* Step 4: Success/Review */}
        {step === 4 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center animate-fade-in">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h2>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                    Your agent <strong>SalesFlow Pro</strong> is now being processed. The automated trust scan usually takes 5-10 minutes. You will be notified once the listing is live.
                </p>
                
                <div className="bg-slate-50 rounded-xl p-6 max-w-sm mx-auto mb-8 text-left border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center"><Shield className="w-4 h-4 mr-2"/> Estimated Trust Score</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Code Quality</span>
                            <span className="font-bold text-green-600">92/100</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Manifest Check</span>
                            <span className="font-bold text-green-600">Pass</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                            <div className="h-full bg-green-500 w-[92%]"></div>
                        </div>
                    </div>
                </div>

                <Link to="/dashboard" className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Return to Dashboard
                </Link>
            </div>
        )}

      </div>
    </div>
  );
};

export default AgentStudio;
