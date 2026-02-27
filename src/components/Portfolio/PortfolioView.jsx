import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from 'lucide-react';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getCurrentPrice } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const emptyAsset = { symbol: '', quantity: '', purchasePrice: '' };

const PortfolioView = ({ onUpdateTotalValue }) => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});
  const fetchPortfolio = useCallback(async () => {
    if (!user) return;

    try {
      const portfolioRef = collection(db, 'portfolios', user.uid, 'assets');
      const querySnapshot = await getDocs(portfolioRef);
      const portfolioData = querySnapshot.docs.map((assetDoc) => ({
        id: assetDoc.id,
        ...assetDoc.data(),
        quantity: parseFloat(assetDoc.data().quantity),
        purchasePrice: parseFloat(assetDoc.data().purchasePrice),
      }));
      setPortfolio(portfolioData);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  }, [user]);

  const updateTotalValues = useCallback(
    async (prices, currentPortfolio) => {
      let totalPortfolioValue = 0;
      let totalProfit = 0;
      let totalInvested = 0;

      for (const asset of currentPortfolio) {
        const price = prices[asset.symbol];
        if (price) {
          const assetValue = price * asset.quantity;
          const invested = asset.purchasePrice * asset.quantity;
          totalPortfolioValue += assetValue;
          totalInvested += invested;
          totalProfit += assetValue - invested;
        }
      }

      if (onUpdateTotalValue) {
        onUpdateTotalValue({
          totalValue: totalPortfolioValue,
          totalProfit,
          profitPercentage: totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0,
        });
      }
    },
    [onUpdateTotalValue]
  );

  const fetchPrices = useCallback(async () => {
    const prices = {};
    for (const asset of portfolio) {
      try {
        const priceData = await getCurrentPrice(asset.symbol);
        prices[asset.symbol] = priceData.currentPrice;
      } catch (error) {
        console.error(`Error fetching price for ${asset.symbol}:`, error);
        prices[asset.symbol] = null;
      }
    }
    setCurrentPrices(prices);
    updateTotalValues(prices, portfolio);
  }, [portfolio, updateTotalValues]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  useEffect(() => {
    if (portfolio.length > 0) {
      fetchPrices();
      const interval = setInterval(fetchPrices, 30000);
      return () => clearInterval(interval);
    }

  const handleDelete = async (id) => {
    try {
      const docRef = doc(db, 'portfolios', user.uid, 'assets', id);
      await deleteDoc(docRef);
      await fetchPortfolio();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleOpenDialog = () => {};

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mt: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ color: '#eef2ff' }}>
            Mis Activos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{
              background: 'linear-gradient(135deg, #47d7ff 0%, #9b8cff 100%)',
              color: '#0a1020',
              '&:hover': { opacity: 0.95 },
            }}
          >
            Agregar Activo
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            background: 'linear-gradient(145deg, rgba(15,22,41,.92), rgba(10,14,25,.94))',
            borderRadius: '16px',
            border: '1px solid rgba(117, 139, 199, 0.22)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {['Símbolo', 'Cantidad', 'Precio Compra', 'Precio Actual', 'Valor Total', 'Ganancia/Pérdida', 'Acciones'].map((head) => (
                  <TableCell key={head} sx={{ color: '#9fb0db', fontWeight: 700 }}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolio.map((asset) => {
                const currentPrice = currentPrices[asset.symbol];
                const totalValue = currentPrice ? asset.quantity * currentPrice : 0;
                const profit = currentPrice ? (currentPrice - asset.purchasePrice) * asset.quantity : 0;
                const profitPercentage = asset.purchasePrice ? ((currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100 : 0;

                return (
                  <TableRow key={asset.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(38, 52, 90, 0.35)' } }}>
                    <TableCell sx={{ color: '#fff', fontWeight: 600 }}>{asset.symbol}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{asset.quantity}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>${asset.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>
                      {currentPrice !== null && currentPrice !== undefined ? `$${Number(currentPrice).toFixed(2)}` : 'Cargando...'}
                    </TableCell>
                    <TableCell sx={{ color: '#fff' }}>${totalValue.toFixed(2)}</TableCell>
                    <TableCell>
                      <Box sx={{ color: profit >= 0 ? '#24d69a' : '#ff6b87', display: 'flex', alignItems: 'center', gap: 1 }}>
                        {profit >= 0 ? <TrendingUpIcon size={16} /> : <TrendingDownIcon size={16} />}
                        ${Math.abs(profit).toFixed(2)} ({profitPercentage.toFixed(2)}%)
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={handleOpenDialog}
                          sx={{ 
                            color: '#00f2ea',
                            '&:hover': { backgroundColor: 'rgba(0, 242, 234, 0.1)' }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton onClick={() => handleDelete(asset.id)} sx={{ color: '#ff6b87' }}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'linear-gradient(145deg, rgba(15,22,41,.97), rgba(10,14,25,.98))',
            border: '1px solid rgba(117, 139, 199, 0.28)',
            minWidth: { xs: '100%', sm: 440 },
          },
        }}
      >
        <DialogTitle sx={{ color: '#eef2ff' }}>{editingId ? 'Editar Activo' : 'Agregar Activo'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Símbolo (ej: BTCUSDT)" value={newAsset.symbol} onChange={(e) => setNewAsset((p) => ({ ...p, symbol: e.target.value }))} fullWidth />
            <TextField label="Cantidad" type="number" value={newAsset.quantity} onChange={(e) => setNewAsset((p) => ({ ...p, quantity: e.target.value }))} fullWidth />
            <TextField label="Precio de compra" type="number" value={newAsset.purchasePrice} onChange={(e) => setNewAsset((p) => ({ ...p, purchasePrice: e.target.value }))} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleCloseDialog} color="inherit">Cancelar</Button>
          <Button onClick={handleSaveAsset} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PortfolioView;
