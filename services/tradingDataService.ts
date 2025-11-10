import { OHLCV, TrainingProgress, ModelConfig, TrainingParams, Strategy, BacktestResult, BacktestMetrics, EquityDataPoint } from '../types';

// Generates more realistic-looking stock data to simulate a real API call
const generateRealisticStockData = (days: number): OHLCV[] => {
  const data: OHLCV[] = [];
  let lastClose = 150 + Math.random() * 200;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let trend = (Math.random() - 0.5) * 0.002; // Small initial trend

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Add some random volatility and trend changes
    const volatility = 0.02 + Math.random() * 0.04;
    if (i % 100 === 0) trend = (Math.random() - 0.5) * 0.002; // Change trend occasionally

    const changePercent = trend + (Math.random() - 0.5) * volatility;
    const open = lastClose * (1 + (Math.random() - 0.5) * 0.01);
    const high = Math.max(open, lastClose) * (1 + Math.random() * volatility / 2);
    const low = Math.min(open, lastClose) * (1 - Math.random() * volatility / 2);
    const close = lastClose * (1 + changePercent);
    const volume = 1_000_000 + Math.random() * 10_000_000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(volume),
    });
    lastClose = close;
  }
  return data;
};

export const fetchStockData = async (symbol: string, years: number): Promise<OHLCV[]> => {
  console.log(`Fetching realistic historical data for ${symbol} for ${years} years (simulation)...`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  // This simulates a call to a free data provider like Yahoo Finance.
  return generateRealisticStockData(years * 252); // Assuming 252 trading days a year
};

// Mock training simulation
export const startTraining = (
  config: ModelConfig,
  params: TrainingParams,
  totalEpochs: number,
  onProgress: (progress: TrainingProgress) => void,
  onComplete: () => void
) => {
  console.log('Starting mock training with config:', config, 'and params:', params);
  let currentEpoch = 0;
  let loss = 0.5 + Math.random() * 0.5;
  let valLoss = 0.5 + Math.random() * 0.5;

  const intervalId = setInterval(() => {
    currentEpoch++;
    loss *= (0.95 - Math.random() * 0.05);
    valLoss *= (0.96 - Math.random() * 0.05);

    const etaSeconds = (totalEpochs - currentEpoch) * 0.3; // 0.3s per epoch
    const eta = new Date(etaSeconds * 1000).toISOString().substr(11, 8);

    onProgress({
      epoch: currentEpoch,
      totalEpochs,
      loss: Math.max(0.001, loss),
      valLoss: Math.max(0.002, valLoss),
      eta,
    });

    if (currentEpoch >= totalEpochs) {
      clearInterval(intervalId);
      onComplete();
    }
  }, 300);

  return () => {
    console.log('Stopping mock training.');
    clearInterval(intervalId);
  };
};

export const generatePredictions = async (model: string, data: OHLCV[], days: number): Promise<OHLCV[]> => {
  console.log(`Generating mock predictions for ${days} days...`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const lastDataPoint = data[data.length - 1];
  if (!lastDataPoint) return [];

  const predictions: OHLCV[] = [];
  let lastClose = lastDataPoint.close;
  const lastDate = new Date(lastDataPoint.date);

  for (let i = 1; i <= days; i++) {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + i);

    const open = lastClose * (1 + (Math.random() - 0.5) * 0.02);
    const high = Math.max(open, lastClose) * (1 + Math.random() * 0.02);
    const low = Math.min(open, lastClose) * (1 - Math.random() * 0.02);
    const close = low + (high - low) * Math.random();
    
    predictions.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume: 0, // No volume for predictions
    });
    lastClose = close;
  }
  return predictions;
};


// Mock backtesting simulation
export const runBacktest = async (strategy: Strategy, startDate: string, endDate: string): Promise<BacktestResult> => {
  console.log(`Running backtest for ${strategy} from ${startDate} to ${endDate}`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
  const data = generateRealisticStockData(days);

  const initialCapital = 10000;
  let cash = initialCapital;
  let shares = 0;
  let portfolioValue = initialCapital;
  const equityCurve: EquityDataPoint[] = [];
  let peakValue = initialCapital;
  let maxDrawdown = 0;
  
  const trades = [];
  let wins = 0;
  let losses = 0;
  
  const firstPrice = data[0]?.close || initialCapital;

  for (let i = 1; i < data.length; i++) {
    const today = data[i];
    const yesterday = data[i-1];
    portfolioValue = cash + shares * today.close;

    // Simplified strategy logic
    let signal: 'BUY' | 'SELL' | 'HOLD' = 'HOLD';
    const priceChange = (today.close - yesterday.close) / yesterday.close;

    switch(strategy) {
        case Strategy.ACKMAN: // Momentum
            if (priceChange > 0.02 && cash > 0) signal = 'BUY';
            else if (priceChange < -0.015 && shares > 0) signal = 'SELL';
            break;
        case Strategy.MARKS: // Contrarian
            if (priceChange < -0.03 && cash > 0) signal = 'BUY';
            else if (priceChange > 0.03 && shares > 0) signal = 'SELL';
            break;
        case Strategy.BUFFETT: // Value (mocked as buy-and-hold with dip buying)
            if (i % 50 === 0 && cash > 0) signal = 'BUY'; // Buy periodically
            break;
        case Strategy.NEURAL: // Neural (random)
            const rand = Math.random();
            if (rand < 0.1 && cash > 0) signal = 'BUY';
            else if (rand > 0.9 && shares > 0) signal = 'SELL';
            break;
    }

    if (signal === 'BUY') {
      const sharesToBuy = (cash * 0.5) / today.close; // Use 50% of cash
      shares += sharesToBuy;
      cash -= sharesToBuy * today.close;
      trades.push({ type: 'BUY', price: today.close, shares: sharesToBuy });
    } else if (signal === 'SELL') {
      const sharesToSell = shares * 0.5; // Sell 50% of shares
      cash += sharesToSell * today.close;
      shares -= sharesToSell;
      const lastBuy = trades.filter(t => t.type === 'BUY').pop();
      if (lastBuy) {
          if (today.close > lastBuy.price) wins++;
          else losses++;
      }
    }
    
    // Update equity curve and drawdown
    portfolioValue = cash + shares * today.close;
    peakValue = Math.max(peakValue, portfolioValue);
    const drawdown = (peakValue - portfolioValue) / peakValue;
    maxDrawdown = Math.max(maxDrawdown, drawdown);
    
    const buyAndHoldValue = initialCapital / firstPrice * today.close;

    equityCurve.push({
      date: today.date,
      portfolioValue: parseFloat(portfolioValue.toFixed(2)),
      buyAndHoldValue: parseFloat(buyAndHoldValue.toFixed(2)),
    });
  }

  const finalReturn = (portfolioValue - initialCapital) / initialCapital;
  const totalTrades = wins + losses;

  const metrics: BacktestMetrics = {
    totalReturn: finalReturn,
    sharpeRatio: Math.random() * 1.5 + 0.2, // Mock Sharpe
    maxDrawdown: maxDrawdown,
    winRate: totalTrades > 0 ? wins / totalTrades : 0,
  };

  return { metrics, equityCurve };
};
