import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { Card, CardContent } from './ui/card';
import {
  Activity,
  BarChart2,
} from 'lucide-react';
import { getAnalysisTimeframe } from '../utils/timeframeUtils';
import { useAnalysis } from '../hooks/useAnalysis';

const IndicatorsPanel = ({ symbol, timeframe }) => {
  const { data, isLoading: loading, error } = useAnalysis(symbol, timeframe);
  const analysisData = data?.analysis || null;

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
        <CardContent className="p-6 space-y-3">
          <Skeleton variant="text" width={160} height={32} sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} variant="rounded" height={28} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <Box sx={{ color: 'error.main', p: 2, textAlign: 'center' }}>
            Error: {error?.message || 'No se pudo cargar el análisis'}
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
      macd: { macd, signal, analysis: macdAnalysis },
      ema: { ema21, ema50, ema200 },
      bollinger_bands: { upper, middle, lower, analysis: bbAnalysis }
    }
  } = analysisData;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#eef2ff]">Indicators</h2>
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
