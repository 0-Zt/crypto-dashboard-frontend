import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../config/api';

const cache = new Map();

const readCache = (key) => cache.get(key);
const writeCache = (key, value) => cache.set(key, value);

const fetchJson = async (url, errorMessage) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(errorMessage || `HTTP ${response.status}`);
  }
  return response.json();
};

const useCachedRequest = (key, queryFn, { enabled = true, refetchInterval = 0 } = {}) => {
  const cached = readCache(key);
  const [data, setData] = useState(cached || null);
  const [isLoading, setIsLoading] = useState(enabled && !cached);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;

    const run = async () => {
      try {
        setError(null);
        if (!readCache(key)) setIsLoading(true);
        const result = await queryFn();
        writeCache(key, result);
        if (active) setData(result);
      } catch (err) {
        if (active) setError(err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    run();
    if (refetchInterval > 0) {
      const timer = setInterval(run, refetchInterval);
      return () => {
        active = false;
        clearInterval(timer);
      };
    }

    return () => {
      active = false;
    };
  }, [enabled, key, queryFn, refetchInterval]);

  return { data, isLoading, error };
};

export const useSymbolsQuery = () =>
  useCachedRequest(
    'symbols',
    async () => {
      const data = await fetchJson('https://api.binance.com/api/v3/exchangeInfo', 'Error al obtener símbolos');
      return data.symbols.filter((s) => s.status === 'TRADING').map((s) => s.symbol);
    },
    { refetchInterval: 1000 * 60 * 30 }
  );

export const useTopCryptosQuery = () =>
  useCachedRequest(
    'top-cryptos',
    async () => {
      const binanceData = await fetchJson('https://api.binance.com/api/v3/ticker/24hr', 'Error al cargar datos de mercado');
      return binanceData
        .filter((pair) => pair.symbol.endsWith('USDT'))
        .map((crypto) => ({
          ...crypto,
          name: crypto.symbol.replace('USDT', ''),
          image: `https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/${crypto.symbol.replace('USDT', '').toLowerCase()}.png`,
          price: parseFloat(crypto.lastPrice),
          quoteVolume: parseFloat(crypto.quoteVolume),
        }))
        .sort((a, b) => b.quoteVolume - a.quoteVolume)
        .slice(0, 25);
    },
    { refetchInterval: 15000 }
  );

export const useAnalysisQuery = (symbol, timeframe) => {
  const key = useMemo(() => `analysis-${symbol}-${timeframe}`, [symbol, timeframe]);
  const queryFn = useMemo(
    () => () => fetchJson(`${API_URL}/api/analysis/${symbol}?interval=${timeframe}`, 'Error al cargar análisis'),
    [symbol, timeframe]
  );

  return useCachedRequest(key, queryFn, {
    enabled: Boolean(symbol && timeframe),
    refetchInterval: 30000,
  });
};

export const useMultiTimeframeAnalysisQuery = (symbol, timeframes) => {
  const key = useMemo(() => `multi-timeframe-${symbol}`, [symbol]);
  const queryFn = useMemo(
    () => async () => {
      const results = await Promise.allSettled(
        timeframes.map(async (timeframe) => {
          const data = await fetchJson(`${API_URL}/api/analysis/${symbol}?interval=${timeframe}`);
          return [timeframe, data.analysis];
        })
      );

      return results.reduce((acc, result, index) => {
        if (result.status === 'fulfilled') {
          const [timeframe, analysis] = result.value;
          acc[timeframe] = analysis;
        } else {
          acc[timeframes[index]] = null;
        }
        return acc;
      }, {});
    },
    [symbol, timeframes]
  );

  return useCachedRequest(key, queryFn, {
    enabled: Boolean(symbol),
    refetchInterval: 45000,
  });
};
