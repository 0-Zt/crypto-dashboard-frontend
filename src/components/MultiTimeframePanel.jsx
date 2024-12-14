import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { API_URL } from '../config/api';

const intervals = ['4h', '1d']; // Puedes agregar más

function MultiTimeframePanel({ symbol }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      let results = {};
      for (const interval of intervals) {
        const res = await fetch(`${API_URL}/api/analysis/${symbol}?interval=${interval}`);
        const json = await res.json();
        results[interval] = json.analysis; 
      }
      setData(results);
    };
    if (symbol) {
      fetchAll();
    }
  }, [symbol]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Análisis en Múltiples Timeframes
      </Typography>
      <Grid container spacing={2}>
        {intervals.map(interval => {
          const analysis = data[interval];
          if (!analysis) return null;
          return (
            <Grid item xs={12} md={6} key={interval}>
              <Paper sx={{ p:2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Intervalo: {interval}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  Tendencia: {analysis.trend.replace('_',' ')}
                </Typography>
                <Typography variant="body2">
                  RSI: {analysis.indicators.rsi.value.toFixed(2)} ({analysis.indicators.rsi.value > 70 ? 'Sobrecomprado' : analysis.indicators.rsi.value < 30 ? 'Sobrevendido' : 'Neutral'})
                </Typography>
                <Typography variant="body2">
                  MACD: {analysis.indicators.macd.macd.toFixed(2)} 
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {analysis.analysis.summary}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default MultiTimeframePanel;
