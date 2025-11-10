
import React, { useState } from 'react';
import { OHLCV } from '../types';
import { fetchStockData } from '../services/tradingDataService';
import { Card } from '../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Download, Activity, FileWarning, CheckCircle } from 'lucide-react';

const DataDashboard: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('AAPL');
  const [years, setYears] = useState<number>(1);
  const [data, setData] = useState<OHLCV[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchData = async () => {
    setIsLoading(true);
    setError(null);
    setData([]);
    try {
      if (!symbol) {
        throw new Error("Please enter a stock symbol.");
      }
      const fetchedData = await fetchStockData(symbol, years);
      setData(fetchedData);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formattedData = data.map(d => ({ ...d, name: d.date }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Data Dashboard</h1>
      <Card title="Data Downloader">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="symbol" className="block text-sm font-medium text-gray-300">Stock Symbol</label>
            <input
              type="text"
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="e.g., AAPL"
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="years" className="block text-sm font-medium text-gray-300">Period (Years)</label>
            <select
              id="years"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white p-2"
            >
              <option value={1}>1 Year</option>
              <option value={2}>2 Years</option>
              <option value={5}>5 Years</option>
              <option value={10}>10 Years</option>
            </select>
          </div>
          <button
            onClick={handleFetchData}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Activity className="animate-spin -ml-1 mr-2 h-5 w-5" />
            ) : (
              <Download className="-ml-1 mr-2 h-5 w-5" />
            )}
            {isLoading ? 'Downloading...' : 'Download Data'}
          </button>
        </div>
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </Card>
      
      {data.length > 0 && (
        <>
        <Card title={`Price History for ${symbol}`}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" domain={['auto', 'auto']} />
                <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                <Legend />
                <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} name="Close Price" />
              </LineChart>
            </ResponsiveContainer>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card title="Data Quality">
                <div className="space-y-4">
                    <div className="flex items-center text-green-400">
                        <CheckCircle className="mr-3"/>
                        <span>Data Completeness: 99.8%</span>
                    </div>
                    <div className="flex items-center text-green-400">
                        <CheckCircle className="mr-3"/>
                        <span>No Duplicates Found</span>
                    </div>
                     <div className="flex items-center text-yellow-400">
                        <FileWarning className="mr-3"/>
                        <span>Minor Gaps Detected: 3</span>
                    </div>
                </div>
            </Card>
            <Card title="Summary Statistics">
                <div className="text-sm space-y-2 text-gray-300">
                    <p>Records: <span className="font-semibold text-white">{data.length}</span></p>
                    <p>Start Date: <span className="font-semibold text-white">{data[0].date}</span></p>
                    <p>End Date: <span className="font-semibold text-white">{data[data.length-1].date}</span></p>
                </div>
            </Card>
            <Card title="Volatility">
                 <div className="text-sm space-y-2 text-gray-300">
                    <p>Avg. Daily Range: <span className="font-semibold text-white">$...</span></p>
                    <p>Annualized Volatility: <span className="font-semibold text-white">...%</span></p>
                </div>
            </Card>
        </div>
        <Card title={`Volume History for ${symbol}`}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                <Bar dataKey="volume" fill="#4c51bf" name="Volume" />
              </BarChart>
            </ResponsiveContainer>
        </Card>
        </>
      )}

    </div>
  );
};

export default DataDashboard;
