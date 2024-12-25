import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Card } from './ui/card';
import { TrendingUp, TrendingDown, LineChart } from 'lucide-react';
import { API_URL } from '../config/api';
import { getAnalysisTimeframe } from '../utils/timeframeUtils';

function TradingSuggestions({ symbol = 'BTCUSDT', timeframe = '1h' }) {
  const [suggestion, setSuggestion] = useState(null);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const analysisTimeframe = getAnalysisTimeframe(timeframe);
        const response = await fetch(`${API_URL}/api/analysis/${symbol}?interval=${analysisTimeframe}`);
        const data = await response.json();
        setSuggestion(data.suggestion);
        console.log('Suggestion data:', data.suggestion); // Para debug
      } catch (error) {
        console.error('Error fetching suggestion:', error);
        setSuggestion(null);
      }
    };

    if (symbol) {
      fetchSuggestion();
    }
  }, [symbol, timeframe]);

  const getSignalColor = (type) => {
    switch (type) {
      case 'LONG':
        return {
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-400',
          border: 'border-emerald-500/20'
        };
      case 'SHORT':
        return {
          bg: 'bg-rose-500/10',
          text: 'text-rose-400',
          border: 'border-rose-500/20'
        };
      default:
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          border: 'border-amber-500/20'
        };
    }
  };

  const getSignalIcon = (type) => {
    switch (type) {
      case 'LONG':
        return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'SHORT':
        return <TrendingDown className="w-5 h-5 text-rose-400" />;
      default:
        return <LineChart className="w-5 h-5 text-amber-400" />;
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return price.toFixed(8).replace(/\.?0+$/, '');
  };

  if (!suggestion || suggestion.type === 'NEUTRAL') {
    return (
      <Box>
        <div className="flex items-center gap-2 mb-6">
          <LineChart className="w-6 h-6 text-indigo-500" />
          <Typography variant="h6" className="text-slate-200">
            Sugerencias de Trading
          </Typography>
        </div>
        <Card className="p-4 border border-amber-500/20 bg-amber-500/10">
          <div className="flex items-center gap-2">
            <LineChart className="w-5 h-5 text-amber-400" />
            <Typography variant="body1" className="text-slate-200">
              No hay sugerencias de trading disponibles en este momento.
            </Typography>
          </div>
        </Card>
      </Box>
    );
  }

  const colors = getSignalColor(suggestion.type);

  return (
    <Box>
      <div className="flex items-center gap-2 mb-6">
        <LineChart className="w-6 h-6 text-indigo-500" />
        <Typography variant="h6" className="text-slate-200">
          Sugerencias de Trading
        </Typography>
      </div>
      <Card className={`p-4 border ${colors.border} ${colors.bg}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {getSignalIcon(suggestion.type)}
            <Typography variant="subtitle1" className="text-slate-200">
              Señal: {suggestion.type === 'LONG' ? 'COMPRA' : 'VENTA'}
            </Typography>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg} ${colors.text}`}>
            <span className="text-sm font-medium">
              Confianza: {suggestion.confidence}%
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Precio de Entrada</span>
            <span className="text-slate-200">${formatPrice(suggestion.entry)}</span>
          </div>

          {suggestion.targets && suggestion.targets.length > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Take Profit</span>
              <span className={suggestion.type === 'LONG' ? 'text-emerald-400' : 'text-rose-400'}>
                ${formatPrice(suggestion.targets[0])}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Stop Loss</span>
            <span className={suggestion.type === 'LONG' ? 'text-rose-400' : 'text-emerald-400'}>
              ${formatPrice(suggestion.stopLoss)}
            </span>
          </div>

          {suggestion.targets && suggestion.targets.length > 1 && (
            <div className="mt-4 space-y-2">
              <span className="text-sm text-slate-400">Objetivos Adicionales:</span>
              {suggestion.targets.slice(1).map((target, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Target {index + 2}</span>
                  <span className={suggestion.type === 'LONG' ? 'text-emerald-400' : 'text-rose-400'}>
                    ${formatPrice(target)}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Riesgo</span>
            <span className="text-slate-200">{suggestion.risk}</span>
          </div>

          {suggestion.message && (
            <div className="mt-4 p-3 rounded-lg bg-slate-800/30">
              <Typography variant="body2" className="text-slate-300">
                {suggestion.message}
              </Typography>
            </div>
          )}
        </div>
      </Card>
    </Box>
  );
}

export default TradingSuggestions;
