import { useEffect, useMemo, useState } from 'react';
import CircularText from './components/reactbits/CircularText';
import BlurText from './components/reactbits/BlurText';
import MetaBalls from './components/reactbits/MetaBalls';
import ClickSpark from './components/reactbits/ClickSpark';
import { CHISPAS } from './chispas';
import ProductoCard from './components/ProductoCard';
import Foto, { fotoUrl } from './components/Foto';
import Carrito from './components/Carrito';
import { categoriasDe, useProductos } from './data/hoja';
import { TIENDA } from './data/tienda';
import { clp } from './utils';
import './App.css';

// Guardo el carrito en el navegador para que no se pierda si recargan la página.
// Va con try/catch porque en modo incógnito a veces el localStorage falla.
const leerCarrito = () => {
  try {
    return JSON.parse(localStorage.getItem('carrito-verduleria')) ?? {};
  } catch {
    return {};
  }
};

export default function App() {
  const [carrito, setCarrito] = useState(leerCarrito); // { idProducto: cantidad }
  const [categoria, setCategoria] = useState('Todo');
  const [busqueda, setBusqueda] = useState('');
  const [abierto, setAbierto] = useState(false);
  // los productos ahora vienen de la planilla de Google (ver data/hoja.js)
  const { productos, cargando } = useProductos();
  const categorias = useMemo(() => categoriasDe(productos), [productos]);

  useEffect(() => {
    try {
      localStorage.setItem('carrito-verduleria', JSON.stringify(carrito));
    } catch {
      /* si no se puede guardar, no pasa nada, el carrito igual funciona */
    }
  }, [carrito]);

  // Una sola función para sumar, restar o sacar: si la cantidad queda en 0, lo borro
  const cambiarCantidad = (producto, cantidad) => {
    setCarrito((c) => {
      const nuevo = { ...c };
      if (cantidad <= 0) delete nuevo[producto.id];
      else nuevo[producto.id] = cantidad;
      return nuevo;
    });
  };

  const items = productos.filter((p) => carrito[p.id]).map((p) => ({ producto: p, cantidad: carrito[p.id] }));
  const ofertas = productos.filter((p) => p.oferta && p.hayHoy);

  // Filtro por categoría y por lo que escriban en el buscador (sin importar tildes)
  const visibles = useMemo(() => {
    const limpiar = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const q = limpiar(busqueda);
    return productos.filter(
      (p) => (categoria === 'Todo' || p.categoria === categoria) && limpiar(p.nombre).includes(q)
    );
  }, [productos, categoria, busqueda]);

  const cantidadItems = items.length;

  // El animationSize va según el alto de la pantalla, así que en el celular (angosto y alto)
  // las manchas quedaban gigantes y tapaban todo. Ahí uso 20 y en pantallas anchas el 13
  const tamanoManchas = typeof window !== 'undefined' && window.innerWidth < 700 ? 20 : 13;

  return (
    <>
      {/* Fondo de manchas de React Bits (MetaBalls). Va fijo detrás de todo.
          - animationSize en 13 (el original trae 30, en celular uso 20): mientras más chico, más cerca se ven
          - motion "drift": las reparte por toda la pantalla. Con el movimiento por defecto (orbit)
            daban vueltas al centro y con el zoom se juntaban en una sola mancha gigante
          - 6 manchas en vez de 15 y gooeyness/stickiness bajos, para que se vean separadas.
            Con los valores por defecto se pegaban entre ellas y tapaban toda la página
          - enableTransparency para que se vea el crema de la página detrás y no un fondo negro
          - manchas en durazno (el mismo tono del círculo del sello) y la que sigue al
            mouse en un verde clarito, así combina con la paleta y no tapa el texto */}
      <div className="fondo" aria-hidden="true">
        <MetaBalls
          color="#f3c9a3"
          cursorBallColor="#cfe0bf"
          animationSize={tamanoManchas}
          ballCount={6}
          motion="drift"
          gooeyness={0.2}
          stickiness={0.2}
          speed={0.25}
          cursorBallSize={2}
          enableTransparency
          className="fondo__manchas"
        />
      </div>

      <nav className="nav">
        <a href="#" className="marca">
          <span aria-hidden="true">🥬</span> {TIENDA.nombre}
        </a>
        <button className="btn btn--carrito" onClick={() => setAbierto(true)}>
          Mi pedido
          {cantidadItems > 0 && <span className="burbuja">{cantidadItems}</span>}
        </button>
      </nav>

      <header className="hero">
        <div className="hero__texto">
          <p className="hero__kicker"><span aria-hidden="true">🍅</span> Frutas y verduras · Talca</p>
          {/* BlurText de React Bits: el título va apareciendo palabra por palabra */}
          {/* lo que va después de la coma sale en cursiva, color tomate y subrayado a mano */}
          <BlurText
            text={TIENDA.eslogan}
            delay={120}
            animateBy="words"
            direction="top"
            className="hero__titulo"
            resaltarDesde={TIENDA.eslogan.split(' ').findIndex((w) => w.endsWith(',')) + 1 || -1}
          />
          <p className="hero__bajada">
            Elige lo que necesitas, te armamos el pedido y te lo llevamos a la casa. <strong>Precios del día, pago al recibir.</strong>
          </p>
          <div className="hero__acciones">
            <a href="#catalogo" className="btn btn--primario">Ver productos</a>
            <a href="#ofertas" className="btn btn--fantasma">Ofertas de hoy</a>
          </div>
        </div>

        {/* El CircularText de React Bits girando alrededor de la canasta, como un sello */}
        <div className="sello">
          <CircularText text="FRESCO DEL DÍA ✦ DESPACHO A DOMICILIO ✦ " onHover="slowDown" spinDuration={22} className="sello__texto" />
          {/* al centro del sello una foto de canasta con verduras, también de Unsplash */}
          <img
            className="sello__centro"
            src={fotoUrl('photo-1627989147125-a004d05946d3', 360)}
            alt=""
            aria-hidden="true"
          />
        </div>
      </header>

      {ofertas.length > 0 && (
        <section id="ofertas" className="ofertas">
          <h2>Ofertas de hoy</h2>
          <div className="ofertas__fila">
            {/* estas tarjetas también son botones de agregar, así que les pongo las mismas chispas */}
            {ofertas.map((p) => (
              <ClickSpark key={p.id} {...CHISPAS} sparkColor={['#ffffff', '#ffd25e']} className="oferta__chispa">
                <button className="oferta" onClick={() => cambiarCantidad(p, (carrito[p.id] ?? 0) + 1)}>
                  <Foto producto={p} w={140} className="oferta__foto" />
                  <span className="oferta__nombre">{p.nombre}</span>
                  <span className="oferta__precio">
                    <s>{clp(p.precio)}</s> {clp(p.oferta)}
                  </span>
                  <span className="oferta__mas">+ Agregar</span>
                </button>
              </ClickSpark>
            ))}
          </div>
        </section>
      )}

      <main id="catalogo" className="catalogo">
        <div className="catalogo__top">
          <h2>Catálogo</h2>
          <input
            className="buscador"
            type="search"
            placeholder="Buscar: palta, tomate…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filtros" role="tablist">
          {categorias.map((c) => (
            <button key={c} className={`filtro ${c === categoria ? 'filtro--on' : ''}`} onClick={() => setCategoria(c)}>
              {c}
            </button>
          ))}
        </div>

        {cargando ? (
          <p className="sin-resultados">Cargando los productos de hoy…</p>
        ) : visibles.length === 0 ? (
          <p className="sin-resultados">No encontramos "{busqueda}". Pregúntanos por WhatsApp, quizás llegó hoy.</p>
        ) : (
          <div className="grilla">
            {visibles.map((p) => (
              <ProductoCard key={p.id} producto={p} cantidad={carrito[p.id] ?? 0} onCambiar={cambiarCantidad} />
            ))}
          </div>
        )}
      </main>

      <section className="como">
        <h2>¿Cómo funciona?</h2>
        <ol>
          <li><strong>Arma tu pedido</strong> con lo que haya hoy.</li>
          <li><strong>Envíalo por WhatsApp</strong> y te confirmamos el total.</li>
          <li><strong>Recíbelo en tu casa</strong> o retíralo en el local. Pagas al recibir.</li>
        </ol>
      </section>

      <footer className="pie">
        <div>
          <strong>{TIENDA.nombre}</strong>
          <p>{TIENDA.direccion}</p>
          <p>{TIENDA.horario}</p>
        </div>
        <div className="pie__links">
          <a href={`https://wa.me/${TIENDA.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={`https://instagram.com/${TIENDA.instagram}`} target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </footer>

      {/* botón flotante en el celular para abrir el pedido sin subir hasta arriba */}
      {cantidadItems > 0 && !abierto && (
        <button className="flotante" onClick={() => setAbierto(true)}>
          Ver pedido · {cantidadItems} {cantidadItems === 1 ? 'producto' : 'productos'}
        </button>
      )}

      <Carrito
        abierto={abierto}
        onCerrar={() => setAbierto(false)}
        items={items}
        onCambiar={cambiarCantidad}
        onVaciar={() => setCarrito({})}
      />
    </>
  );
}
