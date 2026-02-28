import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { Card } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useMultiTimeframeAnalysis } from '../hooks/useAnalysis';

const MultiTimeframePanel = ({ symbol }) => {
  const { timeframes, analysisByTimeframe: analysis, isLoading: loading, isError: error } = useMultiTimeframeAnalysis(symbol);

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} variant="rounded" height={42} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 2, textAlign: 'center' }}>
        {error}
      </Box>
    );
  }

  const getTrendColor = (trend) => {
    if (!trend) return 'text-slate-400';
    switch (trend) {
      case 'STRONG_BULLISH':
      case 'BULLISH':
        return 'text-emerald-500';
      case 'STRONG_BEARISH':
      case 'BEARISH':
        return 'text-rose-500';
      default:
        return 'text-amber-500';
    }
  };

  const getTrendIcon = (trend) => {
    if (!trend) return <TrendingUp className="w-4 h-4 text-slate-400" />;
    switch (trend) {
      case 'STRONG_BULLISH':
      case 'BULLISH':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'STRONG_BEARISH':
      case 'BEARISH':
        return <TrendingDown className="w-4 h-4 text-rose-500" />;
      default:
        return <TrendingUp className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <Typography variant="h6" sx={{ color: '#eef2ff', mb: 1 }}>
        Multi Timeframe Analysis
      </Typography>
      
      <div className="grid gap-2">
        {timeframes.map((tf) => (
          <Card key={tf} className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-200">{tf}</span>
              </div>
              {analysis[tf] ? (
                <div className="flex items-center gap-2">
                  {getTrendIcon(analysis[tf].trend)}
                  <span className={`text-sm font-medium ${getTrendColor(analysis[tf].trend)}`}>
                    {analysis[tf].trend?.replace('_', ' ') || 'NEUTRAL'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-400">LOADING</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MultiTimeframePanel;
