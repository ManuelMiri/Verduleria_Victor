import { Children, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import './LogoLoop.css';

// Mi versión del LogoLoop de React Bits (https://reactbits.dev/animations/logo-loop), adaptada
// para pasar tarjetas de oferta en vez de logos. Es una cinta infinita: repito la lista las
// veces que haga falta para llenar el ancho, la voy corriendo con requestAnimationFrame y
// cuando avanzó el largo de una vuelta la devuelvo al inicio. Como la copia de al lado es
// igual, no se nota el salto: los items desaparecen por un lado y aparecen por el otro.
export default function LogoLoop({ children, speed = 45, gap = 14, pauseOnHover = true, ariaLabel }) {
  const items = Children.toArray(children);
  const contenedor = useRef(null);
  const secuencia = useRef(null);
  const pista = useRef(null);
  const [copias, setCopias] = useState(2);
  const [pausado, setPausado] = useState(false);
  const sinMovimiento = useReducedMotion();
  const largoVuelta = useRef(0);

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

  // el movimiento: voy sumando desplazamiento según el tiempo real, así va igual de rápido
  // en un celular lento que en un computador. Al pasar el mouse frena suave, no de golpe
  useEffect(() => {
    if (sinMovimiento) return;
    let offset = 0;
    let velActual = speed;
    let anterior = performance.now();
    let frame;
    const paso = (ahora) => {
      const dt = Math.min((ahora - anterior) / 1000, 0.05);
      anterior = ahora;
      const objetivo = pausado ? 0 : speed;
      velActual += (objetivo - velActual) * Math.min(1, dt * 6);
      const vuelta = largoVuelta.current;
      if (vuelta > 0) {
        offset = (offset + velActual * dt) % vuelta;
        if (pista.current) pista.current.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      frame = requestAnimationFrame(paso);
    };
    frame = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(frame);
  }, [speed, pausado, sinMovimiento]);

  const handlers = pauseOnHover
    ? {
        onPointerEnter: () => setPausado(true),
        onPointerLeave: () => setPausado(false),
        // en el celular no hay "pasar por encima", así que pauso mientras tiene el dedo encima
        onTouchStart: () => setPausado(true),
        onTouchEnd: () => setPausado(false),
      }
    : {};

  return (
    <div
      ref={contenedor}
      className={`logoloop ${sinMovimiento ? 'logoloop--quieto' : ''}`}
      style={{ '--ll-gap': `${gap}px` }}
      role="region"
      aria-label={ariaLabel}
      {...handlers}
    >
      <div ref={pista} className="logoloop__pista">
        {Array.from({ length: sinMovimiento ? 1 : copias }, (_, c) => (
          <ul
            key={c}
            ref={c === 0 ? secuencia : undefined}
            className="logoloop__lista"
            // las copias son solo visuales: los lectores de pantalla y el teclado ven una sola vez cada oferta
            aria-hidden={c > 0 ? true : undefined}
            inert={c > 0 ? true : undefined}
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
