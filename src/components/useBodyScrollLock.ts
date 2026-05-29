'use client';

import { useEffect } from 'react';

let activeLocks = 0;
let previousBodyOverflow: string | null = null;

function releaseBodyScrollLock() {
  if (typeof document === 'undefined' || activeLocks === 0) return;

  activeLocks -= 1;

  if (activeLocks === 0) {
    document.body.style.overflow = previousBodyOverflow ?? '';
    previousBodyOverflow = null;
  }
}

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked || typeof document === 'undefined') return;

    if (activeLocks === 0) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    activeLocks += 1;
    return releaseBodyScrollLock;
  }, [locked]);
}
