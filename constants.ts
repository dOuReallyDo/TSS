
import { Strategy, StrategyDetails } from './types';

export const STRATEGY_DETAILS: Record<Strategy, StrategyDetails> = {
  [Strategy.BUFFETT]: {
    name: Strategy.BUFFETT,
    philosophy: "Compra aziende di qualità a prezzi giusti e mantieni a lungo termine",
    risk: "Low",
    holdingPeriod: "6 mesi - 2 anni",
    buySignals: ["P/E ratio < media mercato", "Debt/Equity < 0.5", "ROE > 15%", "Prezzo vicino o sotto SMA 200"],
    sellSignals: ["Deterioramento fondamentali", "Stop loss colpito (-15%)"],
    idealFor: "Investitori conservativi, capitale da proteggere, orizzonte temporale lungo",
  },
  [Strategy.MARKS]: {
    name: Strategy.MARKS,
    philosophy: "Compra quando gli altri hanno paura, vendi quando sono avidi",
    risk: "Medium",
    holdingPeriod: "1-6 mesi",
    buySignals: ["RSI < 30 (oversold)", "VIX > 25 (alta paura)", "Prezzo sotto banda inferiore Bollinger"],
    sellSignals: ["RSI > 70 (overbought)", "VIX < 15 (complacenza)", "Take profit +30%"],
    idealFor: "Investitori pazienti, tolleranza volatilità media, capacità di andare contro corrente",
  },
  [Strategy.ACKMAN]: {
    name: Strategy.ACKMAN,
    philosophy: "Segui la forza, taglia le perdite velocemente, lascia correre i vincitori",
    risk: "High",
    holdingPeriod: "5 giorni - 2 mesi",
    buySignals: ["SMA 10 > SMA 20 > SMA 50", "MACD histogram > 0", "ADX > 25", "Volume > media * 1.2"],
    sellSignals: ["SMA 10 < SMA 20", "Stop loss -8%", "Trailing stop -10%"],
    idealFor: "Trader attivi, alta tolleranza al rischio, monitoraggio frequente",
  },
  [Strategy.NEURAL]: {
    name: Strategy.NEURAL,
    philosophy: "Lascia che i dati parlino, nessun bias umano",
    risk: "Adaptive",
    holdingPeriod: "Il modello decide",
    buySignals: ["Basati su predizioni del modello", "Confidence threshold > 65%"],
    sellSignals: ["Basati su predizioni del modello", "Confidence threshold > 65%"],
    idealFor: "Fiducia nel ML, approccio quantitativo, sperimentazione",
  },
};
