import { useQuery } from '@tanstack/react-query';

async function fetchSymbols() {
  const response = await fetch('https://api.binance.com/api/v3/exchangeInfo');
  if (!response.ok) throw new Error(`Binance error: ${response.status}`);
  const data = await response.json();
  return data.symbols
    .filter((s) => s.status === 'TRADING' && s.symbol.endsWith('USDT'))
    .map((s) => s.symbol)
    .sort();
}

export function useSymbols() {
  return useQuery({
    queryKey: ['symbols'],
    queryFn: fetchSymbols,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });
}
