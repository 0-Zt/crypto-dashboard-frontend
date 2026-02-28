import React from 'react';
import { Card } from './ui/card';
import { Skeleton, Typography } from '@mui/material';
import { useCypherSignal } from '../hooks/useCypherSignal';

const badgeClass = {
  LONG: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  SHORT: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  NEUTRAL: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
};

export default function CypherMethodPanel({ symbol }) {
  const { data, isLoading, error } = useCypherSignal(symbol);

  if (isLoading) {
    return (
      <Card className="p-5 border border-[#33466f]/40 space-y-3">
        <Skeleton variant="text" width={220} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} variant="rounded" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />
        ))}
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-5 border border-[#5a2f2f]/50">
        <Typography sx={{ color: '#ff9aa8', fontSize: 13 }}>
          Error en señal Cypher: {error?.message || 'sin detalle'}
        </Typography>
      </Card>
    );
  }

  const signal = data?.direction || 'NEUTRAL';

  return (
    <Card className="p-5 border border-[#33466f]/60 space-y-3">
      <div className="flex items-center justify-between">
        <Typography sx={{ color: '#eef2ff', fontSize: 18, fontWeight: 700 }}>Cypher Method (4h/2h)</Typography>
        <span className={`text-xs px-3 py-1 rounded-full border ${badgeClass[signal] || badgeClass.NEUTRAL}`}>
          {signal}
        </span>
      </div>

      <div className="text-sm text-slate-300">{data?.message}</div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-slate-400">Timeframe usado</div>
        <div className="text-slate-200 text-right">{data?.timeframeUsed || '-'}</div>

        <div className="text-slate-400">4h MFI / RSI</div>
        <div className="text-slate-200 text-right">{data?.frame4h?.mfi?.toFixed?.(1) ?? '-'} / {data?.frame4h?.rsi?.toFixed?.(1) ?? '-'}</div>

        <div className="text-slate-400">4h WT1 / WT2</div>
        <div className="text-slate-200 text-right">{data?.frame4h?.wt1?.toFixed?.(1) ?? '-'} / {data?.frame4h?.wt2?.toFixed?.(1) ?? '-'}</div>

        <div className="text-slate-400">4h Stoch K / D</div>
        <div className="text-slate-200 text-right">{data?.frame4h?.stochK?.toFixed?.(1) ?? '-'} / {data?.frame4h?.stochD?.toFixed?.(1) ?? '-'}</div>

        <div className="text-slate-400">4h STC</div>
        <div className="text-slate-200 text-right">{data?.frame4h?.stc?.toFixed?.(1) ?? '-'}</div>
      </div>

      {Array.isArray(data?.reasons) && data.reasons.length > 0 && (
        <div className="space-y-1 pt-1">
          <span className="text-sm text-slate-400">Razones:</span>
          {data.reasons.map((reason, idx) => (
            <div key={idx} className="text-xs text-slate-300">• {reason}</div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div className="text-slate-400">Sommi Flag</div>
        <div className="text-slate-200 text-right">
          {data?.sommi?.bullFlag ? 'Bull' : data?.sommi?.bearFlag ? 'Bear' : '—'}
        </div>

        <div className="text-slate-400">Sommi Diamond</div>
        <div className="text-slate-200 text-right">
          {data?.sommi?.bullDiamond ? 'Bull' : data?.sommi?.bearDiamond ? 'Bear' : '—'}
        </div>

        <div className="text-slate-400">WT Divergence</div>
        <div className="text-slate-200 text-right">
          {data?.wtDivergences?.bullishRegular ? 'Bull Reg' : data?.wtDivergences?.bearishRegular ? 'Bear Reg' : '—'}
        </div>
      </div>
    </Card>
  );
}
