# Verdulería El Huerto

Página de catálogo para la verdulería, con pedido por WhatsApp. Hecha con React + Vite y componentes de [React Bits](https://reactbits.dev/).

## Correrla

```bash
npm install
npm run dev
```

## Qué cambiar antes de mostrársela al dueño

- `src/data/tienda.js`: nombre, WhatsApp, dirección, horario, sectores de despacho y pedido mínimo.
- Los productos, precios, ofertas y el "¿Hay hoy?" salen de la planilla de Google (ver abajo). `src/data/productos.js` queda solo de respaldo.
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

## Productos desde la planilla de Google

La página lee la planilla `Productos-Fruteria-don-Vic` cada vez que se abre (y cuando vuelves a la pestaña).

1. En la planilla: **Compartir → Acceso general → Cualquier persona con el enlace → Lector**.
2. Copia el ID del link (`https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit`).
3. Crea un archivo `.env` (puedes copiar `.env.example`) con `VITE_SHEET_ID=ese_id`.
4. `npm run build` o `npm run deploy`. El ID queda metido en el build, así que si cambias de planilla hay que volver a publicar.

Las columnas tienen que seguir en este orden (A..L): Nombre, Categoría, Unidad, Precio, Precio oferta, ¿Hay hoy?, Nota, Descripción, Ideal para, Cómo guardar, Foto, Emoji.
Si la planilla no responde, la página muestra lo último que bajó, y si no hay nada usa `productos.js`.

## Panel admin (para don Vic)

En `admin/` está el panel para editar la planilla desde el celular (Google Apps Script). Se pega en la planilla en **Extensiones → Apps Script** (`Code.gs` y un archivo HTML llamado `Index`) y se publica como aplicación web.

## Lo que falta (fase 2)

- Fotos reales y dominio propio.
- Ficha de Google Business.

## Publicar en GitHub Pages

```bash
npm run deploy
```

Eso construye la página y la sube a la rama `gh-pages`. La primera vez hay que activar Pages en el repo: Settings → Pages → Branch: `gh-pages` / `(root)`.
