import React, { useState, useEffect } from 'react';
import { Box, Grid, Container, Paper } from '@mui/material';
import TradingViewChart from './TradingViewChart';
import IndicatorsPanel from './IndicatorsPanel';
import { API_URL } from '../config/api';

export default function TradingDashboard() {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        // URL completa al backend
        const response = await fetch(`${API_URL}/api/analysis/${symbol}`);
        if (!response.ok) {
          throw new Error('Error al obtener el análisis');
        }
        const data = await response.json();
        setAnalysis(data);
      } catch (error) {
        console.error('Error fetching analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [symbol]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3}>
            <TradingViewChart symbol={symbol} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <IndicatorsPanel symbol={symbol} loading={loading} />
        </Grid>
      </Grid>
    </Container>
  );
}
