
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import DataDashboard from './pages/DataDashboard';
import TrainingStudio from './pages/TrainingStudio';
import Predictions from './pages/Predictions';
import StrategyConfig from './pages/StrategyConfig';
import Backtesting from './pages/Backtesting';
import { Page } from './types';
import { Github, Cpu, BarChart2, BrainCircuit, Bot, LineChart } from 'lucide-react';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Data Dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'Data Dashboard':
        return <DataDashboard />;
      case 'Strategy Config':
        return <StrategyConfig />;
      case 'Training Studio':
        return <TrainingStudio />;
      case 'Predictions':
        return <Predictions />;
      case 'Backtesting':
        return <Backtesting />;
      default:
        return <DataDashboard />;
    }
  };

  const pages: { name: Page; icon: React.ElementType }[] = [
    { name: 'Data Dashboard', icon: BarChart2 },
    { name: 'Strategy Config', icon: Bot },
    { name: 'Training Studio', icon: BrainCircuit },
    { name: 'Predictions', icon: LineChart },
    { name: 'Backtesting', icon: Cpu },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar activePage={activePage} setActivePage={setActivePage} pages={pages} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default App;
