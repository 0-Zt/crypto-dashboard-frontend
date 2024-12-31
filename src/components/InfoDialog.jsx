import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { 
  Activity, 
  BarChart2, 
  Waves, 
  TrendingUp, 
  X, 
  LineChart, 
  CandlestickChart 
} from 'lucide-react';
import PropTypes from 'prop-types';

const InfoDialog = ({ open, onClose }) => {
  const indicators = [
    {
      name: 'RSI (Índice de Fuerza Relativa)',
      icon: <Activity className="w-5 h-5 text-[#00f2ea]" />,
      description: 'Mide la velocidad y magnitud de los movimientos direccionales de los precios. Valores por encima de 70 indican sobrecompra, mientras que valores por debajo de 30 indican sobreventa.',
      interpretation: [
        'RSI > 70: Posible sobrecompra, señal de venta',
        'RSI < 30: Posible sobreventa, señal de compra',
        'RSI = 50: Nivel neutral'
      ]
    },
    {
      name: 'MACD (Convergencia/Divergencia de Medias Móviles)',
      icon: <BarChart2 className="w-5 h-5 text-[#00f2ea]" />,
      description: 'Muestra la relación entre dos medias móviles de los precios. Es útil para identificar cambios en la fuerza, dirección, momentum y duración de una tendencia.',
      interpretation: [
        'MACD cruza por encima de la señal: Señal alcista',
        'MACD cruza por debajo de la señal: Señal bajista',
        'Divergencias: Posibles cambios de tendencia'
      ]
    },
    {
      name: 'Bandas de Bollinger',
      icon: <Waves className="w-5 h-5 text-[#00f2ea]" />,
      description: 'Son bandas de volatilidad que se expanden y contraen basadas en la desviación estándar del precio.',
      interpretation: [
        'Precio toca banda superior: Posible sobrecompra',
        'Precio toca banda inferior: Posible sobreventa',
        'Estrechamiento de bandas: Posible movimiento fuerte próximo'
      ]
    },
    {
      name: 'Momentum',
      icon: <TrendingUp className="w-5 h-5 text-[#00f2ea]" />,
      description: 'Mide la velocidad del cambio en los precios. Ayuda a identificar la fuerza de una tendencia y posibles puntos de reversión.',
      interpretation: [
        'Momentum positivo y creciente: Tendencia alcista fuerte',
        'Momentum negativo y decreciente: Tendencia bajista fuerte',
        'Momentum cruza cero: Posible cambio de tendencia',
        'Divergencias con precio: Señal de debilidad en la tendencia'
      ]
    },
    {
      name: 'VPT (Volume Price Trend)',
      icon: <BarChart2 className="w-5 h-5 text-[#00f2ea]" />,
      description: 'Relaciona el volumen con los cambios de precio para medir la fuerza de una tendencia. Útil para confirmar movimientos y detectar divergencias.',
      interpretation: [
        'VPT sube con precio: Confirma tendencia alcista',
        'VPT baja con precio: Confirma tendencia bajista',
        'Divergencia alcista: VPT sube mientras precio baja',
        'Divergencia bajista: VPT baja mientras precio sube'
      ]
    },
    {
      name: 'Niveles Clave',
      icon: <LineChart className="w-5 h-5 text-[#00f2ea]" />,
      description: 'Identifica niveles de soporte y resistencia basados en el comportamiento histórico del precio y volumen.',
      interpretation: [
        'Soporte (línea verde): Nivel donde el precio tiende a rebotar hacia arriba',
        'Resistencia (línea roja): Nivel donde el precio tiende a rebotar hacia abajo',
        'Fuerza del nivel: Basada en número de toques y volumen',
        'Ruptura de nivel: Señal de posible continuación del movimiento'
      ]
    },
    {
      name: 'Patrones de Velas',
      icon: <CandlestickChart className="w-5 h-5 text-[#00f2ea]" />,
      description: 'Detecta automáticamente formaciones específicas en las velas que pueden indicar reversiones o continuaciones.',
      interpretation: [
        'Patrón alcista (verde): Posible movimiento hacia arriba',
        'Patrón bajista (rojo): Posible movimiento hacia abajo',
        'Doji: Indecisión en el mercado',
        'Patrones de reversión: Mayor probabilidad de cambio de tendencia',
        'Patrones de continuación: Mayor probabilidad de continuar tendencia'
      ]
    }
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: '#0f0f0f',
          border: '1px solid #1F1F22',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          color: '#fff'
        }
      }}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(8px)'
        }
      }}
    >
      <div className="border-b border-[#1F1F22]">
        <DialogTitle className="flex justify-between items-center text-xl font-semibold text-white px-6 py-4">
          Guía de Indicadores y Análisis Técnico
          <IconButton 
            onClick={onClose}
            size="small"
            sx={{ 
              color: '#fff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <X className="w-5 h-5" />
          </IconButton>
        </DialogTitle>
      </div>
      <DialogContent className="px-6 py-6">
        <div className="space-y-6">
          {indicators.map((indicator, index) => (
            <div
              key={index}
              className="bg-[#1a1a1a] border border-[#1F1F22] rounded-xl p-5 shadow-lg hover:bg-[#222] transition-colors duration-200"
            >
              <div className="flex items-center gap-3 mb-3">
                {indicator.icon}
                <h3 className="text-lg font-medium text-white">
                  {indicator.name}
                </h3>
              </div>
              <p className="text-gray-400 mb-4">
                {indicator.description}
              </p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300 mb-2">
                  Interpretación:
                </h4>
                <ul className="space-y-1">
                  {indicator.interpretation.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-start">
                      <span className="text-white mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

InfoDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default InfoDialog;
