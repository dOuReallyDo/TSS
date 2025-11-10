
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Construction, Play, Activity } from 'lucide-react';
import { Strategy, BacktestResult } from '../types';
import { runBacktest } from '../services/tradingDataService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const MetricCard: React.FC<{ title: string; value: string; positive?: boolean }> = ({ title, value, positive }) => (
    <Card className="text-center">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className={`text-3xl font-bold ${positive === true ? 'text-green-400' : positive === false ? 'text-red-400' : 'text-white'}`}>{value}</p>
    </Card>
);

const Backtesting: React.FC = () => {
    const [strategy, setStrategy] = useState<Strategy>(Strategy.ACKMAN);
    const [startDate, setStartDate] = useState<string>('2023-01-01');
    const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleRunBacktest = async () => {
        setIsLoading(true);
        setError(null);
        setBacktestResult(null);
        try {
            const result = await runBacktest(strategy, startDate, endDate);
            setBacktestResult(result);
        } catch (e: any) {
            setError(e.message || "An error occurred during backtesting.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Backtesting Engine</h1>
            <Card title="Simulation Configuration">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Strategy</label>
                        <select
                            value={strategy}
                            onChange={(e) => setStrategy(e.target.value as Strategy)}
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white"
                        >
                            {Object.values(Strategy).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white"
                        />
                    </div>
                </div>
                 <button
                    onClick={handleRunBacktest}
                    disabled={isLoading}
                    className="mt-6 w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white flex items-center justify-center disabled:bg-indigo-400"
                >
                    {isLoading ? <Activity className="animate-spin mr-2"/> : <Play className="mr-2"/>}
                    {isLoading ? 'Running Simulation...' : 'Run Backtest'}
                </button>
            </Card>

            {error && <p className="text-red-400">{error}</p>}
            
            {backtestResult && (
                <div className="space-y-6">
                    <Card title="Performance Metrics">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard 
                                title="Total Return" 
                                value={formatPercent(backtestResult.metrics.totalReturn)}
                                positive={backtestResult.metrics.totalReturn > 0}
                            />
                            <MetricCard 
                                title="Sharpe Ratio" 
                                value={backtestResult.metrics.sharpeRatio.toFixed(2)}
                            />
                            <MetricCard 
                                title="Max Drawdown" 
                                value={formatPercent(backtestResult.metrics.maxDrawdown)}
                                positive={false}
                            />
                            <MetricCard 
                                title="Win Rate" 
                                value={formatPercent(backtestResult.metrics.winRate)}
                            />
                        </div>
                    </Card>
                    <Card title="Equity Curve">
                         <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={backtestResult.equityCurve}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                                <XAxis dataKey="date" stroke="#A0AEC0"/>
                                <YAxis stroke="#A0AEC0" domain={['auto', 'auto']} tickFormatter={(tick) => `$${tick.toLocaleString()}`}/>
                                <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} formatter={(value: number) => `$${value.toLocaleString()}`} />
                                <Legend />
                                <Line type="monotone" dataKey="portfolioValue" stroke="#8884d8" dot={false} name="Strategy" />
                                <Line type="monotone" dataKey="buyAndHoldValue" stroke="#82ca9d" dot={false} name="Buy & Hold" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            )}

            {!isLoading && !backtestResult && (
                 <Card>
                    <div className="flex flex-col items-center justify-center text-center text-gray-400 h-64">
                    <Construction size={48} className="mb-4 text-indigo-400" />
                    <h2 className="text-2xl font-bold text-white mb-2">Ready to Test</h2>
                    <p>Configure your simulation parameters above and click "Run Backtest" to see the results.</p>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Backtesting;
