import React, { useState, useEffect } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import IndicatorsPanel from './IndicatorsPanel';
import MultiTimeframepanel from './MultiTimeframepanel';
import TradingSuggestions from './TradingSuggestions';
import TopCryptoTable from './TopCryptoTable';
import TradingViewChart from './TradingViewChart';
import { Card } from './ui/card';

const DEFAULT_SYMBOL = 'BTCUSDT';
const DEFAULT_TIMEFRAME = '1h';

const Dashboard = () => {
  const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
  const [timeframe, setTimeframe] = useState(DEFAULT_TIMEFRAME);
  const [symbols, setSymbols] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSymbols, setFilteredSymbols] = useState([]);

  useEffect(() => {
    // Fetch symbols from Binance API
    fetch('https://api.binance.com/api/v3/exchangeInfo')
      .then(response => response.json())
      .then(data => {
        const pairs = data.symbols
          .filter(s => s.status === 'TRADING')
          .map(s => s.symbol);
        setSymbols(pairs);
        setFilteredSymbols(pairs);
      })
      .catch(error => {
        console.error('Error fetching symbols:', error);
        setSymbols([]);
        setFilteredSymbols([]);
      });
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = symbols.filter(sym => 
        sym.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSymbols(filtered);
    } else {
      setFilteredSymbols(symbols);
    }
  }, [searchTerm, symbols]);

  const handleSymbolChange = (event) => {
    setSymbol(event.target.value);
  };

  const handleTimeframeChange = (event) => {
    setTimeframe(event.target.value);
  };

  return (
    <Box 
      sx={{ 
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: 'black',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 w-full">
        {/* Panel Principal con Gráfico */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <FormControl fullWidth sx={{ backgroundColor: 'rgba(22, 22, 22, 0.9)', borderRadius: '12px' }}>
                    <InputLabel>Symbol</InputLabel>
                    <Select
                      value={symbol}
                      label="Symbol"
                      onChange={handleSymbolChange}
                      onOpen={() => setSearchTerm('')}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 300,
                            backgroundColor: '#1a1a1a',
                          },
                        },
                        MenuListProps: {
                          style: {
                            backgroundColor: '#1a1a1a',
                          }
                        }
                      }}
                      displayEmpty
                    >
                      <MenuItem sx={{ backgroundColor: '#1a1a1a', '&:hover': { backgroundColor: '#2a2a2a' } }}>
                        <input
                          type="text"
                          placeholder="Search symbol..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #444',
                            borderRadius: '4px',
                            backgroundColor: '#222',
                            color: 'white'
                          }}
                        />
                      </MenuItem>
                      {filteredSymbols.map((sym) => (
                        <MenuItem 
                          key={sym} 
                          value={sym}
                          sx={{
                            backgroundColor: '#1a1a1a',
                            '&:hover': { backgroundColor: '#2a2a2a' },
                            '&.Mui-selected': { backgroundColor: '#333' }
                          }}
                        >
                          {sym}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex-1 ml-4">
                  <FormControl fullWidth sx={{ backgroundColor: 'rgba(22, 22, 22, 0.9)', borderRadius: '12px' }}>
                    <InputLabel>Timeframe</InputLabel>
                    <Select
                      value={timeframe}
                      label="Timeframe"
                      onChange={handleTimeframeChange}
                    >
                      <MenuItem value="1m">1m</MenuItem>
                      <MenuItem value="5m">5m</MenuItem>
                      <MenuItem value="15m">15m</MenuItem>
                      <MenuItem value="1h">1h</MenuItem>
                      <MenuItem value="4h">4h</MenuItem>
                      <MenuItem value="1d">1d</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              <div className="flex flex-col w-full gap-8">
                {/* Sección del gráfico */}
                <div className="w-full">
                  <TradingViewChart
                    symbol={symbol}
                    timeframe={timeframe}
                  />
                </div>

                {/* Sección de la tabla de criptomonedas */}
                <div className="w-full mt-0">
                  <TopCryptoTable />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-4">
          <IndicatorsPanel 
            symbol={symbol} 
            timeframe={timeframe}
          />
          <TradingSuggestions 
            symbol={symbol}
            timeframe={timeframe}
          />
          <MultiTimeframepanel 
            symbol={symbol}
          />
        </div>
      </div>
    </Box>
  );
};

export default Dashboard;
