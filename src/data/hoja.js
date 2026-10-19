import { useEffect, useState } from 'react';
import { CATEGORIAS, PRODUCTOS } from './productos';

// Ahora los productos salen de la planilla de Google que edita don Vic (o desde el panel admin).
// La leo con el endpoint "gviz" de Google Sheets, que devuelve la hoja en JSON y deja leerla
// desde el navegador sin API key. Solo pide que la planilla esté compartida como
// "Cualquier persona con el enlace puede ver".
//
// El ID de la planilla va en el .env (VITE_SHEET_ID). Si no está, uso los productos de
// productos.js, así puedo seguir trabajando en local sin internet.
// Si no hay .env uso este. No es secreto: la planilla igual está compartida como "solo lector"
const ID_PLANILLA = '1gB51GQeOhTxFszAMm0k9TYHO5sMro7hCcNBaciHwVLs';
const SHEET_ID = import.meta.env.VITE_SHEET_ID || ID_PLANILLA;
const HOJA = import.meta.env.VITE_SHEET_TAB || 'Productos';
const CLAVE_CACHE = 'productos-verduleria';

const URL_HOJA = SHEET_ID
  ? `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&headers=1&sheet=${encodeURIComponent(HOJA)}`
  : null;

// Quito tildes y paso a minúscula, me sirve para el "Sí"/"Si" y para armar el id
const limpiar = (t) => String(t ?? '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

// El id lo saco del nombre ("Palta Hass" -> "palta-hass"). Antes era el número de fila,
// pero si don Vic ordena la planilla se le cambiaban los productos a la gente en el carrito
const slug = (t) => limpiar(t).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Los de productos.js quedan de respaldo. Les cambio el id al mismo formato de la planilla,
// así el carrito no se descuadra si un día carga uno y otro día el otro
const LOCALES = PRODUCTOS.map((p) => ({ ...p, id: slug(p.nombre) }));

// Por si algún precio quedó escrito como texto tipo "$1.490"
const numero = (v) => {
  if (typeof v === 'number') return v;
  const n = Number(String(v ?? '').replace(/[^\d]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

// Las columnas van en el mismo orden que la planilla (A..L), así no dependo de cómo
// se llamen los encabezados. Si agregan una columna en medio hay que tocar esto
function filaAProducto(celdas) {
  const v = (i) => celdas[i]?.v ?? '';
  const texto = (i) => String(v(i)).trim();

  const nombre = texto(0);
  if (!nombre) return null; // fila vacía

  const oferta = numero(v(4));
  const hay = v(5);
  return {
    id: slug(nombre),
    nombre,
    categoria: texto(1),
    unidad: limpiar(v(2)) || 'unidad',
    precio: numero(v(3)),
    // si la oferta está vacía o en 0 la dejo undefined, que es lo que espera el resto del código
    oferta: oferta > 0 ? oferta : undefined,
    hayHoy: hay === true || limpiar(hay).startsWith('si'),
    nota: texto(6) || undefined,
    descripcion: texto(7),
    idealPara: texto(8),
    guardar: texto(9),
    foto: texto(10),
    emoji: texto(11) || '🥬',
  };
}

async function traerProductos() {
  const res = await fetch(URL_HOJA, { cache: 'no-store' });
  if (!res.ok) throw new Error('La planilla respondió ' + res.status);
  const txt = await res.text();

  // Google lo manda envuelto en "google.visualization.Query.setResponse({...});",
  // así que corto desde el primer { hasta el último }
  const json = JSON.parse(txt.slice(txt.indexOf('{'), txt.lastIndexOf('}') + 1));
  if (json.status === 'error') throw new Error(json.errors?.[0]?.detailed_message || 'Error leyendo la planilla');

  const productos = json.table.rows.map((r) => filaAProducto(r.c ?? [])).filter(Boolean);
  if (!productos.length) throw new Error('La planilla vino vacía');
  return productos;
}

const leerCache = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CACHE));
  } catch {
    return null;
  }
};

const guardarCache = (productos) => {
  try {
    localStorage.setItem(CLAVE_CACHE, JSON.stringify(productos));
  } catch {
    /* si no se puede guardar no pasa nada */
  }
};

// Hook que uso en App. Parte con lo último que se bajó (cache) para que la página
// aparezca al tiro, y después lo reemplaza con lo que hay en la planilla ahora.
export function useProductos() {
  const [productos, setProductos] = useState(() => (URL_HOJA ? leerCache() : LOCALES));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!URL_HOJA) return;
    let vivo = true;

    const cargar = () =>
      traerProductos()
        .then((ps) => {
          if (!vivo) return;
          setProductos(ps);
          setError(null);
          guardarCache(ps);
        })
        .catch((e) => {
          if (!vivo) return;
          console.warn('No pude leer la planilla:', e);
          setError(e);
          // si no hay nada en cache, muestro los de productos.js para que la página no quede vacía
          setProductos((actual) => actual ?? LOCALES);
        });

    cargar();
    // cuando vuelven a la pestaña recargo, por si don Vic cambió un precio mientras tanto
    const alVolver = () => document.visibilityState === 'visible' && cargar();
    document.addEventListener('visibilitychange', alVolver);
    return () => {
      vivo = false;
      document.removeEventListener('visibilitychange', alVolver);
    };
  }, []);

  return { productos: productos ?? [], cargando: productos === null, error };
}

// Las categorías salen de los productos, respetando el orden que ya tenía.
// Si don Vic inventa una categoría nueva en la planilla, aparece al final
export const categoriasDe = (productos) => {
  const usadas = [...new Set(productos.map((p) => p.categoria).filter(Boolean))];
  const conocidas = CATEGORIAS.filter((c) => c === 'Todo' || usadas.includes(c));
  return [...conocidas, ...usadas.filter((c) => !CATEGORIAS.includes(c))];
};
