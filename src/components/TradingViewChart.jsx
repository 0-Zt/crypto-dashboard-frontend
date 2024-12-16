import React, { useEffect, useRef } from 'react';
import { Box, FormGroup, FormControlLabel, Checkbox, TextField, Tooltip } from '@mui/material';

const TradingViewChart = ({ symbol = 'BTCUSDT', timeframe = '1h' }) => {
  const container = useRef();
  const [indicators, setIndicators] = React.useState({
    ema21: true,
    ema50: true,
    ema200: true,
    bollinger: false,
    rsi: false,
    macd: false,
    adx: false,
  });

  const [rsiLength, setRsiLength] = React.useState(14);

  useEffect(() => {
    if (!symbol) return; // No crear el widget si no hay símbolo

    const currentContainer = container.current;
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      let widget = new window.TradingView.widget({
        width: '100%',
        height: 600,
        symbol: `BINANCE:${symbol}`,
        interval: timeframe.toUpperCase(),
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "es",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        save_image: false,
        container_id: "tradingview_chart",
        hide_side_toolbar: false,
        studies: [
          indicators.ema21 && { id: 'MAExp@tv-basicstudies', label: 'EMA 21', inputs: { length: 21 } },
          indicators.ema50 && { id: 'MAExp@tv-basicstudies', label: 'EMA 50', inputs: { length: 50 } },
          indicators.ema200 && { id: 'MAExp@tv-basicstudies', label: 'EMA 200', inputs: { length: 200 } },
          indicators.bollinger && { id: 'BB@tv-basicstudies', label: 'Bollinger Bands' },
          indicators.rsi && { id: 'RSI@tv-basicstudies', label: 'RSI', inputs: { length: rsiLength } },
          indicators.macd && { id: 'MACD@tv-basicstudies', label: 'MACD' },
          indicators.adx && { id: 'ADX@tv-basicstudies', label: 'ADX' },
        ].filter(Boolean),
        onChartReady: () => {
          // Configurar colores y estilos para las EMAs y otros indicadores
          const overrides = {
            // EMAs
            "MAExp@tv-basicstudies.0.plottype": "line",
            "MAExp@tv-basicstudies.0.color": "#00FF00",  // Verde para EMA 21
            "MAExp@tv-basicstudies.1.plottype": "line",
            "MAExp@tv-basicstudies.1.color": "#FFD700",  // Dorado para EMA 50
            "MAExp@tv-basicstudies.2.plottype": "line",
            "MAExp@tv-basicstudies.2.color": "#FF0000",  // Rojo para EMA 200
            
            // Bollinger Bands
            "BB@tv-basicstudies.upperBandColor": "#2962FF",
            "BB@tv-basicstudies.lowerBandColor": "#2962FF",
            "BB@tv-basicstudies.middleBandColor": "#7B1FA2",
            
            // RSI
            "RSI@tv-basicstudies.length": rsiLength,
            "RSI@tv-basicstudies.upperLimit": 70,
            "RSI@tv-basicstudies.lowerLimit": 30,
            
            // MACD
            "MACD@tv-basicstudies.fast_length": 12,
            "MACD@tv-basicstudies.slow_length": 26,
            "MACD@tv-basicstudies.signal_length": 9,
            
            // ADX
            "ADX@tv-basicstudies.length": 14
          };

          widget.applyStudiesOverrides(overrides);
        }
      });
    };

    if (currentContainer) {
      currentContainer.innerHTML = '<div id="tradingview_chart"></div>';
      document.head.appendChild(script);
    }

    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
      const oldScript = document.querySelector('script[src="https://s3.tradingview.com/tv.js"]');
      if (oldScript) {
        oldScript.remove();
      }
    };
  }, [symbol, timeframe, indicators, rsiLength]);

  const handleIndicatorChange = (event) => {
    setIndicators({
      ...indicators,
      [event.target.name]: event.target.checked
    });
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormGroup row>
          <Tooltip title="Media Móvil Exponencial de 21 períodos. Útil para identificar tendencia a corto plazo.">
            <FormControlLabel
              control={
                <Checkbox
                  checked={indicators.ema21}
                  onChange={handleIndicatorChange}
                  name="ema21"
                />
              }
              label="EMA 21"
            />
          </Tooltip>

          <Tooltip title="Media Móvil Exponencial de 50 períodos. Indica tendencia de mediano plazo.">
            <FormControlLabel
              control={
                <Checkbox
                  checked={indicators.ema50}
                  onChange={handleIndicatorChange}
                  name="ema50"
                />
              }
              label="EMA 50"
            />
          </Tooltip>

          <Tooltip title="Media Móvil Exponencial de 200 períodos. Es una referencia a largo plazo.">
            <FormControlLabel
              control={
                <Checkbox
                  checked={indicators.ema200}
                  onChange={handleIndicatorChange}
                  name="ema200"
                />
              }
              label="EMA 200"
            />
          </Tooltip>

          <Tooltip title="Bandas de Bollinger muestran volatilidad. Cuando el precio está cerca de la banda superior puede estar sobrecomprado, cerca de la inferior puede estar sobrevendido.">
            <FormControlLabel
              control={
                <Checkbox
                  checked={indicators.bollinger}
                  onChange={handleIndicatorChange}
                  name="bollinger"
                />
              }
              label="Bollinger"
            />
          </Tooltip>

          <Tooltip title="RSI mide la fuerza interna del precio. >70 indica sobrecompra, <30 sobreventa.">
            <FormControlLabel
              control={
                <Checkbox
                  checked={indicators.rsi}
                  onChange={handleIndicatorChange}
                  name="rsi"
                />
              }
              label="RSI"
            />
          </Tooltip>

          <Tooltip title="MACD muestra la relación entre dos medias móviles. Por encima de la línea de señal indica momentum alcista.">
            <FormControlLabel
              control={
                <Checkbox
                  checked={indicators.macd}
                  onChange={handleIndicatorChange}
                  name="macd"
                />
              }
              label="MACD"
            />
          </Tooltip>

          <Tooltip title="ADX mide la fuerza de la tendencia. Un valor alto indica una tendencia fuerte.">
            <FormControlLabel
              control={
                <Checkbox
                  checked={indicators.adx}
                  onChange={handleIndicatorChange}
                  name="adx"
                />
              }
              label="ADX"
            />
          </Tooltip>
        </FormGroup>

        {indicators.rsi && (
          <Tooltip title="Ajusta el período del RSI para hacerlo más o menos sensible a los cambios de precio.">
            <TextField
              label="RSI Length"
              type="number"
              value={rsiLength}
              onChange={(e) => setRsiLength(parseInt(e.target.value, 10))}
              size="small"
              sx={{ width: 100 }}
            />
          </Tooltip>
        )}
      </Box>

      <Box 
        ref={container}
        sx={{ 
          width: '100%', 
          height: 'calc(100% - 60px)', 
          minHeight: '500px' 
        }}
      />
    </Box>
  );
};

export default TradingViewChart;
