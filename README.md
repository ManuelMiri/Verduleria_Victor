# Frutería don Vic

Catálogo web con pedido por WhatsApp para una frutería de barrio en Padre Las Casas, Temuco. El dueño actualiza precios, ofertas y stock desde el celular, sin tocar código.

## Qué hace

- Catálogo con buscador, filtro por categoría y sección de ofertas del día.
- Carrito que arma el pedido y lo envía por WhatsApp, con costo de despacho según sector.
- Los productos se leen en vivo desde una planilla de Google Sheets.
- Panel admin móvil (Google Apps Script) para que el dueño edite precios, ofertas y disponibilidad.

## Stack

- **Frontend:** React 19 + Vite, componentes animados de [React Bits](https://reactbits.dev/).
- **Datos:** Google Sheets como base de datos liviana, leída con el endpoint `gviz` (sin backend ni API key).
- **Admin:** Google Apps Script, con escrituras protegidas con `LockService` y validación en servidor.
- **Deploy:** GitHub Actions → GitHub Pages.

## Decisiones técnicas

- **Sin backend propio:** para un negocio chico, una planilla que el dueño ya sabe usar resulta más mantenible que una base de datos.
- **Resiliencia:** la página guarda en caché la última versión de los productos y, si la planilla no responde, usa un respaldo local. Nunca queda vacía.
- **Carrito estable:** el id de cada producto sale de su nombre y no de la fila, así reordenar la planilla no desarma los carritos abiertos.

## Correr en local

```bash
npm install
npm run dev
```

Sin `VITE_SHEET_ID` en el `.env`, la página usa los productos de respaldo de `src/data/productos.js`.

## Estructura

```
src/
  data/hoja.js        lectura de la planilla, caché y respaldo
  components/         tarjetas, carrito, fotos
admin/                panel de administración (Apps Script)
.github/workflows/    deploy automático
```
