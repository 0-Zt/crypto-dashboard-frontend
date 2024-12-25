import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { API_URL } from '../config/api';
import { Card } from './ui/card';
import { LineChart, TrendingUp, TrendingDown } from 'lucide-react';

// Keep using hour and day formats for multi-timeframe analysis
const intervals = ['4h', '1d'];  // These timeframes work well for longer-term analysis

function MultiTimeframepanel({ symbol }) {
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

  const getTrendColor = (trend) => {
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
    switch (trend) {
      case 'STRONG_BULLISH':
      case 'BULLISH':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'STRONG_BEARISH':
      case 'BEARISH':
        return <TrendingDown className="w-5 h-5 text-rose-500" />;
      default:
        return <LineChart className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <Box>
      <div className="flex items-center gap-2 mb-6">
        <LineChart className="w-6 h-6 text-indigo-500" />
        <Typography variant="h6" className="text-slate-200">
          Análisis en Múltiples Timeframes
        </Typography>
      </div>
      <Grid container spacing={2}>
        {intervals.map(interval => {
          const analysis = data[interval];
          if (!analysis) return null;
          return (
            <Grid item xs={12} md={6} key={interval}>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-indigo-500" />
                    <Typography variant="subtitle1" className="text-slate-200">
                      Intervalo: {interval}
                    </Typography>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getTrendColor(analysis.trend)} bg-slate-800/50`}>
                    {getTrendIcon(analysis.trend)}
                    <span className="text-sm font-medium">
                      {analysis.trend?.replace('_', ' ') || 'NEUTRAL'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">RSI</span>
                    <span className="text-slate-200">
                      {analysis.indicators.rsi.value.toFixed(2)}
                      <span className="ml-2 text-xs">
                        ({analysis.indicators.rsi.value > 70 ? 'Sobrecomprado' : 
                          analysis.indicators.rsi.value < 30 ? 'Sobrevendido' : 'Neutral'})
                      </span>
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">MACD</span>
                    <span className={analysis.indicators.macd.macd >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                      {analysis.indicators.macd.macd.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-slate-800/30">
                    <Typography variant="body2" className="text-slate-300">
                      {analysis.analysis.summary}
                    </Typography>
                  </div>
                </div>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default MultiTimeframepanel;
