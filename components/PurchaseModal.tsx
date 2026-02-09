
import React, { useState } from 'react';
import { X, CreditCard, FileText, Lock, ShieldCheck, Loader2, CheckCircle, Download, Book, Terminal, ShoppingBag } from 'lucide-react';
import { Agent, Order } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { useCurrency } from '../context/CurrencyContext';
import PriceDisplay from './PriceDisplay';
import { useNavigate } from 'react-router-dom';

interface PurchaseModalProps {
  agent: Agent;
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ agent, onClose }) => {
  const { createOrder, downloadAgent } = useMarketplace();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [method, setMethod] = useState<'card' | 'invoice'>('card');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'processing' | 'success'>('select');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const handlePurchase = async () => {
    setLoading(true);
    setStep('processing');
    try {
        const order = await createOrder(agent, method);
        setCompletedOrder(order);
        setStep('success');
    } catch (error) {
        console.error("Purchase failed", error);
        setStep('select'); // Reset on error
    } finally {
        setLoading(false);
    }
  };

  const handleDownload = () => {
      if (agent.id) {
          downloadAgent(agent.id);
      }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-theme-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-in border border-theme-border">
         
         {/* Header */}
         <div className="px-6 py-4 border-b border-theme-border flex justify-between items-center bg-theme-bg-sec">
             <h3 className="font-bold text-theme-text flex items-center gap-2">
                {step === 'success' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <ShieldCheck className="w-5 h-5 text-green-500" />}
                {step === 'success' ? 'Order Confirmed' : 'Secure Checkout'}
             </h3>
             <button onClick={onClose} className="text-theme-text-sec hover:text-theme-text"><X className="w-5 h-5"/></button>
         </div>

         {/* Content */}
         <div className="p-6">
            {step === 'select' && (
                <>
                    <div className="flex gap-4 mb-6">
                        <img src={agent.imageUrl || `https://ui-avatars.com/api/?name=${agent.name}&background=6366f1&color=fff`} className="w-16 h-16 rounded-lg object-cover bg-indigo-100" alt="" />
                        <div>
                            <h4 className="font-bold text-theme-text text-lg">{agent.name}</h4>
                            <p className="text-theme-text-sec text-sm">v{agent.versions[0].version} • Enterprise License</p>
                            <p className="text-indigo-600 font-bold mt-1 text-xl">
                                <PriceDisplay amount={agent.price} />
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <label 
                            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${method === 'card' ? 'border-indigo-600 bg-indigo-50/10 ring-1 ring-indigo-600' : 'border-theme-border hover:border-indigo-400'}`}
                            onClick={() => setMethod('card')}
                        >
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${method === 'card' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}>
                                {method === 'card' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <CreditCard className="w-5 h-5 text-theme-text mr-3" />
                            <div className="flex-1">
                                <p className="font-bold text-theme-text text-sm">Credit / Debit Card</p>
                                <p className="text-xs text-theme-text-sec">Instant access. Encrypted by Stripe.</p>
                            </div>
                        </label>

                        <label 
                            className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${method === 'invoice' ? 'border-indigo-600 bg-indigo-50/10 ring-1 ring-indigo-600' : 'border-theme-border hover:border-indigo-400'}`}
                            onClick={() => setMethod('invoice')}
                        >
                             <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${method === 'invoice' ? 'border-indigo-600 bg-indigo-600' : 'border-gray-400'}`}>
                                {method === 'invoice' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <FileText className="w-5 h-5 text-theme-text mr-3" />
                            <div className="flex-1">
                                <p className="font-bold text-theme-text text-sm">Purchase Order / Invoice</p>
                                <p className="text-xs text-theme-text-sec">Net-30 terms. Requires admin approval.</p>
                            </div>
                        </label>
                    </div>

                    <div className="bg-blue-50/50 p-3 rounded-lg flex gap-3 border border-blue-100/50 mb-6">
                        <Lock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-700">
                            <strong>100% Secure.</strong> NexusAI holds funds in escrow until the file integrity check is verified.
                        </p>
                    </div>

                    <button 
                        onClick={handlePurchase}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-1"
                    >
                        Pay <PriceDisplay amount={agent.price} />
                    </button>
                </>
            )}

            {step === 'processing' && (
                <div className="text-center py-10">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <h4 className="font-bold text-theme-text text-lg">Processing Transaction...</h4>
                    <p className="text-theme-text-sec text-sm mt-2">Please do not close this window.</p>
                </div>
            )}

            {step === 'success' && completedOrder && (
                <div className="text-center">
                     <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-theme-text text-xl mb-1">
                        {method === 'card' ? 'Payment Successful!' : 'Order Placed!'}
                    </h4>
                    <p className="text-theme-text-sec text-xs mb-6 font-mono">
                        Order ID: #{completedOrder.id.split('_')[1] || completedOrder.id}
                    </p>

                    <div className="bg-theme-bg-sec rounded-xl p-4 mb-6 border border-theme-border flex items-center gap-4 text-left">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-bold shrink-0">
                            {agent.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-bold text-theme-text text-sm">{agent.name}</p>
                            <p className="text-xs text-theme-text-sec">
                                <PriceDisplay amount={completedOrder.amount} /> • License Active
                            </p>
                        </div>
                    </div>

                    {method === 'card' ? (
                        <div className="space-y-3">
                            <button 
                                onClick={handleDownload}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
                            >
                                <Download className="w-4 h-4" /> Download Agent
                            </button>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <button className="flex items-center justify-center gap-2 py-2.5 border border-theme-border rounded-lg text-sm font-medium text-theme-text hover:bg-theme-bg-sec transition-colors">
                                    <Book className="w-4 h-4" /> Installation Guide
                                </button>
                                <button className="flex items-center justify-center gap-2 py-2.5 border border-theme-border rounded-lg text-sm font-medium text-theme-text hover:bg-theme-bg-sec transition-colors">
                                    <Terminal className="w-4 h-4" /> API Reference
                                </button>
                            </div>

                            <button 
                                onClick={() => { onClose(); navigate('/profile/orders'); }}
                                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-theme-text-sec hover:text-indigo-600 transition-colors"
                            >
                                <ShoppingBag className="w-4 h-4" /> View My Purchases
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p className="text-theme-text-sec text-sm mb-6">
                                Your invoice has been sent to your email. Access will be enabled once payment is received.
                            </p>
                            <button 
                                onClick={() => { onClose(); navigate('/profile/orders'); }}
                                className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
                            >
                                View Order Status
                            </button>
                        </div>
                    )}
                </div>
            )}
         </div>

      </div>
    </div>
  );
};

export default PurchaseModal;
