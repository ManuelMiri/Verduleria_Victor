import { useState } from 'react';
import SpringCheck from './reactbits/SpringCheck';
import Foto from './Foto';
import { TIENDA } from '../data/tienda';
import { clp, paso, precioFinal, textoCantidad } from '../utils';

// Panel del pedido. No cobra nada online: arma el mensaje y lo manda por WhatsApp,
// que es como el dueño ya trabaja. El pago online lo dejo para una fase 2.
export default function Carrito({ abierto, onCerrar, items, onCambiar, onVaciar }) {
  const [sector, setSector] = useState(0);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [comentario, setComentario] = useState('');
  // los productos que la persona ya marcó como revisados, { idProducto: true }
  const [revisados, setRevisados] = useState({});
  // solo cuento los que siguen en el pedido, por si marcó uno y después lo sacó
  const listos = items.filter(({ producto }) => revisados[producto.id]).length;

  const subtotal = items.reduce((s, { producto, cantidad }) => s + precioFinal(producto) * cantidad, 0);
  const envio = TIENDA.sectores[sector].costo;
  const esRetiro = envio === 0;
  // el mínimo solo lo cobro cuando hay despacho, si viene a retirar da lo mismo
  const falta = esRetiro ? 0 : TIENDA.pedidoMinimo - subtotal;
  const puedePedir = items.length > 0 && falta <= 0 && nombre.trim() && (esRetiro || direccion.trim());

  // Armo el texto del pedido línea por línea, así le llega ordenado al dueño
  const enviarPedido = () => {
    const lineas = items.map(
      ({ producto, cantidad }) =>
        `• ${producto.nombre}: ${textoCantidad(cantidad, producto.unidad)} — ${clp(precioFinal(producto) * cantidad)}`
    );
    const msg = [
      `Hola ${TIENDA.nombre}, quiero hacer un pedido 🛒`,
      '',
      ...lineas,
      '',
      `Subtotal: ${clp(subtotal)}`,
      `Entrega: ${TIENDA.sectores[sector].nombre}${esRetiro ? '' : ` (${clp(envio)})`}`,
      `*Total: ${clp(subtotal + envio)}*`,
      '',
      `Nombre: ${nombre}`,
      esRetiro ? null : `Dirección: ${direccion}`,
      comentario.trim() ? `Comentario: ${comentario}` : null,
    ]
      // saco las líneas que quedaron en null (las vacías '' sí las dejo, son los saltos)
      .filter((l) => l !== null)
      .join('\n');

    window.open(`https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      <div className={`velo ${abierto ? 'velo--on' : ''}`} onClick={onCerrar} />
      <aside className={`carrito ${abierto ? 'carrito--on' : ''}`} aria-hidden={!abierto}>
        <header className="carrito__top">
          <h2>Tu pedido</h2>
          <button className="btn-icono" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </header>

        {items.length === 0 ? (
          <p className="carrito__vacio">Todavía no agregas nada. Date una vuelta por el catálogo 🥕</p>
        ) : (
          <div className="carrito__cuerpo">
            {/* contador para que la persona vea cuánto le falta revisar */}
            <p className="carrito__revisados">
              Revisados {listos} de {items.length}
              {listos === items.length && ' · ¡todo listo!'}
            </p>
            <ul className="carrito__lista">
              {items.map(({ producto, cantidad }) => (
                <li key={producto.id} className={revisados[producto.id] ? 'revisado' : ''}>
                  {/* SpringCheck de React Bits: marcas el producto y queda tachado */}
                  <SpringCheck
                    label={
                      <span className="carrito__item">
                        <Foto producto={producto} w={80} className="carrito__foto" />
                        {producto.nombre}
                      </span>
                    }
                    checked={!!revisados[producto.id]}
                    onChange={(v) => setRevisados((r) => ({ ...r, [producto.id]: v }))}
                    color="#1d1a14"
                    fillColor="#1f4a2c"
                    checkColor="#f6f1e6"
                    boxSize={22}
                    boxRadius={7}
                    fontSize={15}
                    className="carrito__check"
                  />
                  {/* contador chico para cambiar la cantidad sin volver al catálogo.
                      Si con el − llega a 0, el producto sale del pedido (igual que en la tarjeta) */}
                  <div className="mini-stepper">
                    <button
                      onClick={() => onCambiar(producto, cantidad - paso(producto.unidad))}
                      aria-label={`Quitar ${producto.nombre}`}
                    >
                      −
                    </button>
                    <small className="carrito__cant">{textoCantidad(cantidad, producto.unidad)}</small>
                    <button
                      onClick={() => onCambiar(producto, cantidad + paso(producto.unidad))}
                      aria-label={`Agregar más ${producto.nombre}`}
                    >
                      +
                    </button>
                  </div>
                  <span className="carrito__precio">{clp(precioFinal(producto) * cantidad)}</span>
                  <button className="btn-icono" onClick={() => onCambiar(producto, 0)} aria-label={`Sacar ${producto.nombre}`}>✕</button>
                </li>
              ))}
            </ul>
            <button className="link" onClick={onVaciar}>Vaciar pedido</button>

            <div className="form">
              <label>
                Entrega
                <select value={sector} onChange={(e) => setSector(Number(e.target.value))}>
                  {TIENDA.sectores.map((s, i) => (
                    <option key={s.nombre} value={i}>
                      {s.nombre} {s.costo ? `· ${clp(s.costo)}` : '· gratis'}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Nombre
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="¿A nombre de quién?" />
              </label>
              {!esRetiro && (
                <label>
                  Dirección
                  <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Calle, número, depto" />
                </label>
              )}
              <label>
                <span>Comentario <em>(opcional)</em></span>
                <textarea rows={2} value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Ej: paltas para el fin de semana" />
              </label>
            </div>
          </div>
        )}

        <footer className="carrito__pie">
          <div className="fila"><span>Subtotal</span><span>{clp(subtotal)}</span></div>
          <div className="fila"><span>Despacho</span><span>{esRetiro ? 'Gratis' : clp(envio)}</span></div>
          <div className="fila fila--total"><span>Total</span><span>{clp(subtotal + envio)}</span></div>
          {items.length > 0 && falta > 0 && (
            <p className="aviso">Te faltan {clp(falta)} para el mínimo de despacho ({clp(TIENDA.pedidoMinimo)}).</p>
          )}
          <button className="btn btn--wsp" disabled={!puedePedir} onClick={enviarPedido}>
            Enviar pedido por WhatsApp
          </button>
        </footer>
      </aside>
    </>
  );
}
