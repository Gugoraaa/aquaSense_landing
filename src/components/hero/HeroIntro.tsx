'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { heroSyncTransition } from './motionConfig';
import { usePreloaded } from '../usePreloaded';

const waUrl = 'https://wa.me/528123540887?text=Hola%2C%20me%20interesa%20solicitar%20una%20demo%20de%20AquaSense';
const headline = 'Tu planta de agua, monitoreada en tiempo real.';

export default function HeroIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const preloaded = usePreloaded();
  const revealInitial = reduceMotion ? false : { opacity: 0, y: 14 };
  const revealAnimate = preloaded && isInView ? { opacity: 1, y: 0 } : undefined;

  return (
    <div ref={ref}>
      <motion.div
        className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-sm font-medium text-primary"
        style={{ background: 'rgba(59,130,196,0.1)' }}
        initial={revealInitial}
        animate={revealAnimate}
        transition={heroSyncTransition(0.1)}
      >
        <span className="w-2 h-2 rounded-full bg-primary inline-block" />
        Monitoreo en tiempo real
      </motion.div>

      <motion.h1
        className="font-display text-5xl md:text-6xl font-extrabold tracking-[-0.04em] leading-[1.0] text-ink mb-6"
        initial={revealInitial}
        animate={revealAnimate}
        transition={heroSyncTransition(0)}
      >
        {headline}
      </motion.h1>

      <motion.p
        className="text-lg text-body mb-8 max-w-xl leading-relaxed"
        initial={revealInitial}
        animate={revealAnimate}
        transition={heroSyncTransition(0.42)}
      >
        Plataforma de monitoreo de calidad del agua en tiempo real para plantas industriales y de tratamiento. Conectamos con sensores y PLCs existentes sin reemplazar nada.
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-4 mb-8"
        initial={revealInitial}
        animate={revealAnimate}
        transition={heroSyncTransition(0.58)}
      >
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-display inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold tracking-tight rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark active:translate-y-0"
        >
          Solicitar demo
        </a>
        <a
          href="#como-funciona"
          className="font-display inline-flex items-center justify-center px-6 py-3 border border-border text-ink font-bold tracking-tight rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-soft active:translate-y-0"
        >
          Ver cómo funciona
        </a>
      </motion.div>
    </div>
  );
}
