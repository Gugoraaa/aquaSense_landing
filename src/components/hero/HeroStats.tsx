'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { statsSettleMilliseconds, statsSyncTransition } from './motionConfig';
import { usePreloaded } from '../usePreloaded';

type Stat =
  | {
      kind: 'number';
      label: string;
      target: number;
      prefix?: string;
      suffix?: string;
      decimals?: number;
    }
  | {
      kind: 'text';
      label: string;
      value: string;
    };

const stats: Stat[] = [
  { kind: 'number', target: 24, suffix: '/7', label: 'Monitoreo continuo' },
  { kind: 'number', target: 30, prefix: '<', suffix: ' s', label: 'Tiempo de respuesta' },
  { kind: 'number', target: 99.9, suffix: '%', decimals: 1, label: 'Disponibilidad objetivo' },
  { kind: 'number', target: 18, prefix: '+', suffix: '%', label: 'Ahorro en químicos' },
  { kind: 'text', value: 'PDF/Excel', label: 'Reportes exportables' },
];

function useCountUp(target: number, active: boolean, decimals = 0) {
  const [value, setValue] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!active) return;

    if (reduceMotion) {
      setValue(target);
      return;
    }

    let frame = 0;
    let start: number | null = null;
    const duration = statsSettleMilliseconds;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [active, reduceMotion, target]);

  return decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
}

function NumberStatValue({ stat, active }: { stat: Extract<Stat, { kind: 'number' }>; active: boolean }) {
  const value = useCountUp(stat.target, active, stat.decimals);

  return (
    <>
      {stat.prefix}
      {value}
      {stat.suffix}
    </>
  );
}

function TextStatValue({ stat, active }: { stat: Extract<Stat, { kind: 'text' }>; active: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 8 }}
      animate={active ? { opacity: 1, y: 0 } : undefined}
      transition={statsSyncTransition(0.16)}
    >
      {stat.value}
    </motion.span>
  );
}

export default function HeroStats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const preloaded = usePreloaded();
  const active = preloaded && isInView;

  return (
    <div
      ref={ref}
      className="border-t border-border mt-16 pt-12 grid grid-cols-2 md:grid-cols-5 gap-6 text-center"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className={stat.kind === 'text' ? 'col-span-2 md:col-span-1' : undefined}
          initial={{ opacity: 0, y: 14 }}
          animate={active ? { opacity: 1, y: 0 } : undefined}
          transition={statsSyncTransition(index * 0.08)}
        >
          <p className="font-display text-3xl md:text-4xl font-extrabold tracking-[-0.02em] text-ink tabular-nums">
            {stat.kind === 'number' ? (
              <NumberStatValue stat={stat} active={active} />
            ) : (
              <TextStatValue stat={stat} active={active} />
            )}
          </p>
          <p className="text-sm text-body mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
