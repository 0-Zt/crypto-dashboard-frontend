import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, FormControl, MenuItem, TextField, Autocomplete } from '@mui/material';
import TradingViewChart from './TradingViewChart';
import IndicatorsPanel from './IndicatorsPanel';
import TradingSuggestions from './TradingSuggestions';
import MultiTimeframepanel from './MultiTimeframepanel';
import { fetchApi } from '../config/api';

const timeframes = [
  { value: '1m', label: '1 minuto' },
  { value: '5m', label: '5 minutos' },
  { value: '15m', label: '15 minutos' },
  { value: '30m', label: '30 minutos' },
  { value: '1h', label: '1 hora' },
  { value: '4h', label: '4 horas' },
  { value: '1d', label: '1 día' },
];

function Dashboard() {
  const [symbol, setSymbol] = useState('BTCUSDT'); 
  const [symbols, setSymbols] = useState([]);
  const [timeframe, setTimeframe] = useState('1h');
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSymbols = async () => {
      try {
        const data = await fetchApi('/api/symbols');
        setSymbols(data.symbols);
        if (!symbol && data.symbols.length > 0) {
          const btc = data.symbols.find(s => s.symbol === 'BTCUSDT');
          if (btc) setSymbol('BTCUSDT');
        }
      } catch (err) {
        console.error('Error loading symbols:', err);
        setError('Error al cargar los símbolos. Por favor, intenta recargar la página.');
      }
    };

    loadSymbols();
  }, [symbol]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Filtros con diseño mejorado */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 3,
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          borderRadius: '12px',
          '&:hover': {
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
          },
        },
      }}>
        <Autocomplete
          options={symbols}
          getOptionLabel={(s) => `${s.baseAsset}/${s.quoteAsset}`}
          value={symbols.find(s => s.symbol === symbol) || null}
          onChange={(event, newValue) => {
            if (newValue) {
              setSymbol(newValue.symbol);
            } 
          }}
          sx={{ width: 200 }}
          renderInput={(params) => (
            <TextField 
              {...params} 
              label="Par de trading" 
              variant="outlined" 
              size="small"
            />
          )}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <TextField
            select
            value={timeframe}
            label="Timeframe"
            onChange={(e) => setTimeframe(e.target.value)}
            variant="outlined"
            size="small"
          >
            {timeframes.map((tf) => (
              <MenuItem key={tf.value} value={tf.value}>
                {tf.label}
              </MenuItem>
            ))}
          </TextField>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {/* Gráfico principal con altura ajustada */}
        <Grid item xs={12} lg={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2, 
              height: '700px',
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              '&:hover': {
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <TradingViewChart symbol={symbol} timeframe={timeframe} />
          </Paper>
        </Grid>

        {/* Panel de indicadores y sugerencias */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  '&:hover': {
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <IndicatorsPanel symbol={symbol} timeframe={timeframe} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  '&:hover': {
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <TradingSuggestions symbol={symbol} timeframe={timeframe} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Panel de múltiples timeframes */}
      <Box sx={{ mt: 3 }}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            '&:hover': {
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          <MultiTimeframepanel symbol={symbol} />
        </Paper>
      </Box>
      {error && (
        <Box sx={{ 
          mt: 2, 
          p: 2, 
          borderRadius: '12px', 
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          {error}
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
