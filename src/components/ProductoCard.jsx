import { AnimatePresence } from 'motion/react';
import FlipCard from './reactbits/FlipCard';
import ElectricBorder from './reactbits/ElectricBorder';
import { activarTarjeta, desactivarTarjeta, useTarjetaActiva } from '../data/tarjetaActiva';
import ClickSpark from './reactbits/ClickSpark';
import { CHISPAS } from '../chispas';
import Foto from './Foto';
import { clp, etiqueta, paso, precioFinal, textoCantidad } from '../utils';

// El FlipCard se da vuelta con cualquier click o tecla dentro de la tarjeta. Como adelante
// están los botones de agregar, corto esos eventos aquí para que no lleguen a la tarjeta.
// Si no, al apretar "Agregar" también se daba vuelta.
const noGirar = (e) => e.stopPropagation();

// Tarjeta de cada producto con el FlipCard de React Bits:
// adelante la foto, el precio y el contador, y atrás la descripción.
export default function ProductoCard({ producto, cantidad, onCambiar }) {
  const { nombre, unidad, precio, oferta, hayHoy, nota, descripcion, idealPara, guardar } = producto;
  const step = paso(unidad);

  // El borde eléctrico: con el mouse se prende al entrar y se apaga al salir; en el celular
  // se prende mientras tienes el dedo encima y se apaga al soltar (se desvanece, ver
  // ElectricBorder). Solo puede haber una tarjeta prendida a la vez (ver tarjetaActiva.js)
  const activa = useTarjetaActiva(producto.id); // null | 'mouse' | 'touch'
  const alEntrar = (e) => e.pointerType === 'mouse' && activarTarjeta(producto.id, 'mouse');
  const alSalir = () => desactivarTarjeta(producto.id);
  const alTocar = (e) => e.pointerType !== 'mouse' && activarTarjeta(producto.id, 'touch');
  const alSoltar = (e) => e.pointerType !== 'mouse' && desactivarTarjeta(producto.id);
  const electrico = <ElectricBorder key="eb" color="#5cb83a" radius={18} speed={1} chaos={0.9} />;
  // Con mouse lo dibujo DENTRO de cada cara, así acompaña la inclinación de la tarjeta.
  // En el celular lo dibujo FUERA, encima de la tarjeta: al tocarla se da vuelta, y los
  // navegadores de celular no pintan bien el filtro dentro de la cara trasera en 3D
  // AnimatePresence deja terminar la animación de salida antes de sacarlo, así se desvanece
  const borde = <AnimatePresence>{activa === 'mouse' && electrico}</AnimatePresence>;

  const frente = (
    <div className={`cara cara--frente ${!hayHoy ? 'cara--agotado' : ''}`}>
      {borde}
      {oferta && hayHoy && <span className="chip chip--oferta">Oferta</span>}
      {!hayHoy && <span className="chip chip--no">No hay hoy</span>}
      <span className="girar" aria-hidden="true">↻</span>

      {/* la foto ocupa todo el ancho de arriba de la tarjeta */}
      <Foto producto={producto} w={440} className="producto__foto" />
      <h3 className="producto__nombre">{nombre}</h3>
      {nota && <p className="producto__nota">{nota}</p>}

      <p className="producto__precio">
        {oferta && <s>{clp(precio)}</s>}
        <strong>{clp(precioFinal(producto))}</strong>
        <span> / {etiqueta(unidad)}</span>
      </p>

      {/* si no hay hoy, no dejo agregarlo; dejo un texto para que igual puedan ver la descripción */}
      {hayHoy ? (
        <div className="producto__accion" onPointerDown={noGirar} onClick={noGirar} onKeyDown={noGirar}>
          {/* Ahora el contador − 0 + está siempre, ya no hay botón "Agregar" */}
          <div className={`stepper ${cantidad === 0 ? 'stepper--vacio' : ''}`}>
            <button
              onClick={() => onCambiar(producto, cantidad - step)}
              disabled={cantidad === 0}
              aria-label={`Quitar ${nombre}`}
            >
              −
            </button>
            <span>{textoCantidad(cantidad, unidad)}</span>
            {/* Las chispas van solo en el +, y solo cuando está en 0, o sea cuando lo
                agregas por primera vez. Con disabled las apago para el resto de los clicks */}
            <ClickSpark {...CHISPAS} disabled={cantidad > 0} className="mas-chispa">
              <button
                // si está en 0 parto en 1 (1 kg, 1 malla, 1 unidad) y después sigo de a paso
                onClick={() => onCambiar(producto, cantidad === 0 ? 1 : cantidad + step)}
                aria-label={cantidad === 0 ? `Agregar ${nombre}` : `Agregar más ${nombre}`}
              >
                +
              </button>
            </ClickSpark>
          </div>
        </div>
      ) : (
        <p className="producto__pronto">Pregunta cuándo llega</p>
      )}
    </div>
  );

  const reverso = (
    <div className="cara cara--reverso">
      {borde}
      <Foto producto={producto} w={120} className="reverso__foto" />
      <h3 className="producto__nombre">{nombre}</h3>
      <p className="reverso__texto">{descripcion}</p>
      <dl className="reverso__datos">
        <div>
          <dt>Ideal para</dt>
          <dd>{idealPara}</dd>
        </div>
        <div>
          <dt>Cómo guardarlo</dt>
          <dd>{guardar}</dd>
        </div>
      </dl>
      <span className="reverso__volver">↻ Toca para volver</span>
    </div>
  );

  return (
    <div
      className="producto-wrap"
      onPointerEnter={alEntrar}
      onPointerLeave={alSalir}
      onPointerDown={alTocar}
      onPointerUp={alSoltar}
      onPointerCancel={alSoltar}
    >
    <FlipCard
      front={frente}
      back={reverso}
      ariaLabel={`${nombre}: toca para ver la descripción`}
      // el tamaño real lo manejo en el CSS (.producto-flip) para que se adapte a la grilla
      width={220}
      height={300}
      radius={18}
      background="#fffdf8"
      color="#1d1a14"
      shadowColor="#1f4a2c"
      shadowOpacity={0.16}
      tiltMax={8}
      hoverScale={1.02}
      glareOpacity={0.35}
      className="producto-flip"
    />
    <AnimatePresence>{activa === 'touch' && electrico}</AnimatePresence>
    </div>
  );
}
