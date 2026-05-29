'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Droplet as DropletIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type Phase = 'drop' | 'reveal';

/**
 * Pantalla de carga de AquaSense.
 * Una gota de agua glossy cae desde arriba, genera ondas al impactar en el
 * centro y se transforma en el logotipo. Estética oscura premium (negro + aqua)
 * a juego con el sitio. Dura ~2.6s y hace fade-out suave revelando la página.
 */
export default function Preloader() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<Phase>(reduceMotion ? 'reveal' : 'drop');

  // Bloquea el scroll mientras la pantalla de carga está activa.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Línea de tiempo de la animación.
  useEffect(() => {
    if (reduceMotion) {
      const done = window.setTimeout(() => setVisible(false), 1600);
      return () => window.clearTimeout(done);
    }

    const timers = [
      window.setTimeout(() => setPhase('reveal'), 1000),
      window.setTimeout(() => setVisible(false), 2500),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="aquasense-preloader"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background:
              'radial-gradient(120% 120% at 50% 38%, #0c1726 0%, #080c14 55%, #05080d 100%)',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden="true"
        >
          {/* Resplandor aqua sutil y estático */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: 'min(58vw, 440px)',
              height: 'min(58vw, 440px)',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(79,155,232,0.10) 0%, rgba(79,155,232,0) 70%)',
            }}
          />

          {/* Núcleo: el wordmark queda exactamente en el centro de la pantalla.
              La gota cae sobre ese punto y se desvanece al aparecer el texto. */}
          <div className="relative flex items-center justify-center">
            {/* Gota de agua: cae rápido, rebota y se desvanece antes del texto */}
            {!reduceMotion && (
              <motion.div
                className="absolute left-1/2 -translate-x-1/2"
                initial={{ y: -140, opacity: 0 }}
                animate={{ y: [-140, 0, -10, 0], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 0.8,
                  times: [0, 0.5, 0.72, 1],
                  ease: ['easeIn', 'easeOut', 'easeInOut'],
                }}
                style={{ filter: 'drop-shadow(0 6px 14px rgba(79,155,232,0.3))' }}
              >
                <DropletIcon size={40} strokeWidth={1.5} color="#7FCBF5" fill="none" aria-hidden="true" />
              </motion.div>
            )}

            {/* Una sola onda discreta, sincronizada con el rebote */}
            {!reduceMotion && (
              <motion.span
                className="absolute left-1/2 top-1/2 rounded-full"
                style={{
                  width: 56,
                  height: 56,
                  marginLeft: -28,
                  marginTop: -28,
                  border: '1px solid rgba(111,196,242,0.4)',
                }}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: [0.4, 2.6], opacity: [0.5, 0] }}
                transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
              />
            )}

            {/* Wordmark, exactamente centrado en pantalla */}
            <motion.div
              className="relative inline-block"
              initial={{ opacity: 0, y: 6 }}
              animate={phase === 'reveal' ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="font-display text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl md:text-5xl"
                style={{
                  background: 'linear-gradient(180deg, #F2F8FF 0%, #B9D8F5 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                AquaSense
              </span>
              <span
                className="font-display absolute left-full top-0 text-3xl font-extrabold sm:text-4xl md:text-5xl"
                style={{ color: '#4F9BE8' }}
                aria-hidden="true"
              >
                .
              </span>
            </motion.div>

            {/* Subtítulo (absoluto: no desplaza el centrado del wordmark) */}
            <motion.span
              className="absolute left-1/2 top-full mt-4 -translate-x-1/2 whitespace-nowrap text-[0.6rem] font-semibold uppercase tracking-[0.45em]"
              style={{ color: 'rgba(167,178,194,0.55)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === 'reveal' ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            >
              Monitoreo de agua
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
