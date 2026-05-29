'use client';

import { useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';

const demoUrl = `https://wa.me/528123540887?text=${encodeURIComponent(
  'Hola, me interesa solicitar una demo de AquaSense para mi planta.',
)}`;

type ProcessStep = {
  number: string;
  title: string;
  bullets: string[];
  result: string;
};

type StackCardStyle = CSSProperties & {
  '--stack-y': string;
};

const initialY = [0, 360, 720, 1080];
const finalY = [0, 80, 160, 240];

const steps: ProcessStep[] = [
  {
    number: '01.',
    title: 'Conecta tus sensores y PLCs existentes',
    bullets: [
      'Integra equipos de campo con la infraestructura actual.',
      'Compatible con protocolos industriales como Modbus, OPC-UA y MQTT.',
      'Recolecta datos desde tu operación actual.',
    ],
    result:
      'Resultado: tu planta comienza a generar datos operativos centralizados desde el primer punto de conexión.',
  },
  {
    number: '02.',
    title: 'Centraliza datos mediante gateway',
    bullets: [
      'Envía información de forma segura hacia AquaSense Cloud.',
      'Evita interrupciones en la operación.',
      'Reduce la necesidad de instalaciones complejas.',
    ],
    result:
      'Resultado: tus datos dejan de estar aislados y se convierten en una fuente continua de monitoreo.',
  },
  {
    number: '03.',
    title: 'Procesa información en AquaSense Cloud',
    bullets: [
      'Visualiza históricos y tendencias por periodo.',
      'Detecta anomalías con inteligencia operativa.',
      'Consolida métricas clave de calidad del agua.',
    ],
    result:
      'Resultado: conviertes datos en alertas, reportes y señales útiles para tomar decisiones.',
  },
  {
    number: '04.',
    title: 'Actúa desde dashboards y alertas',
    bullets: [
      'Consulta información desde web, móvil o WhatsApp.',
      'Recibe alertas cuando una variable salga de rango.',
      'Genera reportes listos para operación y seguimiento.',
    ],
    result: 'Resultado: tu equipo responde más rápido y opera con mayor visibilidad.',
  },
];

function AquaSenseStackedProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLArticleElement | null>>([]);

  useEffect(() => {
    let cancelled = false;
    let ctx: { revert: () => void } | undefined;
    let media: { revert: () => void } | undefined;

    async function setupStackedCards() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (cancelled || !sectionRef.current || !pinRef.current || !stackRef.current) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        media = gsap.matchMedia();

        media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
          const section = sectionRef.current;
          const pin = pinRef.current;
          const stack = stackRef.current;
          const cards = cardRefs.current.filter(
            (card): card is HTMLArticleElement => Boolean(card),
          );

          if (!section || !pin || !stack || cards.length === 0) {
            return undefined;
          }

          gsap.set(stack, { perspective: 900 });
          gsap.set(cards, {
            scale: 1,
            transformOrigin: '50% 0%',
            willChange: 'transform',
          });

          cards.forEach((card, index) => {
            gsap.set(card, {
              zIndex: index + 1,
              rotate: 0,
              y: initialY[index] ?? index * 360,
            });
          });

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              pin,
              start: 'top top',
              end: () => `+=${Math.max(1450, window.innerHeight * 1.85)}`,
              scrub: 0.35,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          cards.slice(1).forEach((card, index) => {
            const activeIndex = index + 1;
            const startAt = index;

            timeline.set(card, { zIndex: activeIndex + 1 }, startAt);
            timeline.to(
              card,
              {
                y: finalY[activeIndex] ?? activeIndex * 80,
                duration: 0.72,
              },
              startAt,
            );
          });

          timeline.to({}, { duration: 0.18 });

          requestAnimationFrame(() => ScrollTrigger.refresh());

          return () => {
            timeline.kill();
            gsap.set(cards, { clearProps: 'transform,opacity,willChange,zIndex' });
          };
        });
      }, sectionRef);
    }

    void setupStackedCards();

    return () => {
      cancelled = true;
      media?.revert();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      id="como-funciona"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#050816] text-[#F8FAFC]"
    >
      <div ref={pinRef} className="relative min-h-[100dvh] py-20 md:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.4fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.32em] text-[#5EEAD4]">
              PROCESO
            </p>
            <h2 className="max-w-xl font-display text-4xl font-black leading-[1.02] tracking-[-0.045em] text-[#F8FAFC] md:text-5xl">
              Implementa AquaSense sin detener tu operación
            </h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#B8C7CC] md:text-lg">
              Conecta tu infraestructura actual, centraliza tus datos y convierte el monitoreo de agua
              en decisiones accionables.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href={demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#5EEAD4] px-6 py-3 text-sm font-bold text-[#04171C] shadow-[0_14px_30px_-24px_rgba(94,234,212,0.72)] transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#7CF7EF] hover:shadow-[0_18px_36px_-24px_rgba(94,234,212,0.78)] active:translate-y-0"
              >
                Solicitar demo
              </a>
              <a
                href="#planes"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm font-bold text-[#F8FAFC] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[transform,background-color,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-[#5EEAD4]/30 hover:bg-[#5EEAD4]/[0.06] active:translate-y-0"
              >
                Ver planes
              </a>
            </div>
          </div>

          <div
            ref={stackRef}
            className="aquasense-stack-stage relative grid gap-5 lg:min-h-[1420px] lg:block"
            aria-label="Proceso de implementación de AquaSense"
          >
            {steps.map((step, index) => {
              const cardStyle: StackCardStyle = {
                '--stack-y': `${initialY[index] ?? index * 360}px`,
              };

              return (
                <article
                  key={step.number}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  style={cardStyle}
                  className="aquasense-stack-card relative overflow-hidden rounded-[22px] border border-white/[0.08] bg-[rgba(8,12,24,0.98)] p-5 shadow-[0_20px_46px_-42px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.045)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-[0_24px_52px_-44px_rgba(0,0,0,0.98),inset_0_1px_0_rgba(255,255,255,0.06)] lg:absolute lg:inset-x-0 lg:top-0 lg:min-h-[320px] lg:translate-y-[var(--stack-y)] lg:p-5"
                >
                  <div className="relative grid h-full gap-4 md:grid-cols-[4.35rem_1fr]">
                    <span className="font-display text-[2.35rem] font-black leading-none tracking-[-0.04em] text-[#5EEAD4] md:text-[2.65rem]">
                      {step.number}
                    </span>

                    <div className="flex min-w-0 flex-col">
                      <h3 className="max-w-2xl font-display text-[1.2rem] font-black leading-tight tracking-[-0.02em] text-[#F8FAFC] md:text-[1.45rem]">
                        {step.title}
                      </h3>

                      <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#B8C7CC] md:text-[0.88rem]">
                        {step.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5EEAD4]" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4 border-t border-white/[0.08] pt-3 text-sm font-semibold leading-6 text-[#E2F7F6] md:mt-auto md:text-[0.88rem]">
                        {step.result}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1023px), (prefers-reduced-motion: reduce) {
          .aquasense-stack-stage {
            min-height: auto !important;
            display: grid !important;
            gap: 1.25rem !important;
          }

          .aquasense-stack-card {
            position: relative !important;
            inset: auto !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}

export default AquaSenseStackedProcess;
