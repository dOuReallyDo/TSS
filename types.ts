
export type Page = 'Data Dashboard' | 'Strategy Config' | 'Training Studio' | 'Predictions' | 'Backtesting';

export interface OHLCV {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export enum ModelType {
  LSTM = 'LSTM',
  GRU = 'GRU',
  TRANSFORMER = 'Transformer',
  ENSEMBLE = 'Ensemble',
}

export enum Strategy {
  BUFFETT = 'Warren Buffett - Value Investing',
  MARKS = 'Howard Marks - Contrarian',
  ACKMAN = 'Bill Ackman - Momentum/Activist',
  NEURAL = 'Pure Neural - Unbiased Learning',
}

export interface ModelConfig {
  architecture: ModelType;
  units1: number;
  units2: number;
  dropout: number;
  heads?: number;
}

export interface TrainingParams {
  batchSize: number;
  learningRate: number;
}

export type StopCriterion = 'epoch' | 'time' | 'loss' | 'improvement';

export interface StoppingCriteria {
  criterion: StopCriterion;
  value: number;
  window?: number;
}

export interface TrainingProgress {
  epoch: number;
  totalEpochs: number;
  loss: number;
  valLoss: number;
  eta: string;
}

export interface StrategyDetails {
    name: Strategy;
    philosophy: string;
    risk: 'Low' | 'Medium' | 'High' | 'Adaptive';
    holdingPeriod: string;
    buySignals: string[];
    sellSignals: string[];
    idealFor: string;
}
