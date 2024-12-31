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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from 'lucide-react';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getCurrentPrice } from '../../config/api';
import { useAuth } from '../../context/AuthContext';

const PortfolioView = ({ onUpdateTotalValue }) => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [currentPrices, setCurrentPrices] = useState({});
  const [newAsset, setNewAsset] = useState({
    symbol: '',
    quantity: '',
    purchasePrice: '',
  });

  const fetchPortfolio = useCallback(async () => {
    if (!user) return;
    
    try {
      // Usar la subcolección portfolios bajo el userId
      const portfolioRef = collection(db, 'portfolios', user.uid, 'assets');
      const querySnapshot = await getDocs(portfolioRef);
      const portfolioData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        quantity: parseFloat(doc.data().quantity),
        purchasePrice: parseFloat(doc.data().purchasePrice)
      }));
      setPortfolio(portfolioData);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  }, [user]);

  const updateTotalValues = useCallback(async (prices, currentPortfolio) => {
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
        totalProfit += (assetValue - invested);
      }
    }

    if (onUpdateTotalValue) {
      onUpdateTotalValue({
        totalValue: totalPortfolioValue,
        totalProfit: totalProfit,
        profitPercentage: totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0
      });
    }
  }, [onUpdateTotalValue]);

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
    } else if (onUpdateTotalValue) {
      onUpdateTotalValue({
        totalValue: 0,
        totalProfit: 0,
        profitPercentage: 0
      });
    }
  }, [portfolio, fetchPrices, onUpdateTotalValue]);

  const handleAddAsset = async () => {
    if (!user || !newAsset.symbol || !newAsset.quantity || !newAsset.purchasePrice) return;

    try {
      const assetData = {
        symbol: newAsset.symbol.toUpperCase(),
        quantity: parseFloat(newAsset.quantity),
        purchasePrice: parseFloat(newAsset.purchasePrice),
        timestamp: new Date().toISOString()
      };

      // Agregar a la subcolección assets bajo el userId
      const portfolioRef = collection(db, 'portfolios', user.uid, 'assets');
      await addDoc(portfolioRef, assetData);
      setNewAsset({ symbol: '', quantity: '', purchasePrice: '' });
      await fetchPortfolio();
    } catch (error) {
      console.error('Error adding asset:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Eliminar de la subcolección assets bajo el userId
      const docRef = doc(db, 'portfolios', user.uid, 'assets', id);
      await deleteDoc(docRef);
      await fetchPortfolio();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const handleOpenDialog = (asset = null) => {
    if (asset) {
      setNewAsset({
        symbol: asset.symbol,
        quantity: asset.quantity.toString(),
        purchasePrice: asset.purchasePrice.toString(),
      });
    } else {
      setNewAsset({ symbol: '', quantity: '', purchasePrice: '' });
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ color: 'white' }}>
            Mis Activos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: 'rgba(0, 242, 234, 0.1)',
              color: '#00f2ea',
              '&:hover': {
                backgroundColor: 'rgba(0, 242, 234, 0.2)',
              },
            }}
          >
            Agregar Activo
          </Button>
        </Box>

        <TableContainer 
          component={Paper} 
          sx={{ 
            backgroundColor: 'rgba(22, 22, 22, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Símbolo</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cantidad</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Precio de Compra</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Precio Actual</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Valor Total</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ganancia/Pérdida</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolio.map((asset) => {
                const currentPrice = currentPrices[asset.symbol];
                const totalValue = currentPrice ? asset.quantity * currentPrice : 0;
                const profit = currentPrice
                  ? (currentPrice - asset.purchasePrice) * asset.quantity
                  : 0;
                const profitPercentage = asset.purchasePrice
                  ? ((currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100
                  : 0;

                return (
                  <TableRow key={asset.id}>
                    <TableCell sx={{ color: 'white' }}>{asset.symbol}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{asset.quantity}</TableCell>
                    <TableCell sx={{ color: 'white' }}>${asset.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      {currentPrice !== null && currentPrice !== undefined 
                        ? `$${Number(currentPrice).toFixed(2)}`
                        : 'Cargando...'}
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      ${totalValue.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          color: profit >= 0 ? '#00ff88' : '#ff3358',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        {profit >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        ${Math.abs(profit).toFixed(2)} ({profitPercentage.toFixed(2)}%)
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton
                          onClick={() => handleOpenDialog(asset)}
                          sx={{ 
                            color: '#00f2ea',
                            '&:hover': { backgroundColor: 'rgba(0, 242, 234, 0.1)' }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          onClick={() => handleDelete(asset.id)}
                          sx={{ 
                            color: '#ff3358',
                            '&:hover': { backgroundColor: 'rgba(255, 51, 88, 0.1)' }
                          }}
                        >
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
    </Box>
  );
};

export default PortfolioView;
