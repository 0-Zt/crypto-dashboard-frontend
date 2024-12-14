import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, Box, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShowChartIcon from '@mui/icons-material/ShowChart'; // Para EMA
import FilterDramaIcon from '@mui/icons-material/FilterDrama'; // Para Bollinger (nubes)
import TrendingUpIcon from '@mui/icons-material/TrendingUp'; // Para RSI
import TimelineIcon from '@mui/icons-material/Timeline'; // Para MACD
import BarChartIcon from '@mui/icons-material/BarChart'; // Para ADX

function InfoDialog({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Typography variant="h6">Glosario de Indicadores</Typography>
        <IconButton onClick={onClose} color="inherit">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt:1 }}>
        <Box sx={{ mb:2 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:1 }}>
            <ShowChartIcon color="primary"/>
            <Typography variant="h6">EMA (Media Móvil Exponencial)</Typography>
          </Box>
          <Typography variant="body1" paragraph>
            La EMA da más peso a los precios recientes, respondiendo más rápidamente a los cambios de precio.
            EMA 21 (corto plazo), EMA 50 (mediano plazo), EMA 200 (largo plazo) ayudan a identificar tendencia.
          </Typography>
        </Box>
        <Divider sx={{mb:2}}/>

        <Box sx={{ mb:2 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:1 }}>
            <FilterDramaIcon color="primary"/>
            <Typography variant="h6">Bandas de Bollinger</Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Miden la volatilidad del mercado. Si el precio toca la banda superior, puede indicar sobrecompra; la banda inferior, sobreventa.
          </Typography>
        </Box>
        <Divider sx={{mb:2}}/>

        <Box sx={{ mb:2 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:1 }}>
            <TrendingUpIcon color="primary"/>
            <Typography variant="h6">RSI (Índice de Fuerza Relativa)</Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Oscilador que mide la velocidad y el cambio del movimiento de precios. Valores {'>'}70: sobrecompra, {'<'}30: sobreventa.
          </Typography>
        </Box>
        <Divider sx={{mb:2}}/>

        <Box sx={{ mb:2 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:1 }}>
            <TimelineIcon color="primary"/>
            <Typography variant="h6">MACD</Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Mide la diferencia entre dos EMAs (generalmente 12 y 26). Si la línea MACD cruza por encima de la señal, se interpreta como impulso alcista.
          </Typography>
        </Box>
        <Divider sx={{mb:2}}/>

        <Box sx={{ mb:2 }}>
          <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:1 }}>
            <BarChartIcon color="primary"/>
            <Typography variant="h6">ADX (Índice Direccional Promedio)</Typography>
          </Box>
          <Typography variant="body1" paragraph>
            Indica la fuerza de la tendencia. Un valor alto ({'>'}25) suele indicar una tendencia fuerte, sea alcista o bajista.
          </Typography>
        </Box>
        <Divider sx={{mb:2}}/>

        <Typography variant="body2" color="text.secondary" paragraph>
          Estos indicadores no garantizan resultados futuros. Úsalos en conjunto y con gestión de riesgo adecuada.
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default InfoDialog;
