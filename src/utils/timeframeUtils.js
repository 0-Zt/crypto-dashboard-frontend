// Función para convertir timeframe al formato que necesita cada contexto
export const convertTimeframe = (timeframe, context = 'binance') => {
  // Si el timeframe ya incluye una letra (h, d), lo dejamos como está
  if (timeframe.includes('h') || timeframe.includes('d')) {
    return timeframe;
  }

  // Para timeframes menores a 1 hora
  const timeframeMap = {
    '1m': { binance: '1m', analysis: '1h' },
    '5m': { binance: '5m', analysis: '1h' },
    '15m': { binance: '15m', analysis: '1h' },
    '30m': { binance: '30m', analysis: '1h' }
  };

  return timeframeMap[timeframe]?.[context] || timeframe;
};

// Función para obtener el timeframe para el análisis
export const getAnalysisTimeframe = (timeframe) => {
  return convertTimeframe(timeframe, 'analysis');
};

// Función para obtener el timeframe para Binance
export const getBinanceTimeframe = (timeframe) => {
  return convertTimeframe(timeframe, 'binance');
};
