import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { API_URL } from '../config/api';
import { Card } from './ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d'];

const MultiTimeframePanel = ({ symbol }) => {
  const [analysis, setAnalysis] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMultiTimeframeAnalysis = async () => {
      if (!symbol) return;
      
      setLoading(true);
      try {
        // Obtener análisis para cada timeframe individualmente
        const analysisPromises = TIMEFRAMES.map(async (timeframe) => {
          const response = await fetch(`${API_URL}/api/analysis/${symbol}?interval=${timeframe}`);
          if (!response.ok) {
            throw new Error(`Error fetching analysis for ${timeframe}`);
          }
          const data = await response.json();
          return [timeframe, data.analysis];
        });

        const results = await Promise.allSettled(analysisPromises);
        const analysisData = {};
        
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const [timeframe, data] = result.value;
            analysisData[timeframe] = data;
          } else {
            console.error(`Error fetching ${TIMEFRAMES[index]}:`, result.reason);
          }
        });

        setAnalysis(analysisData);
        setError(null);
      } catch (err) {
        console.error('Error fetching multi-timeframe analysis:', err);
        setError('Error loading analysis');
      } finally {
        setLoading(false);
      }
    };

    fetchMultiTimeframeAnalysis();
  }, [symbol]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
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
        {TIMEFRAMES.map((tf) => (
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
