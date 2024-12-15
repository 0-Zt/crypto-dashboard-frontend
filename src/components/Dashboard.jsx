import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, FormControl, MenuItem, TextField, Autocomplete } from '@mui/material';
import TradingViewChart from './TradingViewChart';
import IndicatorsPanel from './IndicatorsPanel';
import TradingSuggestions from './TradingSuggestions';
import MultiTimeframepanel from './MultiTimeframepanel';
import { fetchApi } from '../config/api';

const timeframes = [
  { value: '1', label: '1 minuto' },
  { value: '5', label: '5 minutos' },
  { value: '15', label: '15 minutos' },
  { value: '30', label: '30 minutos' },
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
      {/* Filtros arriba del contenido */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
            <TextField {...params} label="Par de trading" variant="outlined" size="small" />
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
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, height: '600px' }}>
            <TradingViewChart symbol={symbol} timeframe={timeframe} />
          </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <IndicatorsPanel symbol={symbol} timeframe={timeframe} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <TradingSuggestions symbol={symbol} timeframe={timeframe} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Panel de múltiples timeframes abajo */}
      <Box sx={{ mt: 3 }}>
        <MultiTimeframepanel symbol={symbol} />
      </Box>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </Box>
  );
}

export default Dashboard;
