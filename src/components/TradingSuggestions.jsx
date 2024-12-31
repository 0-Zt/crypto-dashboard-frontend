import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { API_URL } from '../config/api';
import { Card } from './ui/card';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';

const TradingSuggestions = ({ symbol, timeframe }) => {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (!symbol) return;
      
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/analysis/${symbol}?interval=${timeframe}`);
        if (!response.ok) {
          throw new Error('Error fetching trading suggestion');
        }
        const data = await response.json();
        setSuggestion(data.suggestion || {
          type: 'NEUTRAL',
          message: 'No hay señal clara de trading en este momento',
          confidence: 0,
          risk: 'N/A'
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching suggestion:', err);
        setError('Error loading trading suggestion');
        setSuggestion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, [symbol, timeframe]);

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

  if (!suggestion) return null;

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
      <Typography variant="h6" className="text-slate-200">
        Trading Suggestions
      </Typography>

      <Card className="p-4">
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
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TradingSuggestions;
