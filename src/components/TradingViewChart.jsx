import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createChart } from 'lightweight-charts';
import { Box, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { getBinanceTimeframe } from '../utils/timeframeUtils';

const TradingViewChart = ({ symbol = 'BTCUSDT', timeframe = '1h' }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const indicatorSeriesRef = useRef({});
  const resizeObserver = useRef(null);
  const [indicators, setIndicators] = useState({
    ema21: true,
    ema50: false,
    ema200: true,
    volume: false,
    bollinger: false,
    rsi: false,
    macd: false,
  });

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

  const calculateBollingerBands = useCallback((data, period = 20, stdDev = 2) => {
    const sma = data.map((_, index, array) => {
      if (index < period - 1) return null;
      const slice = array.slice(index - period + 1, index + 1);
      const sum = slice.reduce((acc, val) => acc + val.close, 0);
      return sum / period;
    });

    const bands = sma.map((mean, index) => {
      if (mean === null) return null;
      const slice = data.slice(index - period + 1, index + 1);
      const squaredDiffs = slice.map(item => Math.pow(item.close - mean, 2));
      const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / period;
      const std = Math.sqrt(variance);
      return {
        time: data[index].time,
        upper: mean + stdDev * std,
        middle: mean,
        lower: mean - stdDev * std,
      };
    }).filter(item => item !== null);

    return bands;
  }, []);

  const calculateRSI = useCallback((data, period = 14) => {
    let gains = [];
    let losses = [];
    let rsi = [];

    for (let i = 1; i < data.length; i++) {
      const difference = data[i].close - data[i - 1].close;
      gains.push(difference > 0 ? difference : 0);
      losses.push(difference < 0 ? -difference : 0);
    }

    for (let i = period; i < data.length; i++) {
      const avgGain = gains.slice(i - period, i).reduce((a, b) => a + b) / period;
      const avgLoss = losses.slice(i - period, i).reduce((a, b) => a + b) / period;
      const rs = avgGain / avgLoss;
      rsi.push({
        time: data[i].time,
        value: 100 - (100 / (1 + rs))
      });
    }

    return rsi;
  }, []);

  const calculateMACD = useCallback((data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
    const fastEMA = calculateEMA(data, fastPeriod);
    const slowEMA = calculateEMA(data, slowPeriod);
    
    const macdLine = fastEMA.map((item, i) => ({
      time: item.time,
      value: item.value - slowEMA[i].value
    }));

    const signalLine = calculateEMA(macdLine, signalPeriod);
    
    return {
      macdLine,
      signalLine,
      histogram: macdLine.map((item, i) => ({
        time: item.time,
        value: item.value - signalLine[i].value
      }))
    };
  }, [calculateEMA]);

  const clearChart = useCallback(() => {
    if (chartRef.current) {
      Object.values(indicatorSeriesRef.current).forEach(series => {
        if (Array.isArray(series)) {
          series.forEach(s => chartRef.current.removeSeries(s));
        } else {
          chartRef.current.removeSeries(series);
        }
      });
      indicatorSeriesRef.current = {};

      if (volumeSeriesRef.current) {
        chartRef.current.removeSeries(volumeSeriesRef.current);
        volumeSeriesRef.current = null;
      }

      if (candleSeriesRef.current) {
        chartRef.current.removeSeries(candleSeriesRef.current);
        candleSeriesRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 600,
      layout: {
        background: { color: '#0B1120' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#1E2B4B' },
        horzLines: { color: '#1E2B4B' },
      },
      crosshair: {
        mode: 0,
      },
      timeScale: {
        borderColor: '#1E2B4B',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#1E2B4B',
      },
    });

    chartRef.current = chart;
    
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#4CAF50',
      downColor: '#FF5252',
      borderDownColor: '#FF5252',
      borderUpColor: '#4CAF50',
      wickDownColor: '#FF5252',
      wickUpColor: '#4CAF50',
    });

    candleSeriesRef.current = candleSeries;

    const fetchData = async () => {
      try {
        clearChart();
        const binanceTimeframe = getBinanceTimeframe(timeframe);
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${binanceTimeframe}&limit=1000`);
        if (!response.ok) {
          throw new Error('Error fetching data from Binance');
        }
        const data = await response.json();
        
        const candleData = data.map(d => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
          volume: parseFloat(d[5])
        }));

        candleSeriesRef.current = chartRef.current.addCandlestickSeries({
          upColor: '#4CAF50',
          downColor: '#FF5252',
          borderDownColor: '#FF5252',
          borderUpColor: '#4CAF50',
          wickDownColor: '#FF5252',
          wickUpColor: '#4CAF50',
        });
        candleSeriesRef.current.setData(candleData);

        if (indicators.volume) {
          volumeSeriesRef.current = chartRef.current.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
              type: 'volume',
            },
            priceScaleId: 'volume',
            scaleMargins: {
              top: 0.9,
              bottom: 0,
            },
          });

          const volumeData = candleData.map(d => ({
            time: d.time,
            value: d.volume,
            color: d.close >= d.open ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)'
          }));

          volumeSeriesRef.current.setData(volumeData);
        }

        if (indicators.ema21) {
          const ema21Data = calculateEMA(candleData, 21);
          const ema21Series = chartRef.current.addLineSeries({
            color: '#FF9800',
            lineWidth: 1.5,
            priceLineVisible: false,
          });
          ema21Series.setData(ema21Data);
          indicatorSeriesRef.current.ema21 = ema21Series;
        }

        if (indicators.ema50) {
          const ema50Data = calculateEMA(candleData, 50);
          const ema50Series = chartRef.current.addLineSeries({
            color: '#2196F3',
            lineWidth: 1.5,
            priceLineVisible: false,
          });
          ema50Series.setData(ema50Data);
          indicatorSeriesRef.current.ema50 = ema50Series;
        }

        if (indicators.ema200) {
          const ema200Data = calculateEMA(candleData, 200);
          const ema200Series = chartRef.current.addLineSeries({
            color: '#E91E63',
            lineWidth: 1.5,
            priceLineVisible: false,
          });
          ema200Series.setData(ema200Data);
          indicatorSeriesRef.current.ema200 = ema200Series;
        }

        if (indicators.bollinger) {
          const bollingerData = calculateBollingerBands(candleData);
          
          const upperSeries = chartRef.current.addLineSeries({
            color: 'rgba(41, 98, 255, 0.3)',
            lineWidth: 1,
            priceLineVisible: false,
          });
          
          const middleSeries = chartRef.current.addLineSeries({
            color: 'rgba(123, 31, 162, 0.3)',
            lineWidth: 1,
            priceLineVisible: false,
          });
          
          const lowerSeries = chartRef.current.addLineSeries({
            color: 'rgba(41, 98, 255, 0.3)',
            lineWidth: 1,
            priceLineVisible: false,
          });

          upperSeries.setData(bollingerData.map(d => ({ time: d.time, value: d.upper })));
          middleSeries.setData(bollingerData.map(d => ({ time: d.time, value: d.middle })));
          lowerSeries.setData(bollingerData.map(d => ({ time: d.time, value: d.lower })));
          
          indicatorSeriesRef.current.bollinger = [upperSeries, middleSeries, lowerSeries];
        }

        if (indicators.rsi) {
          const rsiData = calculateRSI(candleData);
          const rsiSeries = chartRef.current.addLineSeries({
            color: '#9C27B0',
            lineWidth: 1.5,
            priceLineVisible: false,
            priceScaleId: 'rsi',
            scaleMargins: {
              top: 0.85,
              bottom: 0.1,
            },
          });
          rsiSeries.setData(rsiData);
          indicatorSeriesRef.current.rsi = rsiSeries;
        }

        if (indicators.macd) {
          const macdData = calculateMACD(candleData);
          
          const macdSeries = chartRef.current.addLineSeries({
            color: '#2196F3',
            lineWidth: 1.5,
            priceLineVisible: false,
            priceScaleId: 'macd',
            scaleMargins: {
              top: 0.85,
              bottom: 0.1,
            },
          });

          const signalSeries = chartRef.current.addLineSeries({
            color: '#FF9800',
            lineWidth: 1.5,
            priceLineVisible: false,
            priceScaleId: 'macd',
            scaleMargins: {
              top: 0.85,
              bottom: 0.1,
            },
          });

          const histogramSeries = chartRef.current.addHistogramSeries({
            color: '#26a69a',
            priceScaleId: 'macd',
            scaleMargins: {
              top: 0.85,
              bottom: 0.1,
            },
          });

          macdSeries.setData(macdData.macdLine);
          signalSeries.setData(macdData.signalLine);
          histogramSeries.setData(macdData.histogram.map(h => ({
            ...h,
            color: h.value >= 0 ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)'
          })));

          indicatorSeriesRef.current.macd = [macdSeries, signalSeries, histogramSeries];
        }

        chartRef.current.timeScale().fitContent();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    resizeObserver.current = new ResizeObserver(entries => {
      if (entries.length === 0 || !entries[0].target) return;
      const newWidth = entries[0].target.clientWidth;
      chart.applyOptions({ width: newWidth });
    });

    resizeObserver.current.observe(chartContainerRef.current);

    return () => {
      clearChart();
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [symbol, timeframe, indicators, calculateEMA, calculateBollingerBands, calculateRSI, calculateMACD, clearChart]);

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <FormGroup row sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators.ema21}
              onChange={(e) => setIndicators({ ...indicators, ema21: e.target.checked })}
            />
          }
          label="EMA 21"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators.ema50}
              onChange={(e) => setIndicators({ ...indicators, ema50: e.target.checked })}
            />
          }
          label="EMA 50"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators.ema200}
              onChange={(e) => setIndicators({ ...indicators, ema200: e.target.checked })}
            />
          }
          label="EMA 200"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators.bollinger}
              onChange={(e) => setIndicators({ ...indicators, bollinger: e.target.checked })}
            />
          }
          label="Bollinger Bands"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators.rsi}
              onChange={(e) => setIndicators({ ...indicators, rsi: e.target.checked })}
            />
          }
          label="RSI"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators.macd}
              onChange={(e) => setIndicators({ ...indicators, macd: e.target.checked })}
            />
          }
          label="MACD"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={indicators.volume}
              onChange={(e) => setIndicators({ ...indicators, volume: e.target.checked })}
            />
          }
          label="Volume"
        />
      </FormGroup>
      <div ref={chartContainerRef} />
    </Box>
  );
};

export default TradingViewChart;
