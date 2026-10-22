import { Children, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import './LogoLoop.css';

// Mi versión del LogoLoop de React Bits (https://reactbits.dev/animations/logo-loop), adaptada
// para pasar tarjetas de oferta en vez de logos. Es una cinta infinita: repito la lista las
// veces que haga falta para llenar el ancho, la voy corriendo con requestAnimationFrame y
// cuando avanzó el largo de una vuelta la devuelvo al inicio. Como la copia de al lado es
// igual, no se nota el salto: los items desaparecen por un lado y aparecen por el otro.
//
// Agregado mío para el celular:
//  - mientras tienes el dedo encima se queda quieta, y al soltar espera `resumeDelay` ms
//    (3 segundos) antes de volver a avanzar, así alcanzas a tocar la oferta que quieres
//  - la puedes arrastrar hacia los lados con el dedo (o con el mouse)
//  - si arrastraste o dejaste el dedo apretado, el "click" de soltar no cuenta, para no
//    agregar una oferta sin querer; para agregar basta un toque corto
export default function LogoLoop({ children, speed = 45, gap = 14, pauseOnHover = true, resumeDelay = 3000, ariaLabel }) {
  const items = Children.toArray(children);
  const contenedor = useRef(null);
  const secuencia = useRef(null);
  const pista = useRef(null);
  const [copias, setCopias] = useState(2);
  const sinMovimiento = useReducedMotion();
  const largoVuelta = useRef(0);

  // todo lo que cambia seguido lo guardo en refs para no re-dibujar React en cada frame
  const offset = useRef(0);
  const encima = useRef(false); // mouse encima
  const pausaHasta = useRef(0); // hasta cuándo se queda quieta después de soltar el dedo
  const arrastre = useRef(null); // { id, x0, offset0, movio }
  const fueArrastre = useRef(false);

  // mido cuánto mide una vuelta y calculo cuántas copias necesito para no ver huecos
  useEffect(() => {
    const medir = () => {
      if (!contenedor.current || !secuencia.current) return;
      const ancho = secuencia.current.getBoundingClientRect().width;
      largoVuelta.current = ancho;
      if (ancho > 0) setCopias(Math.max(2, Math.ceil(contenedor.current.clientWidth / ancho) + 1));
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(contenedor.current);
    ro.observe(secuencia.current);
    return () => ro.disconnect();
  }, [items.length]);

  // dejo el desplazamiento siempre entre 0 y una vuelta, también cuando arrastran para atrás
  const pintar = () => {
    const vuelta = largoVuelta.current;
    if (vuelta > 0) offset.current = ((offset.current % vuelta) + vuelta) % vuelta;
    if (pista.current) pista.current.style.transform = `translate3d(${-offset.current}px, 0, 0)`;
  };

  // el movimiento: voy sumando desplazamiento según el tiempo real, así va igual de rápido
  // en un celular lento que en un computador. Frena y arranca suave, no de golpe
  useEffect(() => {
    if (sinMovimiento) return;
    let velActual = speed;
    let anterior = performance.now();
    let frame;
    const paso = (ahora) => {
      const dt = Math.min((ahora - anterior) / 1000, 0.05);
      anterior = ahora;
      const quieta = (pauseOnHover && encima.current) || arrastre.current || ahora < pausaHasta.current;
      velActual += ((quieta ? 0 : speed) - velActual) * Math.min(1, dt * 6);
      if (!arrastre.current) {
        offset.current += velActual * dt;
        pintar();
      }
      frame = requestAnimationFrame(paso);
    };
    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
  }, [speed, pauseOnHover, sinMovimiento]);

  const alBajar = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    arrastre.current = { id: e.pointerId, x0: e.clientX, offset0: offset.current, movio: false, t0: performance.now() };
    fueArrastre.current = false;
  };
  const alMover = (e) => {
    const a = arrastre.current;
    if (!a || a.id !== e.pointerId) return;
    const dx = e.clientX - a.x0;
    // recién después de 6px lo tomo como arrastre; menos que eso es un toque normal
    if (!a.movio && Math.abs(dx) > 6) {
      a.movio = true;
      fueArrastre.current = true;
      e.currentTarget.setPointerCapture?.(e.pointerId);
    }
    if (a.movio) {
      offset.current = a.offset0 - dx;
      pintar();
    }
  };
  const alSoltar = (e) => {
    const a = arrastre.current;
    if (!a || a.id !== e.pointerId) return;
    arrastre.current = null;
    // si dejó el dedo apretado más de medio segundo, era para frenar la cinta y mirar,
    // no para agregar: ese toque largo tampoco cuenta como click
    if (e.pointerType !== 'mouse' && performance.now() - a.t0 > 450) fueArrastre.current = true;
    // con el dedo, se queda quieta unos segundos más antes de volver a correr
    if (e.pointerType !== 'mouse') pausaHasta.current = performance.now() + resumeDelay;
  };
  // si fue arrastre, anulo el click que viene al soltar (en fase de captura, antes que el botón)
  const alClick = (e) => {
    if (fueArrastre.current) {
      e.preventDefault();
      e.stopPropagation();
      fueArrastre.current = false;
    }
  };

  return (
    <div
      ref={contenedor}
      className={`logoloop ${sinMovimiento ? 'logoloop--quieto' : ''}`}
      style={{ '--ll-gap': `${gap}px` }}
      role="region"
      aria-label={ariaLabel}
      onPointerEnter={(e) => e.pointerType === 'mouse' && (encima.current = true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && (encima.current = false)}
      onPointerDown={sinMovimiento ? undefined : alBajar}
      onPointerMove={sinMovimiento ? undefined : alMover}
      onPointerUp={sinMovimiento ? undefined : alSoltar}
      onPointerCancel={sinMovimiento ? undefined : alSoltar}
      onClickCapture={alClick}
    >
      <div ref={pista} className="logoloop__pista">
        {Array.from({ length: sinMovimiento ? 1 : copias }, (_, c) => (
          <ul
            key={c}
            ref={c === 0 ? secuencia : undefined}
            className="logoloop__lista"
            // las copias las oculto a los lectores de pantalla (así cada oferta se lee una sola vez),
            // pero NO les pongo "inert": eso también bloquea los toques, y como la cinta va
            // corriendo, la mayoría de las veces lo que tocas es una copia
            aria-hidden={c > 0 ? true : undefined}
          >
            {items.map((item, i) => (
              <li key={i} className="logoloop__item">{item}</li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
