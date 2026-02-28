import { useQueries, useQuery } from '@tanstack/react-query';
import { API_URL } from '../config/api';
import { getAnalysisTimeframe } from '../utils/timeframeUtils';

async function fetchAnalysis(symbol, timeframe) {
  const interval = getAnalysisTimeframe(timeframe);
  const response = await fetch(`${API_URL}/api/analysis/${symbol}?interval=${interval}`);
  if (!response.ok) throw new Error(`Analysis error: ${response.status}`);
  return response.json();
}

export function useAnalysis(symbol, timeframe) {
  return useQuery({
    queryKey: ['analysis', symbol, timeframe],
    queryFn: () => fetchAnalysis(symbol, timeframe),
    enabled: Boolean(symbol),
    staleTime: 20_000,
    refetchInterval: 45_000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d'];

export function useMultiTimeframeAnalysis(symbol) {
  const queries = useQueries({
    queries: TIMEFRAMES.map((tf) => ({
      queryKey: ['analysis', symbol, tf],
      queryFn: () => fetchAnalysis(symbol, tf),
      enabled: Boolean(symbol),
      staleTime: 30_000,
      refetchInterval: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    })),
  });

  const analysisByTimeframe = {};
  queries.forEach((q, idx) => {
    if (q.data?.analysis) analysisByTimeframe[TIMEFRAMES[idx]] = q.data.analysis;
  });

  return {
    timeframes: TIMEFRAMES,
    analysisByTimeframe,
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.every((q) => q.isError),
  };
}
