
import React, { useState } from 'react';
import { X, Building, Mail, MapPin, Hash, FileText, CheckCircle, Download, Loader2, CreditCard } from 'lucide-react';
import { Order, BillingDetails } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import PriceDisplay from './PriceDisplay';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const { generatePO } = useMarketplace();
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [details, setDetails] = useState<BillingDetails>({
      companyName: '',
      billingEmail: '',
      billingAddress: '',
      taxId: '',
      poRef: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setStep('processing');
      try {
          await generatePO(order.id, details);
          setStep('success');
      } catch (err) {
          console.error(err);
          setStep('form');
          alert('Failed to generate PO. Please try again.');
      }
  };

  // Mock PDF Download
  const handleDownloadPDF = () => {
      const content = `
          PURCHASE ORDER
          --------------
          Date: ${new Date().toLocaleDateString()}
          PO Ref: ${details.poRef || 'N/A'}
          Order ID: ${order.id}
          
          BUYER:
          ${details.companyName}
          ${details.billingAddress}
          Tax ID: ${details.taxId || 'N/A'}
          Email: ${details.billingEmail}

          ITEM:
          Agent: ${order.agentName}
          Price: ${order.amount} ${order.currency}
          
          STATUS: PO Generated / Pending Payment
          
          NexusAI Inc.
          100 Pine St, San Francisco, CA
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PO-${order.id}.txt`; // Using .txt for demo simplicity, functionally identical
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-theme-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in border border-theme-border flex flex-col max-h-[90vh]">
         
         {/* Header */}
         <div className="px-6 py-4 border-b border-theme-border flex justify-between items-center bg-theme-bg-sec">
             <div>
                 <h3 className="font-bold text-theme-text text-lg flex items-center gap-2">
                     <FileText className="w-5 h-5 text-indigo-600"/> 
                     {step === 'success' ? 'Purchase Order Generated' : 'Generate Invoice / PO'}
                 </h3>
                 <p className="text-xs text-theme-text-sec mt-0.5">Order #{order.id.split('_')[1] || order.id}</p>
             </div>
             <button onClick={onClose} className="text-theme-text-sec hover:text-theme-text"><X className="w-5 h-5"/></button>
         </div>

         <div className="p-6 overflow-y-auto">
             
             {step === 'processing' && (
                 <div className="text-center py-12">
                     <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                     <h4 className="font-bold text-theme-text">Generating Document...</h4>
                     <p className="text-theme-text-sec text-sm mt-2">Applying branding and tax calculations</p>
                 </div>
             )}

             {step === 'success' && (
                 <div className="text-center py-4">
                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                        <CheckCircle className="w-8 h-8" />
                     </div>
                     <h2 className="text-xl font-bold text-theme-text mb-2">PO Ready for Download</h2>
                     <p className="text-theme-text-sec text-sm mb-8 max-w-xs mx-auto">
                         A copy has also been sent to <strong>{details.billingEmail}</strong>.
                     </p>
                     
                     <div className="bg-theme-bg-sec p-4 rounded-xl border border-theme-border text-left mb-8">
                         <div className="flex justify-between items-center mb-2">
                             <span className="text-sm font-medium text-theme-text-sec">Total Amount</span>
                             <span className="text-lg font-bold text-theme-text"><PriceDisplay amount={order.amount}/></span>
                         </div>
                         <div className="flex justify-between items-center">
                             <span className="text-sm font-medium text-theme-text-sec">PO Reference</span>
                             <span className="text-sm font-mono text-theme-text">{details.poRef || 'N/A'}</span>
                         </div>
                     </div>

                     <button 
                        onClick={handleDownloadPDF}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
                     >
                         <Download className="w-4 h-4" /> Download PDF
                     </button>
                 </div>
             )}

             {step === 'form' && (
                 <form onSubmit={handleSubmit} className="space-y-4">
                     
                     <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex gap-3 mb-4">
                         <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0" />
                         <p className="text-xs text-blue-700 leading-relaxed">
                             Please provide billing details to generate a qualified Purchase Order. Access will be granted once payment is cleared against this PO.
                         </p>
                     </div>

                     <div>
                         <label className="block text-xs font-medium text-theme-text mb-1">Company Legal Name <span className="text-red-500">*</span></label>
                         <div className="relative">
                             <Building className="w-4 h-4 text-theme-text-sec absolute left-3 top-2.5" />
                             <input 
                                required
                                type="text" 
                                className="w-full pl-9 pr-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Acme Corp Inc."
                                value={details.companyName}
                                onChange={e => setDetails({...details, companyName: e.target.value})}
                             />
                         </div>
                     </div>

                     <div>
                         <label className="block text-xs font-medium text-theme-text mb-1">Billing Email <span className="text-red-500">*</span></label>
                         <div className="relative">
                             <Mail className="w-4 h-4 text-theme-text-sec absolute left-3 top-2.5" />
                             <input 
                                required
                                type="email" 
                                className="w-full pl-9 pr-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="finance@acme.com"
                                value={details.billingEmail}
                                onChange={e => setDetails({...details, billingEmail: e.target.value})}
                             />
                         </div>
                     </div>

                     <div>
                         <label className="block text-xs font-medium text-theme-text mb-1">Billing Address <span className="text-red-500">*</span></label>
                         <div className="relative">
                             <MapPin className="w-4 h-4 text-theme-text-sec absolute left-3 top-2.5" />
                             <input 
                                required
                                type="text" 
                                className="w-full pl-9 pr-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="123 Innovation Dr, Tech City"
                                value={details.billingAddress}
                                onChange={e => setDetails({...details, billingAddress: e.target.value})}
                             />
                         </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                         <div>
                             <label className="block text-xs font-medium text-theme-text mb-1">GST / VAT ID (Optional)</label>
                             <input 
                                type="text" 
                                className="w-full px-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="XX-XXXXXXX"
                                value={details.taxId}
                                onChange={e => setDetails({...details, taxId: e.target.value})}
                             />
                         </div>
                         <div>
                             <label className="block text-xs font-medium text-theme-text mb-1">PO Reference (Optional)</label>
                             <div className="relative">
                                 <Hash className="w-4 h-4 text-theme-text-sec absolute left-3 top-2.5" />
                                 <input 
                                    type="text" 
                                    className="w-full pl-9 pr-3 py-2 bg-theme-bg-sec border border-theme-border rounded-lg text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="PO-2024-001"
                                    value={details.poRef}
                                    onChange={e => setDetails({...details, poRef: e.target.value})}
                                 />
                             </div>
                         </div>
                     </div>

                     <div className="flex justify-end gap-3 pt-4 border-t border-theme-border">
                         <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-theme-text-sec hover:text-theme-text font-medium text-sm transition-colors"
                         >
                             Cancel
                         </button>
                         <button 
                            type="submit"
                            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors shadow-sm"
                         >
                             Generate PO
                         </button>
                     </div>
                 </form>
             )}
         </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
