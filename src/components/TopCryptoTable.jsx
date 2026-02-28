import React, { useState } from 'react';
import {
  Avatar,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Alert,
} from '@mui/material';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from './ui/card';
import { useTopCryptosQuery } from '../hooks/useMarketData';

const TopCryptoTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const { data: cryptoData = [], isLoading, error } = useTopCryptosQuery();

  if (isLoading) {
    return (
      <Card className="w-full p-6">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={220}>
          <CircularProgress sx={{ color: '#5cc8ff' }} />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full p-4">
        <Alert severity="error">Error al cargar datos de mercado.</Alert>
      </Card>
    );
  }

  return (
    <Card className="w-full p-3 md:p-5">
      <Typography variant="h6" component="h2" sx={{ color: 'text.primary', mb: 0.8 }}>
        Top Criptomonedas
      </Typography>
      <Typography sx={{ color: 'text.secondary', fontSize: 13, mb: 1.6 }}>
        Pares USDT ordenados por volumen en las últimas 24h.
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'text.secondary' }}>Rank</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Cripto</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>Precio</TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>
                Cambio 24h
              </TableCell>
              <TableCell align="right" sx={{ color: 'text.secondary' }}>
                Volumen 24h
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cryptoData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((crypto, index) => {
              const priceChangePercent = parseFloat(crypto.priceChangePercent);
              const isPositive = priceChangePercent >= 0;
              const rank = page * rowsPerPage + index + 1;
              return (
                <TableRow key={crypto.symbol} hover>
                  <TableCell sx={{ color: '#95a7d6' }}>#{rank}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <Avatar src={crypto.image} alt={crypto.name} sx={{ width: 28, height: 28, bgcolor: '#1b2543' }} />
                      <Box>
                        <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: 14 }}>{crypto.name}</Typography>
                        <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>USDT</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: 'text.primary' }}>
                    ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4, color: isPositive ? '#24d69a' : '#ff6d8a' }}>
                      {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {Math.abs(priceChangePercent).toFixed(2)}%
                    </Box>
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'text.primary' }}>
                    ${crypto.quoteVolume.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={cryptoData.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[6, 10, 25]}
        sx={{ color: 'text.secondary' }}
      />
    </Card>
  );
};

export default TopCryptoTable;
