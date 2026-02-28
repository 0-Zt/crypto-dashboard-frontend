import { useQuery } from '@tanstack/react-query';
import { API_URL } from '../config/api';

async function fetchCypherSignal(symbol) {
  const response = await fetch(`${API_URL}/api/cypher/${symbol}`);
  if (!response.ok) throw new Error(`Cypher error: ${response.status}`);
  return response.json();
}

export function useCypherSignal(symbol) {
  return useQuery({
    queryKey: ['cypher-signal', symbol],
    queryFn: () => fetchCypherSignal(symbol),
    enabled: Boolean(symbol),
    refetchInterval: 60_000,
    staleTime: 20_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
