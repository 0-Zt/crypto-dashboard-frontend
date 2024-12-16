import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { API_URL } from '../config/api';

function TradingSuggestions({ symbol, timeframe }) {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestion = async () => {
      if (!symbol) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // URL completa al backend
        const response = await fetch(`${API_URL}/api/analysis/${symbol}?interval=${timeframe}`);
        if (!response.ok) {
          throw new Error('Error al obtener análisis');
        }
        const data = await response.json();
        setSuggestion(data.suggestion);
      } catch (err) {
        setError(err.message);
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestion();
  }, [symbol, timeframe]);

  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    // Mostrar todos los decimales significativos, eliminar ceros finales
    return price.toFixed(8).replace(/\.?0+$/, '');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!suggestion || suggestion.type === 'NEUTRAL' || suggestion.type === 'ERROR') {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        {suggestion?.message || 'No hay sugerencias de trading disponibles en este momento.'}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Sugerencias de Trading
      </Typography>
      <Card 
        sx={{ 
          mb: 2,
          bgcolor: suggestion.type === 'LONG' ? 'success.dark' : 'error.dark',
          color: 'white'
        }}
      >
        <CardContent>
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: 'white' }}>
                Tipo de Operación:
              </Typography>
              <Chip
                icon={suggestion.type === 'LONG' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                label={suggestion.type === 'LONG' ? 'COMPRA' : 'VENTA'}
                color={suggestion.type === 'LONG' ? 'success' : 'error'}
                sx={{ 
                  bgcolor: suggestion.type === 'LONG' ? 'success.light' : 'error.light',
                  '& .MuiChip-label': { color: 'white' },
                  '& .MuiChip-icon': { color: 'white' }
                }}
              />
            </Stack>

            <Typography variant="body1" sx={{ mb: 1, color: 'white' }}>
              Punto de Entrada: ${formatPrice(suggestion.entry)}
            </Typography>

            <Typography variant="body1" sx={{ mb: 1, color: 'white' }}>
              Stop Loss: ${formatPrice(suggestion.stopLoss)}
            </Typography>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, color: 'white' }}>
              Objetivos de Precio:
            </Typography>
            {suggestion.targets.map((target, index) => (
              <Typography key={index} variant="body1" sx={{ ml: 2, color: 'white' }}>
                Target {index + 1}: ${formatPrice(target)}
              </Typography>
            ))}

            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ color: 'white' }}>
                Confianza: {suggestion.confidence}%
              </Typography>
              <Typography variant="body1" sx={{ color: 'white' }}>
                Riesgo: {suggestion.risk}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Typography variant="caption" color="text.secondary">
        * Las sugerencias están basadas en análisis técnico y no garantizan resultados. Siempre realiza tu propio análisis antes de operar.
      </Typography>
    </Box>
  );
}

export default TradingSuggestions;
