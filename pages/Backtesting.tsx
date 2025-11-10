
import React from 'react';
import { Card } from '../components/Card';
import { Construction } from 'lucide-react';

const Backtesting: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Backtesting</h1>
      <Card>
        <div className="flex flex-col items-center justify-center text-center text-gray-400 h-64">
          <Construction size={48} className="mb-4 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white mb-2">Feature In Construction</h2>
          <p>
            The backtesting engine is currently under development.
          </p>
          <p className="mt-4 text-sm">
            Upcoming features include:
          </p>
          <ul className="list-disc list-inside text-sm mt-2">
            <li>Walk-forward validation</li>
            <li>Performance metrics (Sharpe, Drawdown, etc.)</li>
            <li>Equity curve visualization</li>
            <li>Comparison with buy-and-hold</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Backtesting;
