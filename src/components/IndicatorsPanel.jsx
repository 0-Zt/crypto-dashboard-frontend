import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CardContent,
  Card
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import SpeedIcon from '@mui/icons-material/Speed';
import BarChartIcon from '@mui/icons-material/BarChart';
import { API_URL } from '../config/api';

const IndicatorsPanel = ({ symbol, timeframe = '1h' }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        // URL completa al backend
        const response = await fetch(`${API_URL}/api/analysis/${symbol}?interval=${timeframe}`);
        if (!response.ok) {
          throw new Error('Error al obtener el análisis');
        }
        const data = await response.json();
        // Guardamos sólo el análisis interno
        setAnalysis(data.analysis);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchAnalysis();
    }
  }, [symbol, timeframe]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!analysis) return null;

  const {
    trend,
    indicators,
    analysis: detailAnalysis
  } = analysis;

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'STRONG_BULLISH':
      case 'BULLISH':
        return 'success.main';
      case 'STRONG_BEARISH':
      case 'BEARISH':
        return 'error.main';
      default:
        return 'warning.main';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'STRONG_BULLISH':
      case 'BULLISH':
        return <TrendingUpIcon color="success" />;
      case 'STRONG_BEARISH':
      case 'BEARISH':
        return <TrendingDownIcon color="error" />;
      default:
        return <ShowChartIcon color="warning" />;
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getTrendIcon(trend)} Análisis de {symbol}
        </Typography>
        <Typography variant="body1" color={getTrendColor(trend)} sx={{ fontWeight: 'bold' }}>
          Tendencia: {trend.replace('_', ' ')}
        </Typography>
      </Paper>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon />
            <Typography variant="subtitle1">Análisis de Tendencia</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {detailAnalysis.summary}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShowChartIcon />
            <Typography variant="subtitle1">Análisis de Bandas de Bollinger</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1">
            {detailAnalysis.bollinger}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Banda Superior: ${indicators.bollinger_bands.upper.toFixed(8).replace(/\.?0+$/, '')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Banda Media: ${indicators.bollinger_bands.middle.toFixed(8).replace(/\.?0+$/, '')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Banda Inferior: ${indicators.bollinger_bands.lower.toFixed(8).replace(/\.?0+$/, '')}
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SpeedIcon />
            <Typography variant="subtitle1">Análisis de RSI</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {detailAnalysis.rsi}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            RSI Actual: {indicators.rsi.value.toFixed(2)}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BarChartIcon />
            <Typography variant="subtitle1">MACD</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" paragraph>
            {detailAnalysis.macd}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Precio Actual
              </Typography>
              <Typography variant="h6" color="primary">
                ${analysis.price.value.toFixed(8).replace(/\.?0+$/, '')}
              </Typography>

              <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
                EMAs
              </Typography>
              <Typography variant="body2">
                EMA 21: ${indicators.ema.ema21.toFixed(8).replace(/\.?0+$/, '')}
              </Typography>
              <Typography variant="body2">
                EMA 50: ${indicators.ema.ema50.toFixed(8).replace(/\.?0+$/, '')}
              </Typography>
              <Typography variant="body2">
                EMA 200: ${indicators.ema.ema200.toFixed(8).replace(/\.?0+$/, '')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                RSI
              </Typography>
              <Typography variant="body2">
                Valor: {indicators.rsi.value.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {indicators.rsi.value > 70 ? 'Sobrecomprado' :
                 indicators.rsi.value < 30 ? 'Sobrevendido' : 'Neutral'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                MACD
              </Typography>
              <Typography variant="body2">
                MACD: {indicators.macd.macd.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Señal: {indicators.macd.signal.toFixed(2)}
              </Typography>
              <Typography variant="body2">
                Histograma: {indicators.macd.histogram.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Bandas de Bollinger
              </Typography>
              <Typography variant="body2">
                Superior: ${indicators.bollinger_bands.upper.toFixed(8).replace(/\.?0+$/, '')}
              </Typography>
              <Typography variant="body2">
                Media: ${indicators.bollinger_bands.middle.toFixed(8).replace(/\.?0+$/, '')}
              </Typography>
              <Typography variant="body2">
                Inferior: ${indicators.bollinger_bands.lower.toFixed(8).replace(/\.?0+$/, '')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default IndicatorsPanel;
