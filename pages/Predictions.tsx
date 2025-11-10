
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { OHLCV } from '../types';
import { generatePredictions, fetchStockData } from '../services/tradingDataService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Wand, Activity } from 'lucide-react';

const Predictions: React.FC = () => {
    const [model, setModel] = useState<string>('LSTM_AAPL_20241115.keras');
    const [daysToPredict, setDaysToPredict] = useState<number>(30);
    const [historicalData, setHistoricalData] = useState<OHLCV[]>([]);
    const [predictions, setPredictions] = useState<OHLCV[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Fetch some base data for context on component mount
    React.useEffect(() => {
        const loadInitialData = async () => {
            const data = await fetchStockData("AAPL", 0.5); // fetch last 6 months
            setHistoricalData(data);
        };
        loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGeneratePredictions = async () => {
        setIsLoading(true);
        setPredictions([]);
        const preds = await generatePredictions(model, historicalData, daysToPredict);
        setPredictions(preds);
        setIsLoading(false);
    };

    const combinedData = [
        ...historicalData.map(d => ({ ...d, type: 'historical' })),
        ...predictions.map(d => ({ ...d, type: 'prediction' }))
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Predictions</h1>
            <Card title="Generate Predictions">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Trained Model</label>
                        <select 
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white">
                            <option>LSTM_AAPL_20241115.keras</option>
                            <option>GRU_MSFT_20241114.keras</option>
                            <option>TRANSFORMER_NVDA_20241112.keras</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Days to Predict</label>
                        <input 
                            type="number"
                            value={daysToPredict}
                            onChange={(e) => setDaysToPredict(Math.max(1, +e.target.value))}
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 text-white"
                        />
                    </div>
                </div>
                <button
                    onClick={handleGeneratePredictions}
                    disabled={isLoading || historicalData.length === 0}
                    className="mt-6 w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white flex items-center justify-center disabled:bg-indigo-400"
                >
                    {isLoading ? <Activity className="animate-spin mr-2"/> : <Wand className="mr-2"/>}
                    {isLoading ? 'Generating...' : 'Generate Predictions'}
                </button>
            </Card>

            {(historicalData.length > 0) && (
                <Card title="Price Forecast">
                    <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={combinedData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="date" stroke="#A0AEC0"/>
                            <YAxis stroke="#A0AEC0" domain={['auto', 'auto']} />
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                            <Legend />
                            <Line dataKey="close" stroke="#8884d8" dot={false} name="Historical Close" />
                            {predictions.length > 0 && 
                                <Line dataKey="close" stroke="#34D399" dot={false} strokeDasharray="5 5" name="Predicted Close" />
                            }
                        </ComposedChart>
                    </ResponsiveContainer>
                </Card>
            )}
        </div>
    );
};

export default Predictions;
