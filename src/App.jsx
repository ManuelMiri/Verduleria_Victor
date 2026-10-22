import { useEffect, useMemo, useState } from 'react';
import CircularText from './components/reactbits/CircularText';
import BlurText from './components/reactbits/BlurText';
import RotatingText from './components/reactbits/RotatingText';
import LogoLoop from './components/reactbits/LogoLoop';
import AnimatedContent from './components/reactbits/AnimatedContent';
import DepthText from './components/reactbits/DepthText';

// Ajustes comunes de DepthText para los títulos de sección: menos capas y menos profundidad
// que el ejemplo original, porque acá son títulos chicos y no el texto gigante del demo
const TITULO_3D = { layers: 14, depth: 1.1, tilt: 7, orbitSpeed: 0.12, fontSize: 'clamp(2rem, 6vw, 2.8rem)', fontWeight: 800, className: 'titulo-3d' };
import MetaBalls from './components/reactbits/MetaBalls';
import ClickSpark from './components/reactbits/ClickSpark';
import { CHISPAS } from './chispas';
import ProductoCard from './components/ProductoCard';
import Foto from './components/Foto';
import Carrito from './components/Carrito';
import { categoriasDe, useProductos } from './data/hoja';
import { TIENDA } from './data/tienda';
import { clp } from './utils';
import logo from './assets/logo.webp';
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
  // La mancha verde que sigue al mouse y el "empujón" al hacer clic solo los dejo con mouse.
  // En el celular cada toque o scroll hacía saltar las manchas y el fondo parecía titilar
  const conMouse = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

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
          enableMouseInteraction={conMouse}
          clickBurst={conMouse}
          className="fondo__manchas"
        />
      </div>

      <nav className="nav">
        <a href="#" className="marca">
          {/* el logo trae el nombre escrito, pero en chico no se lee, así que lo dejo también en texto */}
          <img src={logo} alt="" className="marca__logo" width="40" height="51" />
          {TIENDA.nombre}
        </a>
        <button className="btn btn--carrito" onClick={() => setAbierto(true)}>
          Mi pedido
          {cantidadItems > 0 && <span className="burbuja">{cantidadItems}</span>}
        </button>
      </nav>

      <header className="hero">
        <div className="hero__texto">
          <p className="hero__kicker"><span aria-hidden="true">🍅</span> <span className="kicker__rubro">Frutas y verduras · </span>Padre Las Casas, Temuco</p>
          {/* El título: arriba "Lo de la feria," aparece palabra por palabra (BlurText)
              y abajo van rotando las frases en cursiva tomate (RotatingText) */}
          <h1 className="hero__titulo">
            <BlurText as="span" className="hero__linea" text={TIENDA.titulo} delay={120} animateBy="words" direction="top" />
            <RotatingText texts={TIENDA.frases} className="resaltado" rotationInterval={3200} />
          </h1>
          <p className="hero__bajada">
            Elige lo que necesitas, te armamos el pedido y te lo llevamos a la casa. <strong>Precios del día, pago al recibir.</strong>
          </p>
          <div className="hero__acciones">
            <a href="#catalogo" className="btn btn--primario">Ver productos</a>
            <a href="#ofertas" className="btn btn--fantasma">Ofertas de hoy</a>
          </div>
        </div>

        {/* El CircularText de React Bits girando alrededor del logo, como un sello */}
        {/* AnimatedContent: el sello aparece creciendo un poco al cargar */}
        <AnimatedContent className="sello" distance={30} scale={0.85} duration={0.9} delay={0.2}>
          <CircularText text="FRESCO DEL DÍA ✦ DESPACHO A DOMICILIO ✦ " onHover="slowDown" spinDuration={22} className="sello__texto" />
          {/* al centro del sello va el logo de la frutería, sobre un círculo crema */}
          <div className="sello__centro">
            <img src={logo} alt="Logo Frutería Don Vic" width="378" height="480" />
          </div>
        </AnimatedContent>
      </header>

      {ofertas.length > 0 && (
        <section id="ofertas" className="ofertas">
          <AnimatedContent distance={40}>
          <h2>
            <DepthText text="Ofertas de hoy" faceColor="#d9472b" depthColor="#7a2412" {...TITULO_3D} />
          </h2>
          {/* las ofertas pasan en una cinta infinita (LogoLoop): salen por un lado y entran por el otro.
              Se frena cuando pasas el mouse o el dedo, para poder tocar la que quieres */}
          <LogoLoop speed={45} gap={14} ariaLabel="Ofertas de hoy">
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
          </LogoLoop>
          </AnimatedContent>
        </section>
      )}

      <main id="catalogo" className="catalogo">
        <AnimatedContent className="catalogo__top" distance={40}>
          <h2>
            <DepthText text="Catálogo" faceColor="#1f4a2c" depthColor="#0c2214" {...TITULO_3D} />
          </h2>
          <input
            className="buscador"
            type="search"
            placeholder="Buscar: palta, tomate…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </AnimatedContent>

        <AnimatedContent distance={30} delay={0.08}>
        <div className="filtros" role="tablist">
          {categorias.map((c) => (
            <button key={c} className={`filtro ${c === categoria ? 'filtro--on' : ''}`} onClick={() => setCategoria(c)}>
              {c}
            </button>
          ))}
        </div>
        </AnimatedContent>

        {cargando ? (
          <p className="sin-resultados">Cargando los productos de hoy…</p>
        ) : visibles.length === 0 ? (
          <p className="sin-resultados">No encontramos "{busqueda}". Pregúntanos por WhatsApp, quizás llegó hoy.</p>
        ) : (
          <div className="grilla">
            {/* cada tarjeta sube al entrar en pantalla; el delay según su posición hace que
                las de una misma fila aparezcan en cascada y no todas de golpe */}
            {visibles.map((p, i) => (
              <AnimatedContent key={p.id} distance={50} delay={(i % 4) * 0.07} threshold={0.1}>
                <ProductoCard producto={p} cantidad={carrito[p.id] ?? 0} onCambiar={cambiarCantidad} />
              </AnimatedContent>
            ))}
          </div>
        )}
      </main>

      <AnimatedContent as="section" className="como" distance={50}>
        <h2>¿Cómo funciona?</h2>
        <ol>
          <li><strong>Arma tu pedido</strong> con lo que haya hoy.</li>
          <li><strong>Envíalo por WhatsApp</strong> y te confirmamos el total.</li>
          <li><strong>Recíbelo en tu casa</strong> o retíralo en el local. Pagas al recibir.</li>
        </ol>
      </AnimatedContent>

      <AnimatedContent as="footer" className="pie" distance={30}>
        <div>
          <strong>{TIENDA.nombre}</strong>
          <p>{TIENDA.direccion}</p>
          <p>{TIENDA.horario}</p>
        </div>
        <div className="pie__links">
          <a href={`https://wa.me/${TIENDA.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={`https://instagram.com/${TIENDA.instagram}`} target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </AnimatedContent>

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
