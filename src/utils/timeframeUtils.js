// Función para convertir timeframe al formato que necesita cada contexto
export const convertTimeframe = (timeframe, context = 'binance') => {
  // Normalizar el timeframe a minúscula y quitar espacios
  const normalizedTimeframe = timeframe.toLowerCase().trim();

  // Mapa de conversión de timeframes - Usando las mismas temporalidades para trading y análisis
  const timeframeMap = {
    '1m': { binance: '1m', analysis: '1m' },
    '5m': { binance: '5m', analysis: '5m' },
    '15m': { binance: '15m', analysis: '15m' },
    '30m': { binance: '30m', analysis: '30m' },
    '1h': { binance: '1h', analysis: '1h' },
    '4h': { binance: '4h', analysis: '4h' },
    '1d': { binance: '1d', analysis: '1d' }
  };

  // Si el timeframe está en el mapa, usar la conversión
  if (timeframeMap[normalizedTimeframe]) {
    return timeframeMap[normalizedTimeframe][context];
  }

  // Si el timeframe incluye h o d, validar que sea un formato válido
  if (normalizedTimeframe.includes('h') || normalizedTimeframe.includes('d')) {
    const value = parseInt(normalizedTimeframe);
    const unit = normalizedTimeframe.slice(-1);
    
    if (!isNaN(value) && (unit === 'h' || unit === 'd')) {
      return normalizedTimeframe;
    }
  }

  // Si no es un formato válido, devolver el timeframe por defecto
  return context === 'analysis' ? '1h' : '1h';
};

// Función para obtener el timeframe para el análisis
export const getAnalysisTimeframe = (timeframe) => {
  return convertTimeframe(timeframe, 'analysis');
};

// Función para obtener el timeframe para Binance
export const getBinanceTimeframe = (timeframe) => {
  return convertTimeframe(timeframe, 'binance');
};

// Función para validar si un timeframe es válido
export const isValidTimeframe = (timeframe) => {
  const validTimeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
  return validTimeframes.includes(timeframe.toLowerCase().trim());
};

// Función para obtener todos los timeframes válidos
export const getValidTimeframes = () => {
  return ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
};
