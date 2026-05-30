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

// Controles del stack (fáciles de tunear):
//  --stack-gap    → separación vertical de la columna inicial (cards separadas)
//  --stack-offset → desplazamiento entre cards ya apiladas (cuánto asoma cada una)
const stackVars = {
  '--stack-gap': '28px',
  '--stack-offset': '96px',
} as CSSProperties;

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

          const css = getComputedStyle(stack);
          const GAP = parseFloat(css.getPropertyValue('--stack-gap')) || 28;
          const STACK_OFFSET = parseFloat(css.getPropertyValue('--stack-offset')) || 96;

          // 1) Posiciones acumulativas a partir de las alturas reales de cada card.
          //    initialY = columna separada y limpia (gap real, sin overlap).
          //    finalY   = stack compacto con un offset uniforme entre cards.
          const heights = cards.map((card) => card.offsetHeight);
          const initialY: number[] = [];
          const finalY: number[] = [];
          let acc = 0;
          cards.forEach((_, index) => {
            initialY[index] = acc;
            acc += heights[index] + GAP;
            finalY[index] = index * STACK_OFFSET;
          });

          // Altura del contenedor = la del stack ya colapsado, para no dejar un
          // hueco gigante una vez que termina la animación.
          const finalStackHeight = Math.max(
            ...cards.map((_, index) => finalY[index] + heights[index]),
          );

          // Cuánto se cierra cada "eslabón" entre la card m-1 y la m al apilarse.
          // En la fase m se mueve la card m y TODAS las inferiores esta distancia.
          const collapse = (m: number) => heights[m - 1] + GAP - STACK_OFFSET;
          const collapsePrefix = [0];
          for (let m = 1; m < cards.length; m += 1) {
            collapsePrefix[m] = collapsePrefix[m - 1] + collapse(m);
          }

          gsap.set(stack, { perspective: 1200, minHeight: finalStackHeight });
          cards.forEach((card, index) => {
            gsap.set(card, {
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              y: initialY[index],
              zIndex: index + 1,
              scale: 1,
              opacity: 1,
              transformOrigin: '50% 0%',
              willChange: 'transform',
            });
          });

          const timeline = gsap.timeline({
            // Lineal: bajo scrub es lo más continuo y fluido, sin frenones entre
            // fases. La sensación de rapidez la da la distancia de scroll corta.
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              pin,
              start: 'top top',
              // Distancia de scroll más corta = el stack se arma rápido y no se
              // siente pesado. ~280px por fase.
              end: () => `+=${Math.max(820, (cards.length - 1) * 280)}`,
              scrub: 0.25,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // 2) Trailing stack: en cada fase k la card k se acomoda sobre la k-1 y
          //    todas las cards inferiores (k..n) se desplazan la MISMA distancia en
          //    el mismo instante, por lo que la suben acompañando. Como los targets
          //    son acumulativos y absolutos, la columna nunca abre huecos ni deja
          //    cards rezagadas abajo.
          for (let k = 1; k < cards.length; k += 1) {
            for (let i = k; i < cards.length; i += 1) {
              timeline.to(
                cards[i],
                { y: initialY[i] - collapsePrefix[k], duration: 1 },
                k - 1,
              );
            }

            // La card que queda detrás se reduce un pelín para dar profundidad,
            // pero se mantiene 100% opaca (sin transparencia entre cards).
            timeline.to(
              cards[k - 1],
              { scale: 0.985, duration: 0.6 },
              k - 1,
            );
          }

          // Sostén mínimo al final del scrubbing antes de soltar el pin.
          timeline.to({}, { duration: 0.12 });

          requestAnimationFrame(() => ScrollTrigger.refresh());

          return () => {
            timeline.kill();
            gsap.set(cards, { clearProps: 'all' });
            gsap.set(stack, { clearProps: 'all' });
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
      className="relative isolate overflow-hidden bg-canvas text-[#F8FAFC]"
    >
      <div ref={pinRef} className="relative min-h-[100dvh] py-20 md:py-24 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.9fr_1.4fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.32em] text-primary">
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
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-24px_rgba(79,155,232,0.72)] transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-[0_18px_36px_-24px_rgba(79,155,232,0.78)] active:translate-y-0"
              >
                Solicitar demo
              </a>
              <a
                href="#planes"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm font-bold text-[#F8FAFC] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-[transform,background-color,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/[0.06] active:translate-y-0"
              >
                Ver planes
              </a>
            </div>
          </div>

          <div
            ref={stackRef}
            style={stackVars}
            className="aquasense-stack-stage relative flex flex-col gap-6"
            aria-label="Proceso de implementación de AquaSense"
          >
            {steps.map((step, index) => (
              <article
                key={step.number}
                ref={(node) => {
                  cardRefs.current[index] = node;
                }}
                className="aquasense-stack-card relative overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-[0_20px_46px_-42px_rgba(0,0,0,0.95)] transition-[border-color,box-shadow] duration-300 ease-out hover:border-white/[0.14] hover:shadow-[0_24px_52px_-44px_rgba(0,0,0,0.98)] lg:min-h-[320px]"
              >
                <div className="relative grid h-full gap-4 md:grid-cols-[4.35rem_1fr]">
                  <span className="font-display text-[2.35rem] font-black leading-none tracking-[-0.04em] text-primary md:text-[2.65rem]">
                    {step.number}
                  </span>

                  <div className="flex min-w-0 flex-col">
                    <h3 className="max-w-2xl font-display text-[1.2rem] font-black leading-tight tracking-[-0.02em] text-[#F8FAFC] md:text-[1.45rem]">
                      {step.title}
                    </h3>

                    <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#B8C7CC] md:text-[0.88rem]">
                      {step.bullets.map((bullet) => (
                        <li key={bullet} className="flex gap-3">
                          <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-4 border-t border-white/[0.08] pt-3 text-sm font-semibold leading-6 text-[#DCE8F8] md:mt-auto md:text-[0.88rem]">
                      {step.result}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AquaSenseStackedProcess;
