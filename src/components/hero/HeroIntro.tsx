'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { heroSyncTransition } from './motionConfig';
import { usePreloaded } from '../usePreloaded';

const waUrl =
  'https://wa.me/528123540887?text=Hola%2C%20me%20interesa%20solicitar%20una%20demo%20de%20AquaSense';

export default function HeroIntro() {
  const reduceMotion = useReducedMotion();
  const preloaded = usePreloaded();
  const initial = reduceMotion ? false : { opacity: 0, y: 16 };
  const show = preloaded ? { opacity: 1, y: 0 } : undefined;

  return (
    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
      <motion.h1
        className="font-hero text-5xl font-bold leading-[1.0] tracking-[-0.03em] text-ink sm:text-6xl md:text-7xl"
        initial={initial}
        animate={show}
        transition={heroSyncTransition(0)}
      >
        <span className="block">Tu planta de agua</span>
        <span className="block bg-gradient-to-r from-[#5BA4ED] to-[#3B82C4] bg-clip-text text-transparent">
          a otro nivel.
        </span>
      </motion.h1>

      <motion.p
        className="mt-6 max-w-[640px] text-lg leading-relaxed text-body"
        initial={initial}
        animate={show}
        transition={heroSyncTransition(0.42)}
      >
        Monitorea en tiempo real la calidad del agua, detecta alertas críticas y
        optimiza tu operación sin reemplazar tu infraestructura actual.
      </motion.p>

      <motion.div
        className="mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:gap-4"
        initial={initial}
        animate={show}
        transition={heroSyncTransition(0.58)}
      >
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-3.5 font-bold tracking-tight text-white shadow-[0_16px_32px_-18px_rgba(79,155,232,0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark active:translate-y-0 sm:w-auto"
        >
          Solicitar demo
        </a>
        <a
          href="#como-funciona"
          className="font-display inline-flex w-full items-center justify-center rounded-full border border-border bg-surface/60 px-7 py-3.5 font-bold tracking-tight text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface-soft active:translate-y-0 sm:w-auto"
        >
          Ver cómo funciona
        </a>
      </motion.div>

      {/* Conector visual hacia el dashboard */}
      <motion.div
        className="mt-10 hidden flex-col items-center md:flex"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={preloaded ? { opacity: 1 } : undefined}
        transition={heroSyncTransition(0.74)}
        aria-hidden="true"
      >
        <span className="h-10 w-px bg-gradient-to-b from-transparent via-border to-primary/70" />
        <span className="mt-1 h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(79,155,232,0.15)]" />
      </motion.div>
    </div>
  );
}
