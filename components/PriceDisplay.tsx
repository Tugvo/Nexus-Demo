
import React from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { RefreshCw } from 'lucide-react';

interface PriceDisplayProps {
  amount: number;
  className?: string;
  showLoader?: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ amount, className = '', showLoader = false }) => {
  const { formatPrice, isLoading, isUsingFallback, currency } = useCurrency();

  const getCurrencyFlag = () => {
      switch(currency) {
          case 'INR': return '🇮🇳';
          case 'USD': return '🇺🇸';
          case 'EUR': return '🇪🇺';
          case 'GBP': return '🇬🇧';
          default: return '';
      }
  };

  return (
    <span className={`inline-flex items-center gap-1 ${className} ${isLoading && showLoader ? 'opacity-70' : ''} transition-opacity duration-500`}>
      {amount > 0 && <span className="mr-1">{getCurrencyFlag()}</span>}
      {formatPrice(amount)}
      {isUsingFallback && amount > 0 && (
         <span title="Using last available rate" className="w-1.5 h-1.5 bg-yellow-400 rounded-full inline-block ml-1"></span>
      )}
      {isLoading && showLoader && (
         <RefreshCw className="w-3 h-3 animate-spin text-gray-400" />
      )}
    </span>
  );
};

export default PriceDisplay;
