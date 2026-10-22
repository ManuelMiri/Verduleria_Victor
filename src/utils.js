// Formateo los precios a pesos chilenos: $1.490
export const clp = (n) =>
  '$' + Math.round(n).toLocaleString('es-CL');

// Lo que se cobra de verdad: si hay oferta uso esa, si no el normal
export const precioFinal = (p) => p.oferta ?? p.precio;

// Por kilo dejo pedir de a medio kilo, lo demás va de a 1
export const paso = (unidad) => (unidad === 'kg' ? 0.5 : 1);

// Texto corto de la unidad para mostrar al lado del precio. Si en la planilla ponen
// una unidad que no está acá (ej: "caja"), muestro la palabra tal cual
const ETIQUETAS = { kg: 'kg', unidad: 'c/u' };
export const etiqueta = (unidad) => ETIQUETAS[unidad] ?? unidad;

// Cómo se lee la cantidad: "1,5 kg", "3 unid.", "2 mallas"
export const textoCantidad = (cant, unidad) => {
  const n = cant.toLocaleString('es-CL');
  if (unidad === 'kg') return `${n} kg`;
  if (unidad === 'unidad') return `${n} unid.`;
  return `${n} ${unidad}${cant > 1 ? 's' : ''}`;
};
