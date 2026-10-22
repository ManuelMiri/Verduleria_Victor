import { useMemo, useState } from 'react';
import PaperCrumple from './reactbits/PaperCrumple';
import { clp, precioFinal, textoCantidad } from '../utils';

// Animación de "Vaciar pedido": dibujo la nota del pedido como una hoja de cuaderno (en un
// canvas), se la paso a PaperCrumple para que la arrugue en 3D, y cuando queda hecha una bola
// la "tiro" fuera de la pantalla. Recién ahí aviso con onTerminar para vaciar el carrito.
// Este archivo se carga solo cuando aprietan "Vaciar" (lazy), porque Three.js pesa harto.

const ANCHO = 300;

// dibujo la nota: papel crema con renglones, margen rojo, el título y cada producto con su total
function dibujarNota(items, subtotal) {
  const alto = Math.min(560, Math.max(300, 130 + items.length * 34));
  const dpr = 2; // al doble de resolución para que el texto se vea nítido al arrugarse
  const c = document.createElement('canvas');
  c.width = ANCHO * dpr;
  c.height = alto * dpr;
  const g = c.getContext('2d');
  g.scale(dpr, dpr);

  g.fillStyle = '#fffaf0';
  g.fillRect(0, 0, ANCHO, alto);
  g.strokeStyle = 'rgba(70, 120, 200, 0.18)';
  g.lineWidth = 1;
  for (let y = 76; y < alto; y += 34) {
    g.beginPath(); g.moveTo(0, y + 8); g.lineTo(ANCHO, y + 8); g.stroke();
  }
  g.strokeStyle = 'rgba(217, 71, 43, 0.45)';
  g.beginPath(); g.moveTo(34, 0); g.lineTo(34, alto); g.stroke();

  g.fillStyle = '#1f4a2c';
  g.font = "800 24px Fraunces, Georgia, serif";
  g.fillText('Tu pedido', 46, 44);

  g.font = "15px 'DM Sans', system-ui, sans-serif";
  const maxFilas = Math.floor((alto - 130) / 34) + 1;
  items.slice(0, maxFilas).forEach(({ producto, cantidad }, i) => {
    const y = 80 + i * 34;
    g.fillStyle = '#1d1a14';
    let nombre = `${producto.nombre} · ${textoCantidad(cantidad, producto.unidad)}`;
    while (g.measureText(nombre).width > 170 && nombre.length > 4) nombre = nombre.slice(0, -2) + '…';
    g.fillText(nombre, 46, y);
    const precio = clp(precioFinal(producto) * cantidad);
    g.fillText(precio, ANCHO - 14 - g.measureText(precio).width, y);
  });

  g.font = "700 17px 'DM Sans', system-ui, sans-serif";
  g.fillStyle = '#d9472b';
  const total = `Total ${clp(subtotal)}`;
  g.fillText(total, ANCHO - 14 - g.measureText(total).width, alto - 22);

  return { src: c.toDataURL('image/png'), alto };
}

export default function NotaArrugada({ items, subtotal, onTerminar }) {
  // la imagen la armo una sola vez, con el pedido tal como estaba al apretar "Vaciar"
  const [nota] = useState(() => dibujarNota(items, subtotal));
  const [fase, setFase] = useState('arrugando'); // 'arrugando' | 'tirando'

  const alCambiar = useMemo(
    () => (estado) => {
      // cuando quedó hecha una bola, espero un instante y la tiro
      if (estado === 'crumpled') setTimeout(() => setFase('tirando'), 220);
    },
    []
  );

  return (
    <div className={`nota-arrugada nota-arrugada--${fase}`} onAnimationEnd={(e) => e.target === e.currentTarget.firstChild && onTerminar()}>
      <PaperCrumple
        src={nota.src}
        alt="Nota del pedido"
        width={ANCHO}
        height={nota.alto}
        sceneHeight="100%"
        autoCrumple
        releaseBehavior="stay"
        draggable={false}
        crumpleAmount={1}
        crumpleDuration={0.9}
        paperColor="#fffaf0"
        shadowOpacity={0.12}
        onStateChange={alCambiar}
        // si el celular no tiene WebGL o algo falla, vacío igual, sin animación
        onError={onTerminar}
        className="nota-arrugada__papel"
      />
    </div>
  );
}
