
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Agent, Order, User, BillingDetails } from '../types';
import { MOCK_AGENTS } from '../data';
import { useAuth } from './AuthContext';

interface MarketplaceContextType {
  orders: Order[];
  createOrder: (agent: Agent, method: 'card' | 'invoice') => Promise<Order>;
  hasPurchased: (agentId: string) => boolean;
  togglePurchaseEnabled: (agentId: string, enabled: boolean) => void;
  getAgentPurchaseStatus: (agentId: string) => boolean;
  downloadAgent: (agentId: string) => void;
  generatePO: (orderId: string, details: BillingDetails) => Promise<void>;
}

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);

  // Load orders from local storage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('nexus_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  // Update local storage when orders change
  useEffect(() => {
    localStorage.setItem('nexus_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = async (agent: Agent, method: 'card' | 'invoice'): Promise<Order> => {
    if (!user) throw new Error("User must be logged in to purchase");

    return new Promise((resolve) => {
        setTimeout(() => {
            const newOrder: Order = {
                id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                userId: user.id,
                agentId: agent.id,
                agentName: agent.name,
                amount: agent.price,
                currency: 'USD', // Defaulting to USD for backend consistency
                date: new Date().toISOString(),
                status: method === 'invoice' ? 'pending' : 'completed',
                method: method,
                // In a real app, this URL would be generated securely by the backend
                downloadUrl: method === 'card' ? `https://nexusai.com/download/${agent.id}?token=secure_123` : undefined
            };

            setOrders(prev => [newOrder, ...prev]);
            
            // If card, we auto-fulfill in this mock
            if (method === 'card') {
                // Update user portfolio (mock only, requires AuthContext refactor for full persistence)
                // In reality, Portfolio page would query orders.
            }

            resolve(newOrder);
        }, 1500); // Simulate API latency
    });
  };

  const hasPurchased = (agentId: string): boolean => {
    if (!user) return false;
    // Also allow builders to "purchase" (download) their own agents
    if (user.role === 'builder') {
        const agent = agents.find(a => a.id === agentId);
        if (agent && agent.builder.id === user.id) return true;
    }
    return orders.some(o => o.agentId === agentId && o.userId === user.id && o.status === 'completed');
  };

  const togglePurchaseEnabled = (agentId: string, enabled: boolean) => {
     setAgents(prev => prev.map(a => a.id === agentId ? { ...a, purchaseEnabled: enabled } : a));
  };

  const getAgentPurchaseStatus = (agentId: string): boolean => {
     const agent = agents.find(a => a.id === agentId);
     return agent ? (agent.purchaseEnabled ?? true) : false;
  };

  const downloadAgent = (agentId: string) => {
      if (!user) {
          alert("Please login to download.");
          return;
      }

      if (!hasPurchased(agentId)) {
          alert("Access Denied. Please purchase a license to download this agent.");
          return;
      }

      // Simulate Gated Download Logic
      // 1. Generate single-use token
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      // 2. Log the access event
      console.log(`[AUDIT] Download initiated`, {
          timestamp: new Date().toISOString(),
          userId: user.id,
          agentId: agentId,
          ipHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', // Mock IP hash
          token: token
      });

      // 3. Trigger download (Mock)
      const agent = agents.find(a => a.id === agentId);
      const version = agent?.versions[0]?.version || '1.0.0';
      
      alert(`Secure link generated successfully.\n\nDownloading: ${agent?.name}_v${version}.zip\nToken: ${token}\n\nThis link is valid for 15 minutes.`);
  };

  const generatePO = async (orderId: string, details: BillingDetails) => {
      // Simulate backend generation delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setOrders(prev => prev.map(o => {
          if (o.id === orderId) {
              return {
                  ...o,
                  status: 'po_generated',
                  billingDetails: details,
                  invoiceId: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
              };
          }
          return o;
      }));
  };

  return (
    <MarketplaceContext.Provider value={{
      orders,
      createOrder,
      hasPurchased,
      togglePurchaseEnabled,
      getAgentPurchaseStatus,
      downloadAgent,
      generatePO
    }}>
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (context === undefined) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
};
