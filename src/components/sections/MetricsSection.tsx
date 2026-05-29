'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

function CountUp({
  target,
  suffix = '',
  prefix = '',
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    let start: number | null = null;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, target]);

  // Special handling for 99.9
  const display = target === 99 && value === 99 ? '99.9' : String(value);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

const metrics = [
  {
    value: '24/7',
    label: 'Monitoreo continuo',
    static: true,
  },
  {
    value: '<30 s',
    label: 'Tiempo de respuesta',
    static: true,
  },
  {
    target: 99,
    suffix: '%',
    label: 'Disponibilidad objetivo',
    static: false,
  },
  {
    target: 18,
    suffix: '%',
    prefix: '+',
    label: 'Ahorro en químicos',
    static: false,
  },
  {
    target: 200,
    prefix: '+',
    label: 'Plantas monitoreadas',
    static: false,
  },
  {
    value: 'PDF/Excel',
    label: 'Reportes exportables',
    static: true,
  },
];

export default function MetricsSection() {
  return (
    <section style={{ background: '#071B20' }} className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section header */}
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Resultados
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-on-dark leading-tight">
            Operación medible desde el primer día.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {metrics.map((m, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <span
                className="font-bold leading-none mb-2"
                style={{ fontSize: 56, color: '#5EEAD4' }}
              >
                {m.static ? (
                  m.value
                ) : (
                  <CountUp
                    target={m.target!}
                    suffix={m.suffix}
                    prefix={m.prefix}
                  />
                )}
              </span>
              <span className="text-sm" style={{ color: '#8A9692' }}>
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
