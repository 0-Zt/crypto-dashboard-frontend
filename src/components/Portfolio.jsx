import React, { useState, useCallback } from 'react';
import { Box, Grid, Card, Typography, Container } from '@mui/material';
import PortfolioView from './Portfolio/PortfolioView';
import { TrendingUp, TrendingDown, PieChart } from 'lucide-react';

const Portfolio = () => {
  const [portfolioStats, setPortfolioStats] = useState({
    totalValue: 0,
    totalProfit: 0,
    profitPercentage: 0
  });

  const handleUpdateTotalValue = useCallback((stats) => {
    setPortfolioStats(stats);
  }, []);

  const cardStyle = {
    background: 'linear-gradient(145deg, rgba(15, 22, 41, 0.92), rgba(10, 14, 25, 0.94))',
    borderRadius: '16px',
    p: 3,
    height: '100%',
    border: '1px solid rgba(117, 139, 199, 0.22)',
    boxShadow: '0 18px 40px rgba(0,0,0,0.32)',
    textAlign: 'left',
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', pt: 2.5, pb: 4, pl: { xs: 2, md: 33 }, pr: 2 }}>
      <Container maxWidth="xl" sx={{ px: '0 !important' }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ color: '#eef2ff', mb: 0.5 }}>
            Mi Portafolio
          </Typography>
          <Typography sx={{ color: '#9fb0db' }}>Resumen de rendimiento y gestión de activos en tiempo real.</Typography>
        </Box>

        <Grid container spacing={2.2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              <TrendingUp size={22} color="#47d7ff" />
              <Typography variant="subtitle2" sx={{ color: '#9fb0db', mt: 2 }}>
                Valor Total del Portfolio
              </Typography>
              <Typography variant="h5" sx={{ color: '#fff', mt: 1 }}>{formatCurrency(portfolioStats.totalValue)}</Typography>
              <Typography variant="body2" sx={{ color: '#47d7ff', mt: 0.8 }}>
                {portfolioStats.profitPercentage >= 0 ? '+' : ''}
                {portfolioStats.profitPercentage.toFixed(2)}%
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              {portfolioStats.totalProfit >= 0 ? <TrendingUp size={22} color="#24d69a" /> : <TrendingDown size={22} color="#ff6b87" />}
              <Typography variant="subtitle2" sx={{ color: '#9fb0db', mt: 2 }}>
                Ganancia/Pérdida Total
              </Typography>
              <Typography variant="h5" sx={{ color: '#fff', mt: 1 }}>
                {portfolioStats.totalProfit >= 0 ? '+' : ''}
                {formatCurrency(portfolioStats.totalProfit)}
              </Typography>
              <Typography variant="body2" sx={{ color: portfolioStats.totalProfit >= 0 ? '#24d69a' : '#ff6b87', mt: 0.8 }}>
                Desde el inicio
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              <PieChart size={22} color="#9b8cff" />
              <Typography variant="subtitle2" sx={{ color: '#9fb0db', mt: 2 }}>
                Rendimiento Total
              </Typography>
              <Typography variant="h5" sx={{ color: '#fff', mt: 1 }}>
                {portfolioStats.profitPercentage >= 0 ? '+' : ''}
                {portfolioStats.profitPercentage.toFixed(2)}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#9b8cff', mt: 0.8 }}>ROI Total</Typography>
            </Card>
          </Grid>
        </Grid>

        <PortfolioView onUpdateTotalValue={handleUpdateTotalValue} />
      </Container>
    </Box>
  );
};

export default Portfolio;
