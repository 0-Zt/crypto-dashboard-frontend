import { useQuery } from '@tanstack/react-query';

async function fetchTopCryptos() {
  const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
  if (!response.ok) throw new Error(`Binance ticker error: ${response.status}`);
  const binanceData = await response.json();

  return binanceData
    .filter((pair) => pair.symbol.endsWith('USDT'))
    .map((crypto) => ({
      ...crypto,
      name: crypto.symbol.replace('USDT', ''),
      image: `https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/${crypto.symbol
        .replace('USDT', '')
        .toLowerCase()}.png`,
      price: parseFloat(crypto.lastPrice),
      volume: parseFloat(crypto.volume),
      quoteVolume: parseFloat(crypto.quoteVolume),
    }))
    .sort((a, b) => b.quoteVolume - a.quoteVolume)
    .slice(0, 50);
}

export function useTopCryptos() {
  return useQuery({
    queryKey: ['top-cryptos'],
    queryFn: fetchTopCryptos,
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
    staleTime: 10_000,
    retry: 2,
  });
}
