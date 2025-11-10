
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { STRATEGY_DETAILS } from '../constants';
import { Strategy, StrategyDetails } from '../types';
import { getStrategyExplanation } from '../services/geminiService';
import { BarChart, TrendingUp, Cpu, Brain, Send, Loader } from 'lucide-react';

const StrategyCard: React.FC<{ details: StrategyDetails, onSelect: () => void }> = ({ details, onSelect }) => {
    const icons: Record<StrategyDetails['risk'], React.ReactNode> = {
        'Low': <BarChart className="text-green-400" />,
        'Medium': <TrendingUp className="text-yellow-400" />,
        'High': <TrendingUp className="text-red-400" />,
        'Adaptive': <Cpu className="text-blue-400" />
    };

    return (
        <Card title={details.name} className="hover:border-indigo-500 transition-all cursor-pointer" titleClassName="text-lg">
            <div onClick={onSelect}>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">{details.philosophy}</span>
                    {icons[details.risk]}
                </div>
                <div className="space-y-2 text-sm">
                    <p><strong className="text-gray-300">Risk:</strong> <span className="font-mono p-1 bg-gray-700 rounded text-xs">{details.risk}</span></p>
                    <p><strong className="text-gray-300">Holding Period:</strong> {details.holdingPeriod}</p>
                </div>
            </div>
        </Card>
    )
}

const StrategyAssistant: React.FC<{ selectedStrategy: StrategyDetails }> = ({ selectedStrategy }) => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAsk = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setResponse('');
        const res = await getStrategyExplanation(prompt, selectedStrategy.name);
        setResponse(res);
        setIsLoading(false);
    };

    return (
        <Card className="mt-6">
            <h3 className="text-lg font-bold flex items-center text-indigo-400"><Brain className="mr-2"/>Strategy Assistant for "{selectedStrategy.name}"</h3>
            <p className="text-sm text-gray-400 mt-2 mb-4">Ask a question about this strategy, its indicators, or related ML concepts.</p>
            
            <div className="flex gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`e.g., "Explain RSI for ${selectedStrategy.name.split(' ')[0]}"`}
                    className="flex-1 bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                />
                <button 
                    onClick={handleAsk}
                    disabled={isLoading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white flex items-center disabled:bg-indigo-400"
                >
                    {isLoading ? <Loader className="animate-spin w-5 h-5"/> : <Send className="w-5 h-5"/>}
                </button>
            </div>
            
            {(isLoading || response) && (
                 <div className="mt-4 p-4 bg-gray-900 rounded-md border border-gray-700">
                    {isLoading && <p className="text-gray-400 animate-pulse">Assistant is thinking...</p>}
                    {response && <div className="text-gray-300 whitespace-pre-wrap">{response}</div>}
                 </div>
            )}
        </Card>
    );
};


const StrategyConfig: React.FC = () => {
    const strategies = Object.values(STRATEGY_DETAILS);
    const [selectedStrategy, setSelectedStrategy] = useState<StrategyDetails | null>(null);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Strategy Configuration</h1>
            <p className="text-gray-400">Select an investment philosophy to guide the ML model's feature selection and risk parameters. Click a card to learn more and interact with the Strategy Assistant.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {strategies.map(s => (
                    <StrategyCard key={s.name} details={s} onSelect={() => setSelectedStrategy(s)} />
                ))}
            </div>

            {selectedStrategy && <StrategyAssistant selectedStrategy={selectedStrategy} />}
        </div>
    );
};

export default StrategyConfig;
