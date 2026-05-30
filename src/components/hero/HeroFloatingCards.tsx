'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { IconType } from 'react-icons';
import { LuActivity, LuFlaskConical, LuShieldCheck, LuZap } from 'react-icons/lu';
import { heroSettleSeconds, heroSyncTransition } from './motionConfig';
import { usePreloaded } from '../usePreloaded';

type FloatingCard = {
  value: string;
  label: string;
  Icon: IconType;
  position: string;
  rotate: number;
  float: number;
  enterDelay: number;
};

const cards: FloatingCard[] = [
  { value: '24/7', label: 'Monitoreo continuo', Icon: LuActivity, position: 'left-0 top-2', rotate: -3, float: 5.6, enterDelay: 0.22 },
  { value: '99.9%', label: 'Disponibilidad objetivo', Icon: LuShieldCheck, position: 'right-0 top-2', rotate: 3, float: 6.0, enterDelay: 0.3 },
  { value: '<30 s', label: 'Tiempo de respuesta', Icon: LuZap, position: 'bottom-2 left-6', rotate: 3, float: 6.4, enterDelay: 0.38 },
  { value: '+18%', label: 'Ahorro en químicos', Icon: LuFlaskConical, position: 'bottom-2 right-6', rotate: -3, float: 5.2, enterDelay: 0.46 },
];

export default function HeroFloatingCards() {
  const reduceMotion = useReducedMotion();
  const preloaded = usePreloaded();

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 hidden xl:block"
      aria-hidden="true"
    >
      {cards.map((card) => (
        <motion.div
          key={card.value}
          className={`absolute w-[176px] ${card.position}`}
          initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.92, rotate: 0 }}
          animate={preloaded ? { opacity: 1, y: 0, scale: 1, rotate: card.rotate } : undefined}
          transition={heroSyncTransition(card.enterDelay)}
        >
          <motion.div
            animate={reduceMotion ? undefined : { y: [0, -16, 0], rotate: [0, 1.2, 0] }}
            transition={{
              delay: heroSettleSeconds + card.enterDelay,
              duration: card.float,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="flex items-center gap-3 rounded-2xl border border-border bg-surface/80 p-4 shadow-[0_24px_48px_-28px_rgba(0,0,0,0.85)] backdrop-blur-md will-change-transform"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <card.Icon className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <div className="text-left">
              <p className="font-display text-2xl font-extrabold leading-none tracking-[-0.02em] text-ink">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-muted">{card.label}</p>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
