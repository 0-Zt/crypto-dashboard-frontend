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

  if (!suggestion) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Sugerencias de Trading
      </Typography>
      
      <Card sx={{ 
        mb: 2, 
        bgcolor: suggestion.type === 'LONG' ? 'success.dark' : 
                 suggestion.type === 'SHORT' ? 'error.dark' : 
                 'warning.dark'
      }}>
        <CardContent>
          {suggestion.type !== 'NEUTRAL' ? (
            <>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                {suggestion.type === 'LONG' ? (
                  <TrendingUpIcon color="success" />
                ) : (
                  <TrendingDownIcon color="error" />
                )}
                <Typography variant="h6">
                  {suggestion.type === 'LONG' ? 'Posición Larga' : 'Posición Corta'}
                </Typography>
                <Chip
                  label={`Confianza ${suggestion.confidence}%`}
                  color={suggestion.confidence > 70 ? 'success' : 'warning'}
                  size="small"
                />
                <Chip
                  label={`Riesgo ${suggestion.risk}`}
                  color={suggestion.risk === 'Alto' ? 'error' : 'warning'}
                  size="small"
                />
              </Stack>

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Precio de Entrada
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                $ {suggestion.entry}
              </Typography>

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Stop Loss
              </Typography>
              <Typography variant="h6" sx={{ mb: 2 }}>
                $ {suggestion.stopLoss}
              </Typography>

              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Objetivos:
              </Typography>
              {suggestion.targets.map((target, index) => (
                <Typography key={index} variant="body1">
                  Target {index + 1}: $ {target}
                </Typography>
              ))}
            </>
          ) : (
            <Typography variant="body1">
              {suggestion.message}
            </Typography>
          )}
        </CardContent>
      </Card>
      
      <Typography variant="caption" color="text.secondary">
        * Las sugerencias están basadas en análisis técnico y no garantizan resultados. Siempre realiza tu propio análisis antes de operar.
      </Typography>
    </Box>
  );
}

export default TradingSuggestions;
