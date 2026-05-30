'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  LuChevronDown,
  LuCircleCheck,
  LuClock,
  LuDroplets,
  LuTriangleAlert,
  LuWifi,
} from 'react-icons/lu';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

const systemStatus = [
  { Icon: LuCircleCheck, label: 'Sensores', value: '4/4 activos', good: true },
  { Icon: LuWifi, label: 'Conectividad', value: 'Excelente', good: true },
  { Icon: LuClock, label: 'Última actualización', value: 'Hace 10 s', good: false },
];

function AppHeader() {
  return (
    <div
      className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3"
      style={{ background: '#0F1923' }}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <LuDroplets className="h-3.5 w-3.5" strokeWidth={2.4} />
        </span>
        <span className="font-display text-sm font-bold tracking-[-0.02em] text-white">
          AquaSense
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs font-medium text-gray-300">
          Planta Norte
          <LuChevronDown className="h-3 w-3 text-gray-500" strokeWidth={2.2} />
        </span>
        <span className="hidden items-center gap-1.5 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          <span className="text-xs text-gray-400">En vivo</span>
        </span>
      </div>
    </div>
  );
}

function MetricsGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.slice(0, count).map((m) => (
        <div
          key={m.label}
          className="flex items-center justify-between rounded-xl p-3"
          style={{ background: '#162230' }}
        >
          <div>
            <p className="mb-0.5 text-xs font-medium" style={{ color: '#8A9692' }}>
              {m.label}
            </p>
            <p className="text-lg font-bold text-white">{m.value}</p>
          </div>
          <StatusChip variant={m.variant} label={m.chip} />
        </div>
      ))}
    </div>
  );
}

function TrendChart() {
  return (
    <div className="rounded-xl p-3" style={{ background: '#162230' }}>
      <p className="mb-3 text-xs font-semibold" style={{ color: '#8A9692' }}>
        Tendencia últimas 8h
      </p>
      <ResponsiveContainer width="100%" height={150}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="h" tick={{ fill: '#8A9692', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#8A9692', fontSize: 11 }} axisLine={false} tickLine={false} />
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
          <Line type="monotone" dataKey="ph" stroke="#3B82C4" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="cl" stroke="#2563A8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function SystemStatus() {
  return (
    <div className="rounded-xl p-4" style={{ background: '#162230' }}>
      <p className="mb-3 text-xs font-semibold" style={{ color: '#8A9692' }}>
        Estado del sistema
      </p>
      <div className="flex flex-col gap-2.5">
        {systemStatus.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xs text-gray-400">
              <row.Icon
                className={`h-3.5 w-3.5 ${row.good ? 'text-green-400' : 'text-primary'}`}
                strokeWidth={2}
              />
              {row.label}
            </span>
            <span className={`text-xs font-semibold ${row.good ? 'text-green-400' : 'text-white'}`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertBox() {
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
      className="rounded-xl p-3.5"
      style={{ background: '#3A1E0B', border: '1px solid #7C4A12' }}
    >
      <div className="flex items-center gap-2">
        <LuTriangleAlert className="h-4 w-4 shrink-0 text-amber-400" strokeWidth={2} />
        <span className="text-xs font-bold uppercase tracking-wide text-amber-300">
          Alerta activa
        </span>
      </div>
      <p className="mt-1.5 text-sm font-medium text-amber-100">
        Filtro #3 — Presión diferencial elevada
      </p>
      <p className="mt-1 text-xs text-amber-200/60">Hace 4 min</p>
    </motion.div>
  );
}

export default function HeroDashboard() {
  const reduceMotion = useReducedMotion();
  const preloaded = usePreloaded();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 36, scale: 0.985 }}
      animate={preloaded ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={heroSyncTransition(0.6)}
      className="w-full"
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
        transition={{
          delay: heroSettleSeconds + 0.18,
          duration: 6.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="will-change-transform"
      >
        {/* Desktop / tablet */}
        <div className="hidden overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:block">
          {/* Browser chrome */}
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#1A2633' }}>
            <div className="flex gap-1.5">
              <span className="block h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="block h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="block h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <span className="font-mono text-xs text-gray-400">app.aquasense.mx</span>
          </div>

          <AppHeader />

          {/* Dashboard body */}
          <div
            className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-[1.55fr_1fr]"
            style={{ background: '#0F1923' }}
          >
            <div className="flex flex-col gap-3">
              <MetricsGrid />
              <TrendChart />
            </div>
            <div className="flex flex-col gap-3">
              <SystemStatus />
              <AlertBox />
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl md:hidden">
          <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#1A2633' }}>
            <div className="flex gap-1.5">
              <span className="block h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="block h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="block h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <span className="font-mono text-xs text-gray-400">app.aquasense.mx</span>
          </div>

          <AppHeader />

          <div className="flex flex-col gap-3 p-4" style={{ background: '#0F1923' }}>
            <MetricsGrid count={4} />
            <SystemStatus />
            <AlertBox />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
