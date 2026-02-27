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
    backgroundColor: 'rgba(22, 22, 22, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    p: 3,
    height: '100%',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const iconStyle = {
    p: 1,
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    mb: 2
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        py: 4
      }}
    >
      <Container 
        maxWidth="xl"
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Typography variant="h4" component="h1" sx={{ color: 'white' }}>
            Mi Portafolio de Criptomonedas
          </Typography>
          {/* <Button
            variant="contained"
            onClick={() => logout()}
            sx={{
              backgroundColor: '#1F1F22',
              '&:hover': {
                backgroundColor: '#2F2F32'
              }
            }}
          >
            Cerrar Sesión
          </Button> */}
        </Box>

        {/* Tarjetas de resumen */}
        <Grid 
          container 
          spacing={3} 
          sx={{ 
            mb: 4, 
            width: '100%', 
            justifyContent: 'center' 
          }}
        >
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              <Box sx={{ ...iconStyle, backgroundColor: 'rgba(0, 242, 234, 0.1)' }}>
                <TrendingUp size={24} color="#00f2ea" />
              </Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Valor Total del Portfolio
              </Typography>
              <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
                {formatCurrency(portfolioStats.totalValue)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#00f2ea' }}>
                {portfolioStats.profitPercentage >= 0 ? '+' : ''}
                {portfolioStats.profitPercentage.toFixed(2)}%
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              <Box sx={{ ...iconStyle, backgroundColor: 'rgba(121, 40, 202, 0.1)' }}>
                {portfolioStats.totalProfit >= 0 ? (
                  <TrendingUp size={24} color="#7928ca" />
                ) : (
                  <TrendingDown size={24} color="#7928ca" />
                )}
              </Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Ganancia/Pérdida Total
              </Typography>
              <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
                {portfolioStats.totalProfit >= 0 ? '+' : ''}
                {formatCurrency(portfolioStats.totalProfit)}
              </Typography>
              <Typography variant="body2" sx={{ color: '#7928ca' }}>
                Desde el inicio
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={cardStyle}>
              <Box sx={{ ...iconStyle, backgroundColor: 'rgba(255, 99, 102, 0.1)' }}>
                <PieChart size={24} color="#ff6366" />
              </Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Rendimiento Total
              </Typography>
              <Typography variant="h4" sx={{ color: '#fff', mb: 1 }}>
                {portfolioStats.profitPercentage >= 0 ? '+' : ''}
                {portfolioStats.profitPercentage.toFixed(2)}%
              </Typography>
              <Typography variant="body2" sx={{ color: '#ff6366' }}>
                ROI Total
              </Typography>
            </Card>
          </Grid>
        </Grid>

        <Box 
          sx={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center' 
          }}
        >
          <PortfolioView onUpdateTotalValue={handleUpdateTotalValue} />
        </Box>
      </Container>
    </Box>
  );
};

export default Portfolio;
