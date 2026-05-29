'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BriefcaseBusiness, CircleDollarSign, Cpu, Droplets, Home, UsersRound, X } from 'lucide-react';

const waUrl = 'https://wa.me/528123540887?text=Hola%2C%20me%20interesa%20solicitar%20una%20demo%20de%20AquaSense';

const navLinks = [
  { label: 'Inicio', href: '#inicio', Icon: Home },
  { label: 'Servicios', href: '#servicios', Icon: BriefcaseBusiness },
  { label: 'Proceso', href: '#como-funciona', Icon: Droplets },
  { label: 'Tecnología', href: '#funcionalidades', Icon: Cpu },
  { label: 'Clientes', href: '#clientes', Icon: UsersRound },
  { label: 'Planes', href: '#planes', Icon: CircleDollarSign },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const btn = document.getElementById('hamburger-btn');
    const handleClick = () => setOpen((prev) => !prev);
    btn?.addEventListener('click', handleClick);
    return () => btn?.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-dark/45 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 220, damping: 28 }}
            className="fixed right-3 top-3 z-[70] flex h-[calc(100dvh-1.5rem)] w-[min(21rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[1.75rem] border border-white/70 bg-surface/95 shadow-[0_24px_70px_-32px_rgba(7,27,32,0.7)] backdrop-blur-2xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-border/80 px-6">
              <span className="text-lg font-bold tracking-tight text-ink">
                AquaSense<span className="text-primary">.</span>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 text-primary transition-colors hover:bg-surface-soft"
                aria-label="Cerrar menú"
              >
                <motion.span
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  className="inline-flex"
                >
                  <X className="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
                </motion.span>
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-2 px-4 py-5">
              {navLinks.map(({ href, Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-body transition-colors hover:bg-surface-soft hover:text-ink"
                >
                  <Icon className="h-5 w-5 flex-none text-primary" strokeWidth={2.2} aria-hidden="true" />
                  {label}
                </a>
              ))}
            </nav>

            <div className="border-t border-border/80 px-6 py-6">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_-16px_rgba(59,130,196,0.95)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark active:translate-y-0"
              >
                Solicitar demo
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
