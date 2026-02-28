import React, { useMemo, useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Stack, Typography } from '@mui/material';
import IndicatorsPanel from './IndicatorsPanel';
import MultiTimeframepanel from './MultiTimeframepanel';
import TradingSuggestions from './TradingSuggestions';
import TopCryptoTable from './TopCryptoTable';
import TradingViewChart from './TradingViewChart';
import { Card } from './ui/card';
import { useSymbols } from '../hooks/useSymbols';

const DEFAULT_SYMBOL = 'BTCUSDT';
const DEFAULT_TIMEFRAME = '1h';

const selectStyles = {
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(128, 152, 215, 0.4)',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(53, 232, 255, 0.7)',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#35e8ff',
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
  const { data: symbols = [] } = useSymbols();

  const filteredSymbols = useMemo(() => {
    if (!searchTerm) return symbols;
    return symbols.filter((sym) => sym.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, symbols]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        pt: { xs: 10, md: 11 },
        pb: 3,
        pl: { xs: 1.5, md: 10.5 },
        pr: { xs: 1.5, md: 2.5 },
      }}
    >
      <Box sx={{ mb: 2.5 }}>
        <Typography sx={{ color: '#eef2ff', fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
          Market Dashboard
        </Typography>
        <Typography sx={{ color: '#9fb0db', fontSize: 13 }}>
          Seguimiento en tiempo real con señales, contexto multi-timeframe y ranking por volumen.
        </Typography>
      </Box>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4 md:p-5">
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} alignItems={{ xs: 'stretch', md: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#9eb0dd', fontSize: 12, mb: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Symbol
                </Typography>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#9eb0dd' }}>Symbol</InputLabel>
                  <Select
                    value={symbol}
                    label="Symbol"
                    onChange={(event) => setSymbol(event.target.value)}
                    onOpen={() => setSearchTerm('')}
                    sx={selectStyles}
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
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: '#f4f7ff',
                            '& fieldset': { borderColor: 'rgba(128, 152, 215, 0.4)' },
                          },
                        }}
                      />
                    </MenuItem>
                    {filteredSymbols.map((sym) => (
                      <MenuItem key={sym} value={sym} sx={{ color: '#dce4ff', '&:hover': { backgroundColor: 'rgba(53, 80, 145, 0.2)' } }}>
                        {sym}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ color: '#9eb0dd', fontSize: 12, mb: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>
                  Timeframe
                </Typography>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#9eb0dd' }}>Timeframe</InputLabel>
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

            <div className="flex flex-col w-full gap-6 mt-6">
              <div className="w-full">
                <TradingViewChart symbol={symbol} timeframe={timeframe} />
              </div>
              <div className="w-full mt-0">
                <TopCryptoTable />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 self-start">
          <IndicatorsPanel symbol={symbol} timeframe={timeframe} />
          <TradingSuggestions symbol={symbol} timeframe={timeframe} />
          <MultiTimeframepanel symbol={symbol} />
        </div>
      </div>
    </Box>
  );
};

export default Dashboard;
