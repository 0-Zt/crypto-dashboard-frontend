import { API_URL } from '../config/api';

// Función para detectar patrones de velas
export const detectCandlePatterns = async (symbol, timeframe) => {
  try {
    const response = await fetch(`${API_URL}/api/patterns/${symbol}?interval=${timeframe}`);
    if (!response.ok) {
      throw new Error('Error fetching candle patterns');
    }
    return await response.json();
  } catch (error) {
    console.error('Error detecting candle patterns:', error);
    return null;
  }
};

// Función para obtener niveles clave
export const getKeyLevels = async (symbol, timeframe) => {
  try {
    const response = await fetch(`${API_URL}/api/levels/${symbol}?interval=${timeframe}`);
    if (!response.ok) {
      throw new Error('Error fetching key levels');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting key levels:', error);
    return null;
  }
};

// Función para calcular momentum
export const calculateMomentum = (data, period = 10) => {
  const momentum = [];
  for (let i = period; i < data.length; i++) {
    const currentClose = data[i].close;
    const previousClose = data[i - period].close;
    const momentumValue = (currentClose - previousClose) / previousClose * 100;
    momentum.push({
      time: data[i].time,
      value: momentumValue
    });
  }
  return momentum;
};

// Función para calcular Volume Price Trend (VPT)
export const calculateVPT = (data) => {
  const vpt = [];
  let cumulativeVPT = 0;

  for (let i = 1; i < data.length; i++) {
    const previousClose = data[i - 1].close;
    const currentClose = data[i].close;
    const volume = data[i].volume;

    const priceChange = (currentClose - previousClose) / previousClose;
    const vptValue = volume * priceChange;
    cumulativeVPT += vptValue;

    vpt.push({
      time: data[i].time,
      value: cumulativeVPT
    });
  }

  return vpt;
};

// Función para detectar divergencias
export const detectDivergences = (price, indicator, lookback = 10) => {
  const divergences = [];
  
  for (let i = lookback; i < price.length; i++) {
    const priceWindow = price.slice(i - lookback, i + 1);
    const indicatorWindow = indicator.slice(i - lookback, i + 1);
    
    const priceHighs = findLocalExtremes(priceWindow, 'high');
    const priceLows = findLocalExtremes(priceWindow, 'low');
    const indicatorHighs = findLocalExtremes(indicatorWindow, 'high');
    const indicatorLows = findLocalExtremes(indicatorWindow, 'low');
    
    // Detectar divergencia bajista
    if (priceHighs.length >= 2 && indicatorHighs.length >= 2) {
      const priceHigher = priceHighs[1].value > priceHighs[0].value;
      const indicatorLower = indicatorHighs[1].value < indicatorHighs[0].value;
      
      if (priceHigher && indicatorLower) {
        divergences.push({
          type: 'bearish',
          time: priceHighs[1].time,
          price: priceHighs[1].value,
          indicator: indicatorHighs[1].value
        });
      }
    }
    
    // Detectar divergencia alcista
    if (priceLows.length >= 2 && indicatorLows.length >= 2) {
      const priceLower = priceLows[1].value < priceLows[0].value;
      const indicatorHigher = indicatorLows[1].value > indicatorLows[0].value;
      
      if (priceLower && indicatorHigher) {
        divergences.push({
          type: 'bullish',
          time: priceLows[1].time,
          price: priceLows[1].value,
          indicator: indicatorLows[1].value
        });
      }
    }
  }
  
  return divergences;
};

// Función auxiliar para encontrar extremos locales
const findLocalExtremes = (data, type) => {
  const extremes = [];
  
  for (let i = 1; i < data.length - 1; i++) {
    if (type === 'high') {
      if (data[i].value > data[i - 1].value && data[i].value > data[i + 1].value) {
        extremes.push({
          time: data[i].time,
          value: data[i].value
        });
      }
    } else {
      if (data[i].value < data[i - 1].value && data[i].value < data[i + 1].value) {
        extremes.push({
          time: data[i].time,
          value: data[i].value
        });
      }
    }
  }
  
  return extremes;
};
