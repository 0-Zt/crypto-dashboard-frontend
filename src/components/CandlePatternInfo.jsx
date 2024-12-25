import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Info } from 'lucide-react';

const candlePatterns = {
  'Doji': {
    image: 'https://i.imgur.com/8RJ6xCF.png',
    description: 'El Doji se forma cuando los precios de apertura y cierre son prácticamente iguales. Representa indecisión en el mercado y puede señalar un posible cambio de tendencia.',
    characteristics: [
      'Cuerpo muy pequeño o inexistente',
      'Las sombras pueden variar en longitud',
      'Más significativo después de una tendencia definida'
    ],
    interpretation: 'Señal de indecisión que puede preceder a un cambio de tendencia. Su importancia aumenta después de una tendencia alcista o bajista prolongada.'
  },
  'Hammer': {
    image: 'https://i.imgur.com/QZwQKZ6.png',
    description: 'El Hammer es un patrón alcista que se forma en la parte inferior de una tendencia bajista. Tiene un cuerpo pequeño y una sombra inferior larga.',
    characteristics: [
      'Cuerpo pequeño en la parte superior',
      'Sombra inferior al menos 2 veces el tamaño del cuerpo',
      'Poca o ninguna sombra superior'
    ],
    interpretation: 'Señal alcista, especialmente cuando aparece en la parte inferior de una tendencia bajista. Indica que los compradores están tomando el control.'
  },
  'Shooting Star': {
    image: 'https://i.imgur.com/Y5H4Jgp.png',
    description: 'El Shooting Star es un patrón bajista que se forma en la parte superior de una tendencia alcista. Tiene un cuerpo pequeño y una sombra superior larga.',
    characteristics: [
      'Cuerpo pequeño en la parte inferior',
      'Sombra superior al menos 2 veces el tamaño del cuerpo',
      'Poca o ninguna sombra inferior'
    ],
    interpretation: 'Señal bajista, especialmente cuando aparece en la parte superior de una tendencia alcista. Indica que los vendedores están tomando el control.'
  },
  'Engulfing Alcista': {
    image: 'https://i.imgur.com/L5LR5WX.png',
    description: 'Patrón de dos velas donde una vela alcista (verde) envuelve completamente el cuerpo de la vela bajista (roja) anterior.',
    characteristics: [
      'Dos velas de colores opuestos',
      'La segunda vela envuelve completamente el cuerpo de la primera',
      'Aparece en tendencia bajista'
    ],
    interpretation: 'Fuerte señal alcista, especialmente al final de una tendencia bajista. Indica que los compradores han superado a los vendedores.'
  },
  'Engulfing Bajista': {
    image: 'https://i.imgur.com/NQzFX4N.png',
    description: 'Patrón de dos velas donde una vela bajista (roja) envuelve completamente el cuerpo de la vela alcista (verde) anterior.',
    characteristics: [
      'Dos velas de colores opuestos',
      'La segunda vela envuelve completamente el cuerpo de la primera',
      'Aparece en tendencia alcista'
    ],
    interpretation: 'Fuerte señal bajista, especialmente al final de una tendencia alcista. Indica que los vendedores han superado a los compradores.'
  }
};

const CandlePatternInfo = ({ open, onClose, patternName }) => {
  const pattern = candlePatterns[patternName];

  if (!pattern) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
          {patternName}
        </DialogTitle>
      </div>
      <DialogContent className="px-6 py-6">
        <div className="space-y-6">
          <div className="flex justify-center">
            <img 
              src={pattern.image} 
              alt={patternName}
              className="max-w-full h-auto rounded-lg border border-slate-800"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">Descripción</h3>
            <p className="text-slate-400">{pattern.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">Características</h3>
            <ul className="space-y-1">
              {pattern.characteristics.map((char, idx) => (
                <li key={idx} className="text-sm text-slate-400 flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  {char}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-slate-200 mb-2">Interpretación</h3>
            <p className="text-slate-400">{pattern.interpretation}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandlePatternInfo;
