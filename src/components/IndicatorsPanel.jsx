import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  LineChart,
  BarChart2,
  Activity,
  Waves,
  CandlestickChart,
  DollarSign,
  Timer,
  Info
} from 'lucide-react';
import { API_URL } from '../config/api';
import { Card } from './ui/card';
import CandlePatternInfo from './CandlePatternInfo';
import { getAnalysisTimeframe } from '../utils/timeframeUtils';

const IndicatorsPanel = ({ symbol, timeframe = '1h' }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patternInfoOpen, setPatternInfoOpen] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const analysisTimeframe = getAnalysisTimeframe(timeframe);
        const response = await fetch(`${API_URL}/api/analysis/${symbol}?interval=${analysisTimeframe}`);
        if (!response.ok) {
          throw new Error('Error al obtener el análisis');
        }
        const data = await response.json();
        setAnalysis(data.analysis);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (symbol) {
      fetchAnalysis();
    }
  }, [symbol, timeframe]);

  if (loading) {
    return (
      <Box className="flex justify-center items-center p-6">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="m-4">
        {error}
      </Alert>
    );
  }

  if (!analysis) return null;

  const {
    trend,
    indicators,
    analysis: detailAnalysis,
    patterns,
    price = {} // Valor por defecto para price
  } = analysis;

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

  // Valores por defecto para evitar errores
  const priceValue = price?.value || 0;
  const priceChange = price?.change24h || 0;

  const handlePatternClick = (patternName) => {
    setSelectedPattern(patternName);
    setPatternInfoOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <LineChart className="w-6 h-6 text-indigo-500" />
          <h2 className="text-lg font-semibold text-slate-200">
            Análisis de {symbol}
          </h2>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getTrendColor(trend)} bg-slate-800/50`}>
          {getTrendIcon(trend)}
          <span className="text-sm font-medium">{trend?.replace('_', ' ') || 'NEUTRAL'}</span>
        </div>
      </div>

      {/* Precio y EMAs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-5 h-5 text-indigo-500" />
            <h3 className="font-medium text-slate-200">Precio Actual</h3>
          </div>
          <div className="text-2xl font-bold text-slate-200 mb-4">
            ${priceValue.toFixed(2)}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Variación 24h</span>
              <span className={priceChange >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                {priceChange > 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Timer className="w-5 h-5 text-indigo-500" />
            <h3 className="font-medium text-slate-200">EMAs</h3>
          </div>
          <div className="space-y-2">
            {indicators?.ema && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">EMA 21</span>
                  <span className="text-slate-200">${indicators.ema.ema21?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">EMA 50</span>
                  <span className="text-slate-200">${indicators.ema.ema50?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">EMA 200</span>
                  <span className="text-slate-200">${indicators.ema.ema200?.toFixed(2) || '0.00'}</span>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RSI */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              <h3 className="font-medium text-slate-200">RSI</h3>
            </div>
            <span className={`text-sm font-medium px-2.5 py-0.5 rounded-full 
              ${indicators?.rsi?.value > 70 ? 'bg-rose-500/20 text-rose-500' : 
                indicators?.rsi?.value < 30 ? 'bg-emerald-500/20 text-emerald-500' : 
                'bg-slate-700/50 text-slate-300'}`}>
              {indicators?.rsi?.value?.toFixed(2) || '0.00'}
            </span>
          </div>
          <p className="text-sm text-slate-400">{detailAnalysis?.rsi || 'Sin datos'}</p>
          <div className="mt-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Estado</span>
              <span className={`${
                indicators?.rsi?.value > 70 ? 'text-rose-500' : 
                indicators?.rsi?.value < 30 ? 'text-emerald-500' : 
                'text-slate-400'
              }`}>
                {indicators?.rsi?.value > 70 ? 'Sobrecomprado' :
                 indicators?.rsi?.value < 30 ? 'Sobrevendido' : 'Neutral'}
              </span>
            </div>
          </div>
        </Card>

        {/* MACD */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="w-5 h-5 text-indigo-500" />
            <h3 className="font-medium text-slate-200">MACD</h3>
          </div>
          <div className="space-y-2 text-sm">
            {indicators?.macd && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">MACD</span>
                  <span className={`${indicators.macd.macd >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {indicators.macd.macd?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Señal</span>
                  <span className="text-slate-200">{indicators.macd.signal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Histograma</span>
                  <span className={`${indicators.macd.histogram >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {indicators.macd.histogram?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-400">{detailAnalysis?.macd || 'Sin datos'}</p>
        </Card>

        {/* Bollinger Bands */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Waves className="w-5 h-5 text-indigo-500" />
            <h3 className="font-medium text-slate-200">Bandas de Bollinger</h3>
          </div>
          <div className="space-y-2 text-sm">
            {indicators?.bollinger_bands && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Superior</span>
                  <span className="text-slate-200">${indicators.bollinger_bands.upper?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Media</span>
                  <span className="text-slate-200">${indicators.bollinger_bands.middle?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Inferior</span>
                  <span className="text-slate-200">${indicators.bollinger_bands.lower?.toFixed(2) || '0.00'}</span>
                </div>
              </>
            )}
          </div>
          <p className="mt-3 text-sm text-slate-400">{detailAnalysis?.bollinger || 'Sin datos'}</p>
        </Card>

        {/* Análisis de Tendencia */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            <h3 className="font-medium text-slate-200">Análisis de Tendencia</h3>
          </div>
          <p className="text-sm text-slate-400">{detailAnalysis?.summary || 'Sin datos'}</p>
          {indicators?.lastCandle && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Última Vela</span>
                <span className={`${indicators.lastCandle.bullish ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {indicators.lastCandle.bullish ? 'Alcista' : 'Bajista'}
                </span>
              </div>
              {indicators.lastCandle.pattern && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Patrón</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs
                      ${indicators.lastCandle.pattern.bullish ? 'bg-emerald-500/20 text-emerald-500' : 
                        indicators.lastCandle.pattern.bearish ? 'bg-rose-500/20 text-rose-500' : 
                        'bg-amber-500/20 text-amber-500'}`}>
                      {indicators.lastCandle.pattern.name || 'Sin patrón'}
                    </span>
                    {indicators.lastCandle.pattern.name && (
                      <button
                        onClick={() => handlePatternClick(indicators.lastCandle.pattern.name)}
                        className="p-1 hover:bg-slate-800 rounded-full transition-colors"
                      >
                        <Info className="w-4 h-4 text-slate-400" />
                      </button>
                    )}
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Apertura</span>
                <span className="text-slate-200">${indicators.lastCandle.open?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Cierre</span>
                <span className="text-slate-200">${indicators.lastCandle.close?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Máximo</span>
                <span className="text-slate-200">${indicators.lastCandle.high?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Mínimo</span>
                <span className="text-slate-200">${indicators.lastCandle.low?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Volumen</span>
                <span className="text-slate-200">{indicators.lastCandle.volume?.toLocaleString() || '0'}</span>
              </div>
              {indicators.lastCandle.pattern?.description && (
                <div className="mt-2 text-sm text-slate-400">
                  {indicators.lastCandle.pattern.description}
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Patrones */}
        {patterns && patterns.length > 0 && (
          <Card className="p-4 col-span-full">
            <div className="flex items-center gap-2 mb-3">
              <CandlestickChart className="w-5 h-5 text-indigo-500" />
              <h3 className="font-medium text-slate-200">Patrones Detectados</h3>
            </div>
            <ul className="space-y-1">
              {patterns.map((pattern, idx) => (
                <li 
                  key={idx} 
                  className="text-sm text-slate-400 flex items-center gap-2 cursor-pointer hover:text-slate-200"
                  onClick={() => {
                    setSelectedPattern(pattern);
                    setPatternInfoOpen(true);
                  }}
                >
                  <span>•</span>
                  <span>{pattern}</span>
                  <Info className="w-4 h-4 text-indigo-500" />
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
      <CandlePatternInfo
        open={patternInfoOpen}
        onClose={() => setPatternInfoOpen(false)}
        patternName={selectedPattern}
      />
    </div>
  );
};

export default IndicatorsPanel;
