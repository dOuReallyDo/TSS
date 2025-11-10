
import { OHLCV, TrainingProgress, ModelConfig, TrainingParams } from '../types';

// Mock data generation
const generateMockData = (days: number): OHLCV[] => {
  const data: OHLCV[] = [];
  let lastClose = 150 + Math.random() * 50;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const open = lastClose * (1 + (Math.random() - 0.5) * 0.05);
    const high = Math.max(open, lastClose) * (1 + Math.random() * 0.03);
    const low = Math.min(open, lastClose) * (1 - Math.random() * 0.03);
    const close = low + (high - low) * Math.random();
    const volume = 1_000_000 + Math.random() * 5_000_000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume,
    });
    lastClose = close;
  }
  return data;
};

export const fetchStockData = async (symbol: string, years: number): Promise<OHLCV[]> => {
  console.log(`Fetching mock data for ${symbol} for ${years} years...`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return generateMockData(years * 252); // Assuming 252 trading days a year
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
