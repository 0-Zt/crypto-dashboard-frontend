import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { API_URL } from '../config/api';
import { Card, CardContent } from './ui/card';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart2,
  Waves,
} from 'lucide-react';
import { getAnalysisTimeframe } from '../utils/timeframeUtils';

const IndicatorsPanel = ({ symbol, timeframe }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!symbol) return;
      
      setLoading(true);
      setError(null);
      try {
        // Convertir el timeframe al formato correcto para el análisis
        const analysisTimeframe = getAnalysisTimeframe(timeframe);
        console.log('Fetching analysis for:', symbol, 'with timeframe:', analysisTimeframe);
        
        const response = await fetch(`${API_URL}/api/analysis/${symbol}?interval=${analysisTimeframe}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Analysis response:', data);
        
        if (!data || !data.analysis || !data.analysis.indicators) {
          throw new Error('Invalid data structure');
        }
        
        setAnalysisData(data.analysis);
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [symbol, timeframe]);

  const formatNumber = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '0.00';
    return Number(value).toFixed(2);
  };

  const formatPrice = (value) => {
    if (value === undefined || value === null || isNaN(value)) return '$0.00';
    return `$${Number(value).toFixed(2)}`;
  };

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
        return <TrendingUp className="w-5 h-5 text-amber-500" />;
    }
  };

  const getRsiColor = (value) => {
    const rsi = Number(value);
    if (isNaN(rsi)) return 'text-slate-400';
    if (rsi > 70) return 'text-rose-500';
    if (rsi < 30) return 'text-emerald-500';
    return 'text-slate-400';
  };

  const getMacdColor = (value) => {
    const macd = Number(value);
    if (isNaN(macd)) return 'text-slate-400';
    return macd >= 0 ? 'text-emerald-500' : 'text-rose-500';
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
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
          <Box sx={{ color: 'error.main', p: 2, textAlign: 'center' }}>
            Error: {error}
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Box sx={{ p: 2, textAlign: 'center' }}>
            No analysis data available
          </Box>
        </CardContent>
      </Card>
    );
  }

  const {
    trend,
    indicators: {
      rsi: { value: rsiValue, analysis: rsiAnalysis },
      macd: { macd, signal, histogram, analysis: macdAnalysis },
      ema: { ema21, ema50, ema200 },
      bollinger_bands: { upper, middle, lower, analysis: bbAnalysis }
    }
  } = analysisData;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-white">Indicators</h2>
          <span className={`text-sm px-3 py-1 rounded-full ${getTrendColor(trend)}`}>
            {trend?.replace('_', ' ') || 'NEUTRAL'}
          </span>
        </div>

        <div className="space-y-6">
          {/* RSI */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="text-base font-medium text-white">RSI ({getAnalysisTimeframe(timeframe)})</span>
              </div>
              <span className={`text-base text-white ${getRsiColor(rsiValue)}`}>
                {formatNumber(rsiValue)}
              </span>
            </div>
            <p className="text-sm text-gray-400">{rsiAnalysis}</p>
          </div>

          {/* MACD */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-500" />
                <span className="text-base font-medium text-white">MACD</span>
              </div>
              <div className="text-right">
                <div className={`text-base text-white ${getMacdColor(macd)}`}>
                  {formatNumber(macd)}
                </div>
                <div className="text-sm text-gray-400">Signal: {formatNumber(signal)}</div>
              </div>
            </div>
            <p className="text-sm text-gray-400">{macdAnalysis}</p>
          </div>

          {/* EMAs */}
          <div className="space-y-2">
            <h3 className="text-base font-medium text-white mb-3">EMAs</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-400">EMA 21</div>
                <div className="text-base text-white">{formatPrice(ema21)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-400">EMA 50</div>
                <div className="text-base text-white">{formatPrice(ema50)}</div>
              </div>
              <div className="space-y-1">
                <div className="text-sm text-gray-400">EMA 200</div>
                <div className="text-base text-white">{formatPrice(ema200)}</div>
              </div>
            </div>
          </div>

          {/* Bollinger Bands */}
          <div className="space-y-2">
            <h3 className="text-base font-medium text-white mb-3">Bollinger Bands</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Upper</span>
                <span className="text-base text-white">{formatPrice(upper)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Middle</span>
                <span className="text-base text-white">{formatPrice(middle)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Lower</span>
                <span className="text-base text-white">{formatPrice(lower)}</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">{bbAnalysis}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndicatorsPanel;
