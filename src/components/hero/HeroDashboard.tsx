'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { LuTriangleAlert } from 'react-icons/lu';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import StatusChip from '../shared/StatusChip';
import { heroSettleSeconds, heroSyncTransition } from './motionConfig';
import { usePreloaded } from '../usePreloaded';

const chartData = [
  { h: '00h', ph: 7.1, cl: 1.3 },
  { h: '01h', ph: 7.2, cl: 1.4 },
  { h: '02h', ph: 7.0, cl: 1.2 },
  { h: '03h', ph: 7.3, cl: 1.5 },
  { h: '04h', ph: 7.1, cl: 1.4 },
  { h: '05h', ph: 7.2, cl: 1.6 },
  { h: '06h', ph: 7.4, cl: 1.3 },
  { h: '07h', ph: 7.2, cl: 1.4 },
];

const metrics = [
  { label: 'pH', value: '7.2', variant: 'normal' as const, chip: 'Normal' },
  { label: 'Cloro', value: '1.4 mg/L', variant: 'normal' as const, chip: 'Normal' },
  { label: 'Turbidez', value: '0.8 NTU', variant: 'warning' as const, chip: '↑ Alerta' },
  { label: 'Presión', value: '3.2 bar', variant: 'normal' as const, chip: 'Normal' },
];

function AlertBadge() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={reduceMotion ? undefined : { opacity: [0.92, 1, 0.92] }}
      transition={{
        delay: heroSettleSeconds + 0.24,
        duration: 3.4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className="mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5"
      style={{ background: '#78350F', border: '1px solid #92400E' }}
    >
      <LuTriangleAlert className="h-4 w-4 shrink-0 text-yellow-400" strokeWidth={1.8} />
      <span className="text-xs font-medium" style={{ color: '#FDE68A' }}>
        Filtro #3 — Presión diferencial elevada · hace 4 min
      </span>
    </motion.div>
  );
}

export default function HeroDashboard() {
  const reduceMotion = useReducedMotion();
  const preloaded = usePreloaded();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.982 }}
      animate={preloaded ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={heroSyncTransition(0.04)}
      className="w-full"
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={{
          delay: heroSettleSeconds + 0.18,
          duration: 5.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="will-change-transform"
      >
        {/* Desktop version */}
        <div className="hidden md:block rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          {/* Browser chrome */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ background: '#1A2633' }}
          >
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 block" />
            </div>
            <span className="text-xs text-gray-400 font-mono">
              app.aquasense.mx · Planta Norte
            </span>
          </div>

          {/* Dashboard body */}
          <div style={{ background: '#0F1923' }} className="p-5">
            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl p-3 flex items-center justify-between"
                  style={{ background: '#162230' }}
                >
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: '#8A9692' }}>
                      {m.label}
                    </p>
                    <p className="text-lg font-bold text-white">{m.value}</p>
                  </div>
                  <StatusChip variant={m.variant} label={m.chip} />
                </div>
              ))}
            </div>

            {/* Chart */}
            <div
              className="rounded-xl p-3"
              style={{ background: '#162230' }}
            >
              <p className="text-xs font-semibold mb-3" style={{ color: '#8A9692' }}>
                Tendencia últimas 8h
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis
                    dataKey="h"
                    tick={{ fill: '#8A9692', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#8A9692', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#123B5D',
                      border: 'none',
                      borderRadius: 8,
                      color: '#F7FAFA',
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: 11 }}
                    formatter={(value) => (
                      <span style={{ color: value === 'ph' ? '#3B82C4' : '#2563A8' }}>
                        {value === 'ph' ? 'pH' : 'Cloro'}
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="ph"
                    stroke="#3B82C4"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="cl"
                    stroke="#2563A8"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <AlertBadge />
          </div>
        </div>

        {/* Mobile version */}
        <div
          className="md:hidden rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ background: '#1A2633' }}
          >
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 block" />
            </div>
            <span className="text-xs text-gray-400 font-mono">app.aquasense.mx</span>
          </div>

          <div style={{ background: '#0F1923' }} className="p-4">
            <div className="flex flex-col gap-3">
              {metrics.slice(0, 3).map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl p-3 flex items-center justify-between"
                  style={{ background: '#162230' }}
                >
                  <div>
                    <p className="text-xs font-medium mb-0.5" style={{ color: '#8A9692' }}>
                      {m.label}
                    </p>
                    <p className="text-base font-bold text-white">{m.value}</p>
                  </div>
                  <StatusChip variant={m.variant} label={m.chip} />
                </div>
              ))}
            </div>

            <AlertBadge />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
