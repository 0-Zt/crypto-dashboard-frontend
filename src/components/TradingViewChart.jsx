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
          'MAExp@tv-basicstudies', // EMA 21, índice 0
          'MAExp@tv-basicstudies', // EMA 50, índice 1
          'MAExp@tv-basicstudies', // EMA 200, índice 2
          indicators.bollinger && 'BB@tv-basicstudies',
          indicators.rsi && 'RSI@tv-basicstudies',
          indicators.macd && 'MACD@tv-basicstudies',
          indicators.adx && 'ADX@tv-basicstudies',
        ].filter(Boolean),
        onChartReady: () => {
          // Aplicar overrides una vez que el chart está listo
          const overrides = {
            "MAExp@tv-basicstudies.0.length": 21,
            "MAExp@tv-basicstudies.1.length": 50,
            "MAExp@tv-basicstudies.2.length": 200,
            "MAExp@tv-basicstudies.0.visible": indicators.ema21,
            "MAExp@tv-basicstudies.1.visible": indicators.ema50,
            "MAExp@tv-basicstudies.2.visible": indicators.ema200,
          };

          if (indicators.rsi) {
            overrides["RSI@tv-basicstudies.length"] = rsiLength;
          }

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
