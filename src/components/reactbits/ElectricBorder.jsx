import { Fragment, useId } from 'react';
import { motion } from 'motion/react';
import './ElectricBorder.css';

// Mi versión del ElectricBorder de React Bits (https://reactbits.dev/animations/electric-border).
// Es una capa encima del borde de la tarjeta. El truco es un filtro SVG: genero "ruido"
// (feTurbulence), lo voy moviendo con <animate> y con ese ruido deformo la línea del borde
// (feDisplacementMap), así se ve como una descarga eléctrica que nunca se queda quieta.
// Lo monto solo cuando la tarjeta está activa, porque tener 75 filtros corriendo a la vez
// en un celular sería pesado.
export default function ElectricBorder({ color = '#5cb83a', speed = 1, chaos = 1, thickness = 2, radius = 18 }) {
  const id = `eb-${useId().replace(/:/g, '')}`;
  const dur = `${6 / speed}s`;
  // Dos capas de ruido que se mueven en sentidos distintos, así el borde no "fluye" para un solo lado.
  // Cambios respecto del original:
  //  - uso fractalNoise y promedio las capas: el original mezcla con color-dodge, que deja el
  //    ruido más claro en promedio y corría todo el borde ~12px hacia abajo y a la derecha
  //  - el ruido es un mosaico (feTile) de 128px que se repite sin costuras (stitchTiles), y lo
  //    desplazo exactamente un mosaico por vuelta, siempre hacia arriba/izquierda. Así nunca
  //    quedan zonas sin ruido, que era lo que hacía que a ratos la línea quedara recta y corrida.
  //    Para eso el filtro tiene que cubrir al menos 2 mosaicos (256px), por eso el width/height
  //    del <filter> es más grande que en el original
  const T = 128;
  const capas = [
    { seed: 3, attr: 'dy', values: `0; -${T}`, res: 'n1' },
    { seed: 7, attr: 'dx', values: `0; -${T}`, res: 'n2' },
  ];

  return (
    // aparece rápido y al soltar se desvanece más lento (va dentro de un AnimatePresence)
    <motion.span
      className="eb"
      aria-hidden="true"
      style={{ '--eb-color': color, '--eb-r': `${radius}px`, '--eb-t': `${thickness}px` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.15 } }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
    >
      <svg className="eb__svg" focusable="false">
        <defs>
          <filter id={id} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="190%" height="160%">
            {capas.map((c) => (
              // Fragment y no <g>: dentro de un <filter> SVG no acepta grupos, y si los pongo
              // el navegador ignora el ruido y el borde queda quieto y corrido
              <Fragment key={c.res}>
                <feTurbulence
                  type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed={c.seed}
                  stitchTiles="stitch" x="0" y="0" width={T} height={T} result={`t-${c.res}`}
                />
                <feTile in={`t-${c.res}`} result={`m-${c.res}`} />
                <feOffset in={`m-${c.res}`} dx="0" dy="0" x="0" y="0" width={T} height={T} result={`o-${c.res}`}>
                  <animate attributeName={c.attr} values={c.values} dur={dur} repeatCount="indefinite" calcMode="linear" />
                </feOffset>
                <feTile in={`o-${c.res}`} result={c.res} />
              </Fragment>
            ))}
            {/* promedio de las dos capas: k2 y k3 en 0,5 */}
            <feComposite in="n1" in2="n2" operator="arithmetic" k1="0" k2="0.5" k3="0.5" k4="0" result="ruido" />
            <feDisplacementMap in="SourceGraphic" in2="ruido" scale={28 * chaos} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>
      <span className="eb__trazo" style={{ filter: `url(#${id})` }} />
      <span className="eb__brillo eb__brillo--1" />
      <span className="eb__brillo eb__brillo--2" />
    </motion.span>
  );
}
