import { motion, useReducedMotion } from 'motion/react';

// Mi versión del AnimatedContent de React Bits (https://reactbits.dev/animations/animated-content).
// El original usa GSAP + ScrollTrigger; yo uso motion, que ya está en el proyecto, para no sumar
// otra librería. Hace lo mismo: cuando el bloque entra en pantalla al hacer scroll, aparece
// deslizándose desde abajo (o del lado que le diga) y con un fade. Solo pasa una vez.
export default function AnimatedContent({
  children,
  distance = 60, // cuántos px se desliza
  direction = 'vertical', // 'vertical' u 'horizontal'
  reverse = false, // true = viene desde arriba / desde la izquierda
  duration = 0.7,
  delay = 0,
  initialOpacity = 0,
  scale = 1, // menor a 1 = además crece un poco al aparecer
  threshold = 0.15, // qué parte tiene que estar visible para que arranque
  className,
  id,
  as = 'div',
}) {
  const sinMovimiento = useReducedMotion();
  const Tag = motion[as] ?? motion.div;
  const eje = direction === 'horizontal' ? 'x' : 'y';
  const desde = (reverse ? -1 : 1) * distance;

  if (sinMovimiento) {
    const Simple = as;
    return <Simple id={id} className={className}>{children}</Simple>;
  }

  return (
    <Tag
      id={id}
      className={className}
      initial={{ [eje]: desde, opacity: initialOpacity, scale }}
      whileInView={{ [eje]: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: threshold }}
      // esta curva es la equivalente a "power3.out" de GSAP: parte rápido y frena suave
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
