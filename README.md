# Verdulería El Huerto

Página de catálogo para la verdulería, con pedido por WhatsApp. Hecha con React + Vite y componentes de [React Bits](https://reactbits.dev/).

## Correrla

```bash
npm install
npm run dev
```

## Qué cambiar antes de mostrársela al dueño

- `src/data/tienda.js`: nombre, WhatsApp, dirección, horario, sectores de despacho y pedido mínimo.
- `src/data/productos.js`: productos, precios, ofertas, si hay o no hay hoy y la descripción de atrás de cada tarjeta.
- Las fotos son de Unsplash (banco gratis, sin pagar ni pedir permiso) y van enlazadas con el campo `foto` de cada producto. Si una foto no carga, aparece el emoji. La idea es cambiarlas por fotos reales del local.

## Componentes de React Bits que usé

- **CircularText**: el sello que gira en el hero.
- **BlurText**: el título que aparece palabra por palabra.
- **FlipCard**: las tarjetas de producto. Adelante el precio y el botón, atrás la descripción (se da vuelta al tocarla).
- **MetaBalls**: el fondo de manchas en durazno que se mueven y se fusionan.
- **ClickSpark**: las chispas al agregar un producto (el + cuando está en 0) y en las ofertas.
- **SpringCheck**: el check en "Tu pedido" para ir marcando lo que ya revisaste.

Están copiados en `src/components/reactbits/`. Se pueden agregar más con
`npx shadcn@latest add @react-bits/<Componente>-JS-CSS`.

## Publicar

`npm run build` y subir la carpeta `dist/` a Cloudflare Pages o Vercel.

## Lo que falta (fase 2)

- Pasar los productos a Supabase para que el dueño cambie precios desde el celular.
- Fotos reales y dominio propio.
- Ficha de Google Business.

## Publicar en GitHub Pages

```bash
npm run deploy
```

Eso construye la página y la sube a la rama `gh-pages`. La primera vez hay que activar Pages en el repo: Settings → Pages → Branch: `gh-pages` / `(root)`.
