import React from 'react';
import { Alert, Box, Chip, CircularProgress, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './ui/card';
import { useMultiTimeframeAnalysisQuery } from '../hooks/useMarketData';

const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d'];

const MultiTimeframePanel = ({ symbol }) => {
  const { data: analysis = {}, isLoading, error } = useMultiTimeframeAnalysisQuery(symbol, TIMEFRAMES);

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
        <Alert severity="error">Error loading analysis.</Alert>
      </Card>
    );
  }

  const getTrendColor = (trend) => {
    if (['STRONG_BULLISH', 'BULLISH'].includes(trend)) return 'success';
    if (['STRONG_BEARISH', 'BEARISH'].includes(trend)) return 'error';
    return 'warning';
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ color: 'text.primary', mb: 1 }}>
        Multi Timeframe Analysis
      </Typography>
      <Box sx={{ display: 'grid', gap: 1 }}>
        {TIMEFRAMES.map((tf) => {
          const trend = analysis[tf]?.trend;
          return (
            <Card key={tf} className="p-3">
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>{tf}</Typography>
                {trend ? (
                  <Chip
                    size="small"
                    color={getTrendColor(trend)}
                    icon={['STRONG_BEARISH', 'BEARISH'].includes(trend) ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                    label={trend.replace('_', ' ')}
                  />
                ) : (
                  <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>N/A</Typography>
                )}
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default MultiTimeframePanel;
