import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Activity, BarChart2, Waves, TrendingUp } from 'lucide-react';

const InfoDialog = ({ open, onClose }) => {
  const indicators = [
    {
      name: 'RSI (Índice de Fuerza Relativa)',
      icon: <Activity className="w-5 h-5 text-indigo-500" />,
      description: 'Mide la velocidad y magnitud de los movimientos direccionales de los precios. Valores por encima de 70 indican sobrecompra, mientras que valores por debajo de 30 indican sobreventa.',
      interpretation: [
        'RSI > 70: Posible sobrecompra, señal de venta',
        'RSI < 30: Posible sobreventa, señal de compra',
        'RSI = 50: Nivel neutral'
      ]
    },
    {
      name: 'MACD (Convergencia/Divergencia de Medias Móviles)',
      icon: <BarChart2 className="w-5 h-5 text-indigo-500" />,
      description: 'Muestra la relación entre dos medias móviles de los precios. Es útil para identificar cambios en la fuerza, dirección, momentum y duración de una tendencia.',
      interpretation: [
        'MACD cruza por encima de la señal: Señal alcista',
        'MACD cruza por debajo de la señal: Señal bajista',
        'Divergencias: Posibles cambios de tendencia'
      ]
    },
    {
      name: 'Bandas de Bollinger',
      icon: <Waves className="w-5 h-5 text-indigo-500" />,
      description: 'Son bandas de volatilidad que se expanden y contraen basadas en la desviación estándar del precio.',
      interpretation: [
        'Precio toca banda superior: Posible sobrecompra',
        'Precio toca banda inferior: Posible sobreventa',
        'Estrechamiento de bandas: Posible movimiento fuerte próximo'
      ]
    },
    {
      name: 'Análisis de Tendencia',
      icon: <TrendingUp className="w-5 h-5 text-indigo-500" />,
      description: 'Combina múltiples indicadores para determinar la dirección general del mercado.',
      interpretation: [
        'Tendencia Alcista: Precios y EMAs en ascenso',
        'Tendencia Bajista: Precios y EMAs en descenso',
        'Tendencia Lateral: Precios moviéndose en rango'
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
        className: 'bg-slate-900 border border-slate-800'
      }}
      BackdropProps={{
        className: 'backdrop-blur-sm bg-slate-900/20'
      }}
    >
      <div className="border-b border-slate-800/50">
        <DialogTitle className="text-xl font-semibold text-slate-200 px-6 py-4">
          Glosario de Indicadores
        </DialogTitle>
      </div>
      <DialogContent className="px-6 py-6">
        <div className="space-y-6">
          {indicators.map((indicator, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-3">
                {indicator.icon}
                <h3 className="text-lg font-medium text-slate-200">
                  {indicator.name}
                </h3>
              </div>
              <p className="text-slate-400 mb-4">
                {indicator.description}
              </p>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-300 mb-2">
                  Interpretación:
                </h4>
                <ul className="space-y-1">
                  {indicator.interpretation.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-400 flex items-start">
                      <span className="text-indigo-500 mr-2">•</span>
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

export default InfoDialog;
