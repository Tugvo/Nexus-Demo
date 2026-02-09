
import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useCurrency } from '../context/CurrencyContext';
import { Download, Clock, CheckCircle, AlertOctagon, FileText, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import PriceDisplay from '../components/PriceDisplay';
import InvoiceModal from '../components/InvoiceModal';

const Orders: React.FC = () => {
  const { orders, downloadAgent } = useMarketplace();
  const { formatPrice } = useCurrency();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleDownload = (agentId: string) => {
      downloadAgent(agentId);
  };

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <div className="min-h-screen bg-theme-bg-sec py-12 transition-colors duration-300">
      
      {selectedOrder && (
          <InvoiceModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrderId(null)} 
          />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-theme-text mb-2">Order History</h1>
        <p className="text-theme-text-sec mb-8">Manage your invoices and purchased licenses.</p>

        {orders.length === 0 ? (
           <div className="text-center py-20 bg-theme-card rounded-xl border border-dashed border-theme-border">
                <h3 className="text-lg font-medium text-theme-text">No orders found</h3>
                <p className="text-theme-text-sec mt-1">You haven't purchased any agents yet.</p>
                <Link to="/marketplace" className="mt-4 inline-block text-indigo-600 font-medium hover:underline">Browse Marketplace</Link>
            </div>
        ) : (
            <div className="bg-theme-card rounded-xl shadow-sm border border-theme-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-theme-border">
                        <thead className="bg-theme-bg-sec">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Agent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-theme-text-sec uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-theme-text-sec uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-theme-border">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-theme-bg-sec transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-theme-text-sec">
                                        #{order.id.split('_')[1]?.substring(0,8) || order.id.substring(0,8)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-theme-text">
                                        <Link to={`/agent/${order.agentId}`} className="hover:text-indigo-600">
                                            {order.agentName}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-text-sec">
                                        {new Date(order.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-text font-bold">
                                        <PriceDisplay amount={order.amount} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                            order.status === 'po_generated' ? 'bg-blue-100 text-blue-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {order.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1"/>}
                                            {order.status === 'pending' && <Clock className="w-3 h-3 mr-1"/>}
                                            {order.status === 'po_generated' && <FileCheck className="w-3 h-3 mr-1"/>}
                                            {order.status === 'failed' && <AlertOctagon className="w-3 h-3 mr-1"/>}
                                            {order.status === 'po_generated' ? 'PO Generated' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {order.status === 'completed' && (
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => setSelectedOrderId(order.id)}
                                                    className="text-gray-500 hover:text-gray-900 p-1" 
                                                    title="View Invoice"
                                                >
                                                    <FileText className="w-4 h-4"/>
                                                </button>
                                                <button 
                                                    onClick={() => handleDownload(order.agentId)} 
                                                    className="text-indigo-600 hover:text-indigo-900 flex items-center"
                                                >
                                                    <Download className="w-4 h-4 mr-1"/> Download
                                                </button>
                                            </div>
                                        )}
                                        {(order.status === 'pending' || order.status === 'po_generated') && (
                                            <button 
                                                onClick={() => setSelectedOrderId(order.id)}
                                                className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end w-full"
                                            >
                                                {order.status === 'po_generated' ? 'Download PO' : 'Generate PO'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
