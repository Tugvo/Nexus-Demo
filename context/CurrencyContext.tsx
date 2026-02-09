import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CurrencyCode } from '../types';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInINR: number) => string;
  rates: Record<CurrencyCode, number>;
  isLoading: boolean;
  isUsingFallback: boolean;
  setCheckoutMode: (isCheckout: boolean) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Base Rates (approximate) to serve as fallback
const BASE_RATES: Record<CurrencyCode, number> = {
  INR: 1,
  USD: 0.012, // 1 INR ~= 0.012 USD
  EUR: 0.011,
  GBP: 0.0095
};

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('INR');
  const [rates, setRates] = useState<Record<CurrencyCode, number>>(BASE_RATES);
  const [isLoading, setIsLoading] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [lockedRates, setLockedRates] = useState<Record<CurrencyCode, number> | null>(null);

  // Load preference from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nexus_currency');
    if (saved && Object.keys(BASE_RATES).includes(saved)) {
      setCurrencyState(saved as CurrencyCode);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('nexus_currency', code);
  };

  // Real-time Pricing Engine
  useEffect(() => {
    // If rates are locked (e.g. payment processing), do not update
    if (lockedRates) return;

    const fetchRates = async () => {
      setIsLoading(true);
      try {
        // Simulate API call with delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Simulate live market fluctuations (±5% cap to prevent jitter)
        const volatility = 0.05; 
        const randomFluctuation = () => 1 + (Math.random() * volatility * 2 - volatility);
        
        const newRates = {
          INR: 1,
          USD: BASE_RATES.USD * randomFluctuation(),
          EUR: BASE_RATES.EUR * randomFluctuation(),
          GBP: BASE_RATES.GBP * randomFluctuation(),
        };

        setRates(newRates);
        setIsUsingFallback(false);
      } catch (error) {
        console.warn('Currency API failed, using fallback rates', error);
        setIsUsingFallback(true);
        // Keep existing rates or revert to base if first load fails
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchRates();

    // Set refresh interval based on mode
    const intervalTime = checkoutMode ? 60000 : 300000; // 60s vs 5m
    const interval = setInterval(fetchRates, intervalTime);

    return () => clearInterval(interval);
  }, [checkoutMode, lockedRates]);

  const formatPrice = (amountInINR: number) => {
    if (amountInINR === 0) return 'Free';
    
    const activeRates = lockedRates || rates;
    const rate = activeRates[currency];
    const converted = amountInINR * rate;

    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(converted);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2
    }).format(converted);
  };

  // Function to lock price (can be called when user clicks "Pay")
  // For this implementation, we just expose the logic
  const lockPrice = () => {
      setLockedRates({ ...rates });
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      formatPrice, 
      rates, 
      isLoading,
      isUsingFallback,
      setCheckoutMode
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
