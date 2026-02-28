import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { Card } from './ui/card';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { useAnalysis } from '../hooks/useAnalysis';

const TradingSuggestions = ({ symbol, timeframe }) => {
  const { data, isLoading: loading, error } = useAnalysis(symbol, timeframe);
  const suggestion = data?.suggestion || {
    type: 'NEUTRAL',
    message: 'No hay señal clara de trading en este momento',
    confidence: 0,
    risk: 'N/A',
  };

  if (loading) {
    return (
      <Card className="p-5 border border-[#33466f]/40 space-y-3">
        <Skeleton variant="text" width={180} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="rounded" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
        ))}
      </Card>
    );
  }

  if (error) {
    return (
      <Box sx={{ color: 'error.main', p: 2, textAlign: 'center' }}>
        {error?.message || 'Error loading trading suggestion'}
      </Box>
    );
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'LONG':
        return 'text-emerald-500';
      case 'SHORT':
        return 'text-rose-500';
      default:
        return 'text-amber-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'LONG':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'SHORT':
        return <TrendingDown className="w-5 h-5 text-rose-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <Typography variant="h6" sx={{ color: '#eef2ff', mb: 1 }}>
        Trading Suggestions
      </Typography>

      <Card className="p-5 border border-[#33466f]/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            <span className="text-slate-200">Signal</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getTypeColor(suggestion.type)} bg-slate-800/50`}>
            {getTypeIcon(suggestion.type)}
            <span className="text-sm font-medium">{suggestion.type}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm text-slate-300">
            {suggestion.message}
          </div>

          {suggestion.type !== 'NEUTRAL' && (
            <>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Confidence</span>
                <span className="text-slate-200">{suggestion.confidence}%</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Signal Score</span>
                <span className="text-slate-200">{suggestion.signalScore ?? '-'} / 100</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Market Regime</span>
                <span className="text-slate-200">{suggestion.regime || 'N/A'}</span>
              </div>

              {suggestion.riskReward && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">R:R (target1)</span>
                  <span className="text-slate-200">{suggestion.riskReward}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Risk Level</span>
                <span className="text-slate-200">{suggestion.risk}</span>
              </div>

              {suggestion.entry && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Entry Price</span>
                  <span className="text-slate-200">${suggestion.entry}</span>
                </div>
              )}

              {suggestion.stopLoss && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Stop Loss</span>
                  <span className="text-rose-500">${suggestion.stopLoss}</span>
                </div>
              )}

              {suggestion.targets && suggestion.targets.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm text-slate-400">Targets:</span>
                  {suggestion.targets.map((target, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Target {index + 1}</span>
                      <span className="text-emerald-500">${target}</span>
                    </div>
                  ))}
                </div>
              )}

              {Array.isArray(suggestion.reasons) && suggestion.reasons.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-sm text-slate-400">Why this signal:</span>
                  {suggestion.reasons.map((reason, idx) => (
                    <div key={idx} className="text-xs text-slate-300">• {reason}</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TradingSuggestions;
