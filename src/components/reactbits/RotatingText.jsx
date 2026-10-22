import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import './RotatingText.css';

// Mi versión del RotatingText de React Bits (https://reactbits.dev/text-animations/rotating-text).
// Va cambiando entre varias frases: las letras de la frase que sale suben y desaparecen,
// y las de la nueva entran desde abajo una tras otra (eso es el "stagger").
// La armé con lo mismo que usa el original (motion), sin Tailwind, porque el proyecto no lo usa.
export default function RotatingText({
  texts,
  rotationInterval = 2800, // cada cuánto cambia la frase, en milisegundos
  staggerDuration = 0.025, // cuánto espera cada letra respecto a la anterior
  className = '',
}) {
  const [indice, setIndice] = useState(0);
  // si la persona tiene activado "reducir movimiento" en su celular, dejo la frase quieta
  const sinMovimiento = useReducedMotion();

  useEffect(() => {
    if (sinMovimiento || texts.length < 2) return;
    const id = setInterval(() => setIndice((i) => (i + 1) % texts.length), rotationInterval);
    return () => clearInterval(id);
  }, [texts.length, rotationInterval, sinMovimiento]);

  const frase = texts[indice];
  const palabras = frase.split(' ');
  let letraGlobal = 0; // lo uso para que el retraso siga corriendo entre palabras

  return (
    <span className={`text-rotate ${className}`}>
      {/* para lectores de pantalla y Google dejo la frase completa en texto normal */}
      <span className="text-rotate__sr">{frase}</span>
      <AnimatePresence mode="wait" initial={false}>
        {/* al salir, la frase entera (con su subrayado) se desvanece rápido, así no queda
            el subrayado solo mientras cambia */}
        <motion.span
          key={indice}
          className="text-rotate__frase"
          aria-hidden="true"
          exit={{ opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } }}
        >
          {palabras.map((palabra, pi) => (
            <span key={pi} className="text-rotate__palabra">
              {Array.from(palabra).map((letra, li) => {
                const retraso = letraGlobal++ * staggerDuration;
                return (
                  <motion.span
                    key={li}
                    className="text-rotate__letra"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    // la salida va sin retraso por letra: todas suben juntas y rápido
                    exit={{ y: '-60%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } }}
                    transition={{ type: 'spring', damping: 30, stiffness: 400, delay: retraso }}
                  >
                    {letra}
                  </motion.span>
                );
              })}
              {pi < palabras.length - 1 && <span className="text-rotate__espacio"> </span>}
            </span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
