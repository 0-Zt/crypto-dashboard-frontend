import React from 'react';
import { Alert, Box, Chip, CircularProgress, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';
import { useAnalysisQuery } from '../hooks/useMarketData';

const TradingSuggestions = ({ symbol, timeframe }) => {
  const { data, isLoading, error } = useAnalysisQuery(symbol, timeframe);
  const suggestion =
    data?.suggestion || {
      type: 'NEUTRAL',
      message: 'No hay señal clara de trading en este momento',
      confidence: 0,
      risk: 'N/A',
    };

  if (isLoading) {
    return (
      <Card className="p-5">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4">
        <Alert severity="error">Error cargando sugerencias de trading.</Alert>
      </Card>
    );
  }

  const chipColor = suggestion.type === 'LONG' ? 'success' : suggestion.type === 'SHORT' ? 'error' : 'warning';
  const icon = suggestion.type === 'LONG' ? <TrendingUp size={16} /> : suggestion.type === 'SHORT' ? <TrendingDown size={16} /> : <AlertTriangle size={16} />;

  return (
    <Box>
      <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
        Trading Suggestions
      </Typography>
      <Card className="p-5">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Target size={16} color="#8a7dff" />
            <Typography sx={{ color: 'text.primary' }}>Signal</Typography>
          </Box>
          <Chip icon={icon} label={suggestion.type} color={chipColor} size="small" />
        </Box>

        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
          {suggestion.message}
        </Typography>

        {suggestion.type !== 'NEUTRAL' && (
          <Box sx={{ display: 'grid', gap: 0.8 }}>
            <Typography sx={{ color: 'text.secondary' }}>Confidence: <Box component="span" sx={{ color: 'text.primary' }}>{suggestion.confidence}%</Box></Typography>
            <Typography sx={{ color: 'text.secondary' }}>Risk Level: <Box component="span" sx={{ color: 'text.primary' }}>{suggestion.risk}</Box></Typography>
            {suggestion.entry && <Typography sx={{ color: 'text.secondary' }}>Entry: <Box component="span" sx={{ color: 'text.primary' }}>${suggestion.entry}</Box></Typography>}
            {suggestion.stopLoss && <Typography sx={{ color: '#ff6b87' }}>Stop Loss: ${suggestion.stopLoss}</Typography>}
            {suggestion.targets?.map((target, idx) => (
              <Typography key={idx} sx={{ color: '#24d69a' }}>Target {idx + 1}: ${target}</Typography>
            ))}
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default TradingSuggestions;
