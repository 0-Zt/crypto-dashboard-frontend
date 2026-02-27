import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart } from 'lightweight-charts';
import { Box, FormGroup, FormControlLabel, Checkbox, Card, Tooltip, Button } from '@mui/material';
import InfoDialog from './InfoDialog';
import PropTypes from 'prop-types';
import {
  detectCandlePatterns,
  getKeyLevels,
  calculateVPT
} from '../utils/technicalAnalysis';

const TradingViewChart = ({ symbol = 'BTCUSDT', timeframe = '1h' }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef({});
  const resizeObserver = useRef(null);
  const [error, setError] = useState(null);
  const [indicators, setIndicators] = useState({
    volume: true,
    emaFast: true,
    emaMid: true,
    emaSlow: true,
    rsi: true,
    momentum: true,
    vpt: true,
    bollinger: true,
    keyLevels: true,
    patterns: true
  });
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);

  const cleanupChart = useCallback(() => {
    if (candleSeriesRef.current) {
      candleSeriesRef.current = null;
    }

    Object.values(indicatorSeriesRef.current).forEach(series => {
      if (series) {
        series = null;
      }
    });
    indicatorSeriesRef.current = {};

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    if (resizeObserver.current) {
      resizeObserver.current.disconnect();
      resizeObserver.current = null;
    }
  }, []);

  const calculateEMA = useCallback((data, period) => {
    const k = 2 / (period + 1);
    let ema = data[0].close;
    return data.map(item => {
      ema = (item.close - ema) * k + ema;
      return {
        time: item.time,
        value: ema,
      };
    });
  }, []);

  const getEMAPeriods = (tf) => {
    if (tf === '1m' || tf === '5m') {
      return { fast: 8, mid: 13, slow: 21 };
    } else if (tf === '15m' || tf === '30m') {
      return { fast: 13, mid: 21, slow: 55 };
    }
    return { fast: 21, mid: 55, slow: 200 }; // timeframes mayores
  };

  const getPatternTooltip = (pattern) => {
    const descriptions = {
      'Engulfing': 'Patrón de reversión donde una vela envuelve completamente la anterior',
      'Hammer': 'Vela con sombra inferior larga, señal alcista en tendencia bajista',
      'Shooting Star': 'Vela con sombra superior larga, señal bajista en tendencia alcista',
      'Doji': 'Vela que indica indecisión, posible reversión',
      'Morning Star': 'Patrón de tres velas que indica posible reversión alcista',
      'Evening Star': 'Patrón de tres velas que indica posible reversión bajista',
      'Three White Soldiers': 'Tres velas alcistas consecutivas, señal muy alcista',
      'Three Black Crows': 'Tres velas bajistas consecutivas, señal muy bajista',
      'Harami': 'Patrón de dos velas que indica posible reversión',
      'Piercing': 'Patrón alcista donde la segunda vela cierra por encima del punto medio de la primera'
    };

    return `${pattern.name}: ${descriptions[pattern.name] || 'Patrón de velas'}\nTipo: ${pattern.type}\nFuerza: ${pattern.strength}`;
  };

  const getLevelTooltip = (level) => {
    return `${level.type.toUpperCase()}\nPrecio: ${level.price.toFixed(2)}\nFuerza: ${level.strength.toFixed(2)}\nToques: ${level.touches}`;
  };

  const drawPatterns = useCallback(async () => {
    if (!indicators.patterns) return;
    
    try {
      const patternsData = await detectCandlePatterns(symbol, timeframe);
      if (!patternsData?.patterns) return;

      // Limpiar marcadores anteriores
      Object.keys(indicatorSeriesRef.current)
        .filter(key => key.startsWith('pattern_'))
        .forEach(key => {
          if (indicatorSeriesRef.current[key]) {
            chartRef.current.removeSeries(indicatorSeriesRef.current[key]);
            delete indicatorSeriesRef.current[key];
          }
        });

      // Dibujar nuevos patrones
      patternsData.patterns.forEach((pattern, index) => {
        const color = pattern.type === 'bullish' ? '#26a69a' : '#ef5350';
        const marker = {
          time: pattern.time,
          position: pattern.type === 'bullish' ? 'belowBar' : 'aboveBar',
          color,
          shape: pattern.type === 'bullish' ? 'arrowUp' : 'arrowDown',
          text: pattern.name,
          size: 2,
          tooltip: getPatternTooltip(pattern)
        };

        const markerSeries = chartRef.current.addLineSeries({
          color,
          lineWidth: 0,
          title: `Pattern ${index + 1}`,
          lastValueVisible: false,
          priceLineVisible: false
        });

        markerSeries.setMarkers([marker]);
        indicatorSeriesRef.current[`pattern_${index}`] = markerSeries;
      });
    } catch (error) {
      console.error('Error drawing patterns:', error);
    }
  }, [symbol, timeframe, indicators.patterns]);

  const drawKeyLevels = useCallback(async () => {
    if (!indicators.keyLevels) return;
    
    try {
      const levelsData = await getKeyLevels(symbol, timeframe);
      if (!levelsData?.levels) return;

      // Limpiar líneas anteriores
      Object.keys(indicatorSeriesRef.current)
        .filter(key => key.startsWith('level_'))
        .forEach(key => {
          if (indicatorSeriesRef.current[key]) {
            chartRef.current.removeSeries(indicatorSeriesRef.current[key]);
            delete indicatorSeriesRef.current[key];
          }
        });

      // Dibujar nuevos niveles
      levelsData.levels.forEach((level, index) => {
        const color = level.type === 'support' ? '#26a69a' : '#ef5350';
        const lineSeries = chartRef.current.addLineSeries({
          color,
          lineWidth: Math.max(1, Math.min(4, level.touches / 2)), // Grosor basado en toques
          lineStyle: 2, // línea punteada
          title: `${level.type.toUpperCase()} ${level.price.toFixed(2)}`,
          lastValueVisible: true,
          priceLineVisible: true,
          crosshairMarkerVisible: true,
          crosshairMarkerRadius: 4,
          tooltip: getLevelTooltip(level)
        });

        // Crear línea horizontal
        const lineData = [
          { time: level.start_time, value: level.price },
          { time: level.end_time, value: level.price }
        ];

        lineSeries.setData(lineData);
        indicatorSeriesRef.current[`level_${index}`] = lineSeries;

        // Agregar etiqueta al final de la línea
        const labelSeries = chartRef.current.addLineSeries({
          color,
          lineWidth: 0,
          lastValueVisible: true,
          priceLineVisible: false,
          crosshairMarkerVisible: false,
          title: ''
        });

        labelSeries.setData([{ 
          time: level.end_time, 
          value: level.price,
          title: `${level.type} (${level.touches} toques)`
        }]);
        indicatorSeriesRef.current[`level_label_${index}`] = labelSeries;
      });
    } catch (error) {
      console.error('Error drawing key levels:', error);
    }
  }, [symbol, timeframe, indicators.keyLevels]);

  const updateIndicators = useCallback(async (data) => {
    if (!chartRef.current || !data || data.length === 0) return;

    // Limpiar indicadores anteriores
    Object.keys(indicatorSeriesRef.current).forEach(key => {
      if (indicatorSeriesRef.current[key]) {
        chartRef.current.removeSeries(indicatorSeriesRef.current[key]);
        delete indicatorSeriesRef.current[key];
      }
    });

    // Volumen
    if (indicators.volume) {
      const volumeSeries = chartRef.current.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });
      
      const volumeData = data.map(item => ({
        time: item.time,
        value: item.volume,
        color: item.close > item.open ? '#26a69a' : '#ef5350'
      }));
      
      volumeSeries.setData(volumeData);
      indicatorSeriesRef.current.volume = volumeSeries;
    }

    // EMAs
    const emaPeriods = getEMAPeriods(timeframe);
    
    if (indicators.emaFast) {
      const emaFastData = calculateEMA(data, emaPeriods.fast);
      const emaFastSeries = chartRef.current.addLineSeries({
        color: '#2962FF',
        lineWidth: 1,
        title: `EMA ${emaPeriods.fast}`
      });
      emaFastSeries.setData(emaFastData);
      indicatorSeriesRef.current.emaFast = emaFastSeries;
    }

    if (indicators.emaMid) {
      const emaMidData = calculateEMA(data, emaPeriods.mid);
      const emaMidSeries = chartRef.current.addLineSeries({
        color: '#B71C1C',
        lineWidth: 1,
        title: `EMA ${emaPeriods.mid}`
      });
      emaMidSeries.setData(emaMidData);
      indicatorSeriesRef.current.emaMid = emaMidSeries;
    }

    if (indicators.emaSlow) {
      const emaSlowData = calculateEMA(data, emaPeriods.slow);
      const emaSlowSeries = chartRef.current.addLineSeries({
        color: '#00E676',
        lineWidth: 1,
        title: `EMA ${emaPeriods.slow}`
      });
      emaSlowSeries.setData(emaSlowData);
      indicatorSeriesRef.current.emaSlow = emaSlowSeries;
    }

    // Momentum
    if (indicators.momentum) {
      const momentumData = data.map(item => ({ time: item.time, value: item.close - item.open }));
      const momentumSeries = chartRef.current.addLineSeries({
        color: '#00E676',
        lineWidth: 1,
        title: 'Momentum',
        priceScaleId: 'momentum',
        scaleMargins: {
          top: 0.1,
          bottom: 0.3,
        },
      });
      momentumSeries.setData(momentumData);
      indicatorSeriesRef.current.momentum = momentumSeries;
    }

    // VPT
    if (indicators.vpt) {
      const vptData = calculateVPT(data);
      const vptSeries = chartRef.current.addLineSeries({
        color: '#FF9800',
        lineWidth: 1,
        title: 'VPT',
        priceScaleId: 'vpt',
        scaleMargins: {
          top: 0.2,
          bottom: 0.1,
        },
      });
      vptSeries.setData(vptData);
      indicatorSeriesRef.current.vpt = vptSeries;
    }

    // Dibujar patrones y niveles
    await drawPatterns();
    await drawKeyLevels();
  }, [timeframe, indicators, drawPatterns, drawKeyLevels, calculateEMA]);

  useEffect(() => {
    if (!symbol) return; // No crear el gráfico si no hay símbolo seleccionado

    const initChart = async () => {
      try {
        if (!chartContainerRef.current) return;

        // Limpiar el gráfico anterior
        cleanupChart();

        // Crear nuevo gráfico
        chartRef.current = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 600,
          layout: {
            background: { color: '#0f0f0f' },
            textColor: '#fff',
          },
          grid: {
            vertLines: { color: '#1c1c1c' },
            horzLines: { color: '#1c1c1c' },
          },
          crosshair: {
            mode: 1,
            vertLine: {
              width: 1,
              color: '#00f2ea',
              style: 0,
            },
            horzLine: {
              width: 1,
              color: '#00f2ea',
              style: 0,
            },
          },
          rightPriceScale: {
            borderColor: '#333333',
            visible: true,
            scaleMargins: {
              top: 0.1,
              bottom: 0.1,
            },
          },
          timeScale: {
            borderColor: '#333333',
            timeVisible: true,
            secondsVisible: false,
          },
        });

        // Crear serie de velas
        candleSeriesRef.current = chartRef.current.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
          priceFormat: {
            type: 'price',
            precision: 8,
            minMove: 0.00000001,
          },
        });

        // Cargar datos
        try {
          const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=1000`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const binanceData = await response.json();
          
          const data = binanceData.map(candle => ({
            time: candle[0] / 1000,
            open: parseFloat(candle[1]),
            high: parseFloat(candle[2]),
            low: parseFloat(candle[3]),
            close: parseFloat(candle[4]),
            volume: parseFloat(candle[5])
          }));

          if (candleSeriesRef.current) {
            candleSeriesRef.current.setData(data);
            // Actualizar indicadores
            updateIndicators(data);
          }
        } catch (err) {
          console.error('Error loading chart data:', err);
        }

        // Configurar el observer para el resize
        resizeObserver.current = new ResizeObserver(entries => {
          if (entries.length === 0 || !chartRef.current) return;
          const { width, height } = entries[0].contentRect;
          chartRef.current.applyOptions({ width, height });
        });

        resizeObserver.current.observe(chartContainerRef.current);
      } catch (err) {
        console.error('Error initializing chart:', err);
      }
    };

    initChart();

    return () => cleanupChart();
  }, [symbol, timeframe, cleanupChart, updateIndicators]);

  useEffect(() => {
    if (chartRef.current && candleSeriesRef.current) {
      const data = candleSeriesRef.current.data();
      if (data && data.length > 0) {
        updateIndicators(data);
      }
    }
  }, [indicators, updateIndicators]);

  useEffect(() => {
    if (chartRef.current) {
      const fetchData = async () => {
        try {
          setError(null);
          try {
            const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=1000`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const binanceData = await response.json();
            
            const data = binanceData.map(candle => ({
              time: candle[0] / 1000,
              open: parseFloat(candle[1]),
              high: parseFloat(candle[2]),
              low: parseFloat(candle[3]),
              close: parseFloat(candle[4]),
              volume: parseFloat(candle[5])
            }));

            if (candleSeriesRef.current) {
              candleSeriesRef.current.setData(data);
              // Actualizar indicadores
              updateIndicators(data);
            }
          } catch (err) {
            console.error('Error loading chart data:', err);
          }
        } catch (err) {
          console.error('Error fetching or processing data:', err);
          setError(err.message);
        }
      };

      fetchData();
    }
  }, [symbol, timeframe, updateIndicators]);

  useEffect(() => {
    if (chartRef.current && candleSeriesRef.current) {
      drawKeyLevels();
      drawPatterns();
    }
  }, [drawKeyLevels, drawPatterns]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', position: 'relative' }}>
      {/* Panel de control de indicadores */}
      <Box sx={{ 
        width: '100%',
        mb: 2,
      }}>
        <Card sx={{ 
          backgroundColor: '#0f0f0f',
          border: '1px solid #1F1F22',
          borderRadius: '16px',
          p: 3,
          height: 'auto',
          minHeight: '200px'
        }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Medias Móviles</h3>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={indicators.emaFast}
                      onChange={(e) => setIndicators({ ...indicators, emaFast: e.target.checked })}
                      sx={{
                        color: '#fff',
                        '&.Mui-checked': { color: '#fff' },
                        '& .MuiSvgIcon-root': { fontSize: 20 }
                      }}
                    />
                  }
                  label={<span className="text-sm text-gray-400">EMA Rápida</span>}
                  sx={{ marginY: 0.5 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={indicators.emaMid}
                      onChange={(e) => setIndicators({ ...indicators, emaMid: e.target.checked })}
                      sx={{
                        color: '#fff',
                        '&.Mui-checked': { color: '#fff' },
                        '& .MuiSvgIcon-root': { fontSize: 20 }
                      }}
                    />
                  }
                  label={<span className="text-sm text-gray-400">EMA Media</span>}
                  sx={{ marginY: 0.5 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={indicators.emaSlow}
                      onChange={(e) => setIndicators({ ...indicators, emaSlow: e.target.checked })}
                      sx={{
                        color: '#fff',
                        '&.Mui-checked': { color: '#fff' },
                        '& .MuiSvgIcon-root': { fontSize: 20 }
                      }}
                    />
                  }
                  label={<span className="text-sm text-gray-400">EMA Lenta</span>}
                  sx={{ marginY: 0.5 }}
                />
              </FormGroup>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-3">Osciladores</h3>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={indicators.rsi}
                      onChange={(e) => setIndicators({ ...indicators, rsi: e.target.checked })}
                      sx={{
                        color: '#fff',
                        '&.Mui-checked': { color: '#fff' },
                        '& .MuiSvgIcon-root': { fontSize: 20 }
                      }}
                    />
                  }
                  label={
                    <Tooltip title="Relative Strength Index" arrow>
                      <span className="text-sm text-gray-400">RSI</span>
                    </Tooltip>
                  }
                  sx={{ marginY: 0.5 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={indicators.bollinger}
                      onChange={(e) => setIndicators({ ...indicators, bollinger: e.target.checked })}
                      sx={{
                        color: '#fff',
                        '&.Mui-checked': { color: '#fff' },
                        '& .MuiSvgIcon-root': { fontSize: 20 }
                      }}
                    />
                  }
                  label={
                    <Tooltip title="Bandas de Bollinger" arrow>
                      <span className="text-sm text-gray-400">Bollinger</span>
                    </Tooltip>
                  }
                  sx={{ marginY: 0.5 }}
                />
              </FormGroup>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-3">Volumen y Momentum</h3>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={indicators.volume}
                      onChange={(e) => setIndicators({ ...indicators, volume: e.target.checked })}
                      sx={{
                        color: '#fff',
                        '&.Mui-checked': { color: '#fff' },
                        '& .MuiSvgIcon-root': { fontSize: 20 }
                      }}
                    />
                  }
                  label={
                    <Tooltip title="Muestra el volumen de operaciones" arrow>
                      <span className="text-sm text-gray-400">Volumen</span>
                    </Tooltip>
                  }
                  sx={{ marginY: 0.5 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={indicators.momentum}
                      onChange={(e) => setIndicators({ ...indicators, momentum: e.target.checked })}
                      sx={{
                        color: '#fff',
                        '&.Mui-checked': { color: '#fff' },
                        '& .MuiSvgIcon-root': { fontSize: 20 }
                      }}
                    />
                  }
                  label={
                    <Tooltip title="Indicador de momentum" arrow>
                      <span className="text-sm text-gray-400">Momentum</span>
                    </Tooltip>
                  }
                  sx={{ marginY: 0.5 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={indicators.vpt}
                      onChange={(e) => setIndicators({ ...indicators, vpt: e.target.checked })}
                      sx={{
                        color: '#fff',
                        '&.Mui-checked': { color: '#fff' },
                        '& .MuiSvgIcon-root': { fontSize: 20 }
                      }}
                    />
                  }
                  label={
                    <Tooltip title="Volume Price Trend" arrow>
                      <span className="text-sm text-gray-400">VPT</span>
                    </Tooltip>
                  }
                  sx={{ marginY: 0.5 }}
                />
              </FormGroup>
            </div>

            <div>
              <h3 className="text-sm font-medium text-white mb-3">Análisis Avanzado</h3>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={indicators.patterns}
                      onChange={(e) => setIndicators({ ...indicators, patterns: e.target.checked })}
                      sx={{
                        color: '#fff',
                        '&.Mui-checked': { color: '#fff' },
                        '& .MuiSvgIcon-root': { fontSize: 20 }
                      }}
                    />
                  }
                  label={
                    <Tooltip title="Patrones de velas japonesas (En desarrollo)" arrow>
                      <span className="text-sm text-gray-400">Patrones</span>
                    </Tooltip>
                  }
                  sx={{ marginY: 0.5 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={indicators.keyLevels}
                      onChange={(e) => setIndicators({ ...indicators, keyLevels: e.target.checked })}
                      sx={{
                        color: '#fff',
                        '&.Mui-checked': { color: '#fff' },
                        '& .MuiSvgIcon-root': { fontSize: 20 }
                      }}
                    />
                  }
                  label={
                    <Tooltip title="Niveles de soporte y resistencia (En desarrollo)" arrow>
                      <span className="text-sm text-gray-400">Niveles Clave</span>
                    </Tooltip>
                  }
                  sx={{ marginY: 0.5 }}
                />
              </FormGroup>

              <Button
                variant="contained"
                size="medium"
                onClick={() => setInfoDialogOpen(true)}
                fullWidth
                sx={{
                  background: 'linear-gradient(45deg, #00f2ea 30%, #00c4ff 90%)',
                  color: '#fff',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  padding: '10px 24px',
                  textTransform: 'none',
                  letterSpacing: '0.5px',
                  boxShadow: '0 3px 5px 2px rgba(0, 242, 234, .3)',
                  minWidth: '200px',
                  marginTop: 2,
                  '&:hover': {
                    background: 'linear-gradient(45deg, #00c4ff 30%, #00f2ea 90%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 6px 2px rgba(0, 242, 234, .4)',
                  }
                }}
              >
                Guía de Indicadores
              </Button>
            </div>
          </div>
        </Card>
      </Box>

      {/* Contenedor del gráfico */}
      <div
        ref={chartContainerRef}
        style={{
          width: '100%',
          height: '600px', 
          minHeight: '500px',
          backgroundColor: '#0f0f0f',
          borderRadius: '16px',
          border: '1px solid #1F1F22',
          marginBottom: '64px',
          position: 'relative' 
        }}
      />

      {/* Diálogo de información */}
      <InfoDialog open={infoDialogOpen} onClose={() => setInfoDialogOpen(false)} />

      {error && (
        <Box sx={{ color: 'error.main', mt: 2, textAlign: 'center' }}>
          {error}
        </Box>
      )}
    </Box>
  );
};

TradingViewChart.propTypes = {
  symbol: PropTypes.string,
  timeframe: PropTypes.string
};

export default TradingViewChart;
