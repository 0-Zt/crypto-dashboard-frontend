import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  TablePagination,
} from '@mui/material';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from './ui/card';

const TopCryptoTable = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  useEffect(() => {
    const fetchTopCryptos = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de Binance
        const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const binanceData = await binanceResponse.json();
        
        // Filtrar y ordenar por volumen en USD
        const usdtPairs = binanceData
          .filter(pair => pair.symbol.endsWith('USDT'))
          .map(crypto => {
            const price = parseFloat(crypto.lastPrice);
            const volume = parseFloat(crypto.volume);
            const quoteVolume = parseFloat(crypto.quoteVolume); // Volumen en USDT
            return {
              ...crypto,
              name: crypto.symbol.replace('USDT', ''),
              image: `https://lcw.nyc3.cdn.digitaloceanspaces.com/production/currencies/64/${crypto.symbol.replace('USDT', '').toLowerCase()}.png`,
              price,
              volume,
              quoteVolume
            };
          })
          .sort((a, b) => b.quoteVolume - a.quoteVolume)
          .slice(0, 25); // Tomar los top 25 para tener suficientes para la paginación
        
        setCryptoData(usdtPairs);
      } catch (err) {
        setError('Error al cargar datos');
        console.error('Error fetching crypto data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopCryptos();
    const interval = setInterval(fetchTopCryptos, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Card className="w-full h-[300px] overflow-hidden bg-[#0f0f0f]">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <CircularProgress sx={{ color: '#00f2ea' }} />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full h-[300px] overflow-hidden bg-[#0f0f0f]">
        <Box p={2} textAlign="center">
          <Typography color="error">{error}</Typography>
        </Box>
      </Card>
    );
  }

  return (
    <div className="w-full mt-3">
      <Card className="w-full p-3 md:p-5">
        <div className="flex flex-col space-y-4">
          <Typography variant="h6" component="h2" className="text-lg font-semibold text-[#eef2ff] mb-2">
            Top Criptomonedas
          </Typography>
          <Typography sx={{ color: '#9fb0db', fontSize: 13 }}>
            Pares USDT ordenados por volumen en las últimas 24h
          </Typography>
        </div>
        
        <div className="overflow-y-auto px-4 pb-4">
          <table className="w-full mt-2">
            <thead className="sticky top-0 bg-[#0f1629] border-b border-[#253354]">
              <tr className="text-left">
                <th className="py-3 text-sm font-medium text-[#95a7d6]">Ranking</th>
                <th className="py-3 text-sm font-medium text-[#95a7d6]">Cripto</th>
                <th className="py-3 text-sm font-medium text-[#95a7d6]">Precio</th>
                <th className="py-3 text-sm font-medium text-[#95a7d6] text-right">Cambio 24h</th>
                <th className="py-3 text-sm font-medium text-[#95a7d6] text-right">Volumen 24h</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#253354]">
              {cryptoData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((crypto, index) => {
                  const priceChangePercent = parseFloat(crypto.priceChangePercent);
                  const isPositive = priceChangePercent >= 0;
                  const rank = page * rowsPerPage + index + 1;
                  
                  return (
                    <tr key={crypto.symbol} className="hover:bg-[#18213a] transition-colors">
                      <td className="py-3 text-[#95a7d6] w-16">#{rank}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1b2543] flex items-center justify-center overflow-hidden">
                            <img
                              src={crypto.image}
                              alt={crypto.name}
                              className="w-6 h-6"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSIxNiIgZmlsbD0iIzE5MWIxRiIvPjxwYXRoIGQ9Ik0yMS4xNjkgMTYuOTk1YzAgMC43Mi0wLjI1MiAxLjMyOS0wLjc1NiAxLjgyNy0wLjUwNCAwLjQ5OC0xLjExNiAwLjc0Ny0xLjgzNyAwLjc0N2gtMS4yOTh2Mi40MzFoLTIuNTU2di04LjAwMWgzLjg1NGMwLjcyIDAgMS4zMzMgMC4yNDkgMS44MzcgMC43NDcgMC41MDQgMC40OTggMC43NTYgMS4xMDcgMC43NTYgMS44Mjd2MC40MjJ6TTE4LjU3NiAxNi41NzNWMTUuNzNoLTEuMjk4djEuNjg0aDEuMjk4di0wLjg0MXoiIGZpbGw9IiM5OTk5OTkiLz48L3N2Zz4=';
                              }}
                            />
                          </div>
                          <div>
                            <div className="text-base font-medium text-white">{crypto.name}</div>
                            <div className="text-sm text-gray-400">USDT</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="text-base text-white">
                          ${crypto.price.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 8
                          })}
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className={`inline-flex items-center gap-1 text-base ${
                          isPositive ? 'text-[#35e8ff]' : 'text-[#ff6d8a]'
                        }`}>
                          {isPositive ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                          {Math.abs(priceChangePercent).toFixed(2)}%
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="text-base text-white">
                          ${crypto.quoteVolume.toLocaleString(undefined, {
                            maximumFractionDigits: 0
                          })}
                        </div>
                      </td>
                    </tr>
                  );
              })}
            </tbody>
          </table>
        </div>
        
        <TablePagination
          component="div"
          count={cryptoData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[6, 10, 25]}
          sx={{
            color: 'white',
            '.MuiTablePagination-select': {
              color: 'white'
            },
            '.MuiTablePagination-selectIcon': {
              color: 'white'
            },
            '.MuiTablePagination-displayedRows': {
              color: 'white'
            },
            '.MuiIconButton-root': {
              color: 'white'
            }
          }}
        />
      </Card>
    </div>
  );
};

export default TopCryptoTable;
