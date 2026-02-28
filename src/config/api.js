const getApiUrl = () => {
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  const viteEnv = typeof import.meta !== 'undefined' ? import.meta.env : undefined;
  if (viteEnv?.VITE_API_URL) {
    return viteEnv.VITE_API_URL;
  }

  return 'https://crypto-dashboard-backend-883w.onrender.com';
};

export const API_URL = getApiUrl();

export const fetchApi = async (endpoint) => {
  const response = await fetch(`${API_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const getCurrentPrice = async (symbol) => {
  if (!symbol) {
    throw new Error('Symbol is required');
  }

  const cleanSymbol = symbol.replace(/USDT$/i, '').toUpperCase();
  const pair = `${cleanSymbol}USDT`;
  const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${pair}`);

  if (response.status === 400) {
    throw new Error(`Invalid symbol: ${pair}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return {
    symbol: pair,
    currentPrice: parseFloat(data.lastPrice),
    priceChange24h: parseFloat(data.priceChange),
    priceChangePercent24h: parseFloat(data.priceChangePercent),
  };
};
