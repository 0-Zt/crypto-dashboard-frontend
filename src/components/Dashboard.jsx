import React, { useState, useMemo } from 'react';
import { Alert, Box, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import IndicatorsPanel from './IndicatorsPanel';
import MultiTimeframePanel from './MultiTimeframepanel';
import TradingSuggestions from './TradingSuggestions';
import TopCryptoTable from './TopCryptoTable';
import TradingViewChart from './TradingViewChart';
import { Card } from './ui/card';
import { useSymbolsQuery } from '../hooks/useMarketData';

const DEFAULT_SYMBOL = 'BTCUSDT';
const DEFAULT_TIMEFRAME = '1h';

const selectStyles = {
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(128, 152, 215, 0.4)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(92, 200, 255, 0.7)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#5cc8ff',
  },
  '& .MuiSelect-select': {
    color: '#f4f7ff',
    fontWeight: 500,
  },
};

const Dashboard = () => {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: symbols = [], isLoading: symbolsLoading, error: symbolsError } = useSymbolsQuery();

  const filteredSymbols = useMemo(() => {
    if (!searchTerm) return symbols;
    return symbols.filter((sym) => sym.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, symbols]);

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', pt: 2.5, pb: 2, pl: { xs: 2, md: 33 }, pr: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '3fr 1fr' }, gap: 2 }}>
        <Box>
          <Card className="p-4 md:p-5">
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} alignItems={{ xs: 'stretch', md: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: 'text.secondary', fontSize: 12, mb: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Symbol
                </Typography>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'text.secondary' }}>Symbol</InputLabel>
                  <Select
                    value={symbol}
                    label="Symbol"
                    onChange={(event) => setSymbol(event.target.value)}
                    onOpen={() => setSearchTerm('')}
                    sx={selectStyles}
                    disabled={symbolsLoading}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 320,
                          backgroundColor: '#101626',
                          border: '1px solid rgba(128, 152, 215, 0.2)',
                        },
                      },
                    }}
                  >
                    <MenuItem disableRipple sx={{ backgroundColor: '#101626 !important', p: 1.2 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Buscar par..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </MenuItem>
                    {filteredSymbols.map((sym) => (
                      <MenuItem key={sym} value={sym}>
                        {sym}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: 'text.secondary', fontSize: 12, mb: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Timeframe
                </Typography>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'text.secondary' }}>Timeframe</InputLabel>
                  <Select value={timeframe} label="Timeframe" onChange={(event) => setTimeframe(event.target.value)} sx={selectStyles}>
                    <MenuItem value="1m">1m</MenuItem>
                    <MenuItem value="5m">5m</MenuItem>
                    <MenuItem value="15m">15m</MenuItem>
                    <MenuItem value="1h">1h</MenuItem>
                    <MenuItem value="4h">4h</MenuItem>
                    <MenuItem value="1d">1d</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Stack>

            {symbolsError && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                No se pudieron cargar los símbolos. Intenta recargar la página.
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
              <TradingViewChart symbol={symbol} timeframe={timeframe} />
              <TopCryptoTable />
            </Box>
          </Card>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <IndicatorsPanel symbol={symbol} timeframe={timeframe} />
          <TradingSuggestions symbol={symbol} timeframe={timeframe} />
          <MultiTimeframePanel symbol={symbol} />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
