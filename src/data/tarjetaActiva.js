import { useSyncExternalStore } from 'react';

// Guardo cuál es LA tarjeta con el borde eléctrico prendido, para que haya una sola a la vez.
// Lo hago con un "store" mínimo y no con un estado en App, porque así cuando cambia solo se
// vuelven a dibujar las 2 tarjetas involucradas (la que se apaga y la que se prende),
// y no las 75 del catálogo.
let actual = null; // { id, modo } con modo 'mouse' o 'touch'
const avisar = new Set();
const notificar = () => avisar.forEach((f) => f());

export const activarTarjeta = (id, modo) => {
  if (actual?.id === id && actual.modo === modo) return;
  actual = { id, modo };
  notificar();
};

export const desactivarTarjeta = (id) => {
  if (actual?.id !== id) return;
  actual = null;
  notificar();
};

// devuelve 'mouse', 'touch' o null para esta tarjeta
export const useTarjetaActiva = (id) =>
  useSyncExternalStore(
    (cb) => {
      avisar.add(cb);
      return () => avisar.delete(cb);
    },
    () => (actual?.id === id ? actual.modo : null)
  );
