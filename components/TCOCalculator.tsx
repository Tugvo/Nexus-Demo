
import React, { useState } from 'react';
import { Agent } from '../types';
import { Calculator, Zap } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface TCOCalculatorProps {
  agent: Agent;
}

const TCOCalculator: React.FC<TCOCalculatorProps> = ({ agent }) => {
  const { formatPrice } = useCurrency();
  
  // Default Assumptions
  const [devRate, setDevRate] = useState(80); // Hourly rate in USD
  const [engineers, setEngineers] = useState(1);
  const [months, setMonths] = useState(3);
  const [maintenancePct, setMaintenancePct] = useState(20);

  const hoursPerMonth = 160;
  
  // Calculations
  const buildCostYear1 = devRate * engineers * months * hoursPerMonth;
  const maintenanceCost = buildCostYear1 * (maintenancePct / 100);
  const totalBuildTCO = buildCostYear1 + maintenanceCost;
  
  const buyCostYear1 = agent.pricingModel === 'monthly' ? agent.price * 12 : agent.price;
  const savings = totalBuildTCO - buyCostYear1;

  return (
    <div className="bg-theme-bg-sec rounded-xl border border-theme-border p-6 mt-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-6 border-b border-theme-border pb-4">
        <Calculator className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-theme-text">Buy vs. Build Analysis</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* INPUTS */}
        <div className="space-y-6">
           <h4 className="text-sm font-semibold text-theme-text-sec uppercase tracking-wider">Estimated Build Effort</h4>
           
           <div>
              <div className="flex justify-between text-sm mb-2">
                 <span className="text-theme-text">Developer Hourly Rate</span>
                 <span className="font-bold text-theme-text">${devRate}</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="250" 
                step="5"
                value={devRate}
                onChange={(e) => setDevRate(parseInt(e.target.value))}
                className="w-full h-2 bg-theme-card rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-theme-border"
              />
           </div>

           <div>
              <div className="flex justify-between text-sm mb-2">
                 <span className="text-theme-text">Engineers Needed</span>
                 <span className="font-bold text-theme-text">{engineers}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={engineers}
                onChange={(e) => setEngineers(parseInt(e.target.value))}
                className="w-full h-2 bg-theme-card rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-theme-border"
              />
           </div>

           <div>
              <div className="flex justify-between text-sm mb-2">
                 <span className="text-theme-text">Months to Build</span>
                 <span className="font-bold text-theme-text">{months}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="24" 
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value))}
                className="w-full h-2 bg-theme-card rounded-lg appearance-none cursor-pointer accent-indigo-600 border border-theme-border"
              />
           </div>
        </div>

        {/* OUTPUTS */}
        <div className="bg-theme-card rounded-xl border border-theme-border p-6 flex flex-col justify-center">
            <h4 className="text-sm font-semibold text-theme-text-sec uppercase tracking-wider mb-4">Cost Comparison (Illustrative Estimate)</h4>
            
            <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-theme-border">
                    <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-red-400"></div>
                         <span className="text-theme-text-sec text-sm">Estimated Build Cost (1 Year)</span>
                    </div>
                    <span className="font-semibold text-theme-text">${totalBuildTCO.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-theme-border">
                    <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-green-500"></div>
                         <span className="text-theme-text-sec text-sm">Estimated Buy Cost (1 Year)</span>
                    </div>
                    <span className="font-semibold text-green-600">${buyCostYear1.toLocaleString()}</span>
                </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg bg-theme-bg-sec border border-theme-border`}>
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-theme-text">Potential Savings</span>
                </div>
                <p className={`text-lg font-bold ${savings > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
                    ${savings.toLocaleString()}
                </p>
            </div>

             <div className="mt-4 flex flex-col gap-1 text-xs text-theme-text-sec text-center">
                <p className="flex items-center justify-center gap-1"><Zap className="w-3 h-3" /> Based on {hoursPerMonth}h/mo + {maintenancePct}% maintenance</p>
                <p>Estimates are indicative and depend on integration complexity and maintenance needs.</p>
             </div>
        </div>

      </div>
    </div>
  );
};

export default TCOCalculator;
