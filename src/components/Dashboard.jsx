import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, FormControl, InputLabel, MenuItem, TextField } from '@mui/material';
import { Autocomplete } from '@mui/material';
import TradingViewChart from './TradingViewChart';
import IndicatorsPanel from './IndicatorsPanel';
import TradingSuggestions from './TradingSuggestions';
import MultiTimeframePanel from './MultiTimeframePanel';
import { API_URL } from '../config/api';

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
  const [symbol, setSymbol] = useState('');
  const [symbols, setSymbols] = useState([]);
  const [timeframe, setTimeframe] = useState('1h');

  useEffect(() => {
    fetch(`${API_URL}/api/symbols`)
      .then(res => res.json())
      .then(data => {
        setSymbols(data.symbols);
      })
      .catch(err => console.error(err));
  }, []);

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
        <MultiTimeframePanel symbol={symbol} />
      </Box>
    </Box>
  );
}

export default Dashboard;
