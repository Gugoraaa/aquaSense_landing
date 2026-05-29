'use client';

import { useEffect, useState } from 'react';

const EVENT = 'aquasense:preloaded';
const FLAG = '__aquasensePreloaded';

/**
 * Señaliza que el preloader terminó. Marca un flag global (para los componentes
 * que se hidratan tarde, p. ej. client:visible) y emite un evento para los que
 * ya están montados. Idempotente.
 */
export function markPreloaded() {
  if (typeof window === 'undefined') return;
  if ((window as unknown as Record<string, unknown>)[FLAG]) return;
  (window as unknown as Record<string, unknown>)[FLAG] = true;
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Devuelve `true` una vez que el preloader terminó. Las animaciones de entrada
 * deben esperar a este valor para no reproducirse ocultas tras el preloader.
 */
export function usePreloaded() {
  const [preloaded, setPreloaded] = useState(
    () => typeof window !== 'undefined' && Boolean((window as unknown as Record<string, unknown>)[FLAG]),
  );

  useEffect(() => {
    if (preloaded) return;
    if ((window as unknown as Record<string, unknown>)[FLAG]) {
      setPreloaded(true);
      return;
    }
    const handler = () => setPreloaded(true);
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
  }, [preloaded]);

  return preloaded;
}
