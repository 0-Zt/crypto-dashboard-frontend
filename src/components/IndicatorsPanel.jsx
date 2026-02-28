import React from 'react';
import { Alert, Box, CircularProgress, Chip, Divider, Typography } from '@mui/material';
import { Activity, BarChart2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { getAnalysisTimeframe } from '../utils/timeframeUtils';
import { useAnalysisQuery } from '../hooks/useMarketData';

const IndicatorsPanel = ({ symbol, timeframe }) => {
  const analysisTimeframe = getAnalysisTimeframe(timeframe);
  const { data, isLoading, error } = useAnalysisQuery(symbol, analysisTimeframe);

  const analysisData = data?.analysis;

  const formatNumber = (value) => (value === undefined || value === null || Number.isNaN(Number(value)) ? '0.00' : Number(value).toFixed(2));
  const formatPrice = (value) => (value === undefined || value === null || Number.isNaN(Number(value)) ? '$0.00' : `$${Number(value).toFixed(2)}`);

  const trendColor = (trend) => {
    if (['STRONG_BULLISH', 'BULLISH'].includes(trend)) return 'success';
    if (['STRONG_BEARISH', 'BEARISH'].includes(trend)) return 'error';
    return 'warning';
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Alert severity="error">Error cargando indicadores.</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData?.indicators) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Typography color="text.secondary">No hay datos de análisis disponibles.</Typography>
        </CardContent>
      </Card>
    );
  }

  const {
    trend,
    indicators: {
      rsi: { value: rsiValue, analysis: rsiAnalysis },
      macd: { macd, signal, analysis: macdAnalysis },
      ema: { ema21, ema50, ema200 },
      bollinger_bands: { upper, middle, lower, analysis: bbAnalysis },
    },
  } = analysisData;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.4, alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Indicators
          </Typography>
          <Chip size="small" color={trendColor(trend)} label={trend?.replace('_', ' ') || 'NEUTRAL'} />
        </Box>

        <Box sx={{ display: 'grid', gap: 2.2 }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Activity size={16} color="#5cc8ff" />
                <Typography sx={{ color: 'text.primary' }}>RSI ({analysisTimeframe})</Typography>
              </Box>
              <Typography sx={{ color: 'text.primary' }}>{formatNumber(rsiValue)}</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{rsiAnalysis}</Typography>
          </Box>

          <Divider sx={{ borderColor: 'divider' }} />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BarChart2 size={16} color="#8a7dff" />
                <Typography sx={{ color: 'text.primary' }}>MACD</Typography>
              </Box>
              <Typography sx={{ color: 'text.primary' }}>{formatNumber(macd)} / {formatNumber(signal)}</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>{macdAnalysis}</Typography>
          </Box>

          <Divider sx={{ borderColor: 'divider' }} />

          <Typography sx={{ color: 'text.secondary' }}>EMA 21: {formatPrice(ema21)} · EMA 50: {formatPrice(ema50)} · EMA 200: {formatPrice(ema200)}</Typography>
          <Typography sx={{ color: 'text.secondary' }}>BB Upper: {formatPrice(upper)} · Mid: {formatPrice(middle)} · Low: {formatPrice(lower)}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>{bbAnalysis}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default IndicatorsPanel;
