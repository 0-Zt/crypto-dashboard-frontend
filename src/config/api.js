// Check for different environment variable patterns
const getApiUrl = () => {
  // Try to get the URL from environment variables first
  if (process.env.REACT_APP_API_URL) {
    console.log('Using REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }
  const envVite = import.meta.env;
  if (envVite && envVite.VITE_API_URL) {
    console.log('Using VITE_API_URL:', envVite.VITE_API_URL);
    return envVite.VITE_API_URL;
  }
  
  // If no environment variable is set, use the Railway deployment URL
  //https://localhost:8000
  //https://crypto-dashboard-backend-883w.onrender.com
  const railwayUrl = 'https://crypto-dashboard-backend-883w.onrender.com';
  console.log('Using Render URL:', railwayUrl);
  return railwayUrl;
};

export const API_URL = getApiUrl();

// Helper function to make API calls with proper error handling
export const fetchApi = async (endpoint) => {
  const url = `${API_URL}${endpoint}`;
  console.log('Fetching from:', url);
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Función para obtener el precio actual de un símbolo
export const getCurrentPrice = async (symbol) => {
  try {
    if (!symbol) {
      throw new Error('Symbol is required');
    }

    // Remove any USDT suffix if it exists and convert to uppercase
    const cleanSymbol = symbol.replace(/USDT$/i, '').toUpperCase();
    const pair = `${cleanSymbol}USDT`;

    console.log(`Fetching price for symbol: ${pair}`);
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
      priceChangePercent24h: parseFloat(data.priceChangePercent)
    };
  } catch (error) {
    console.error('Error fetching current price:', error.message);
    throw error; // Re-throw to let the caller handle the error
  }
};
