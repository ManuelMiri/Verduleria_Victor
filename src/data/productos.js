// Los productos de verdad ahora salen de la planilla de Google (ver data/hoja.js).
// Este archivo queda de respaldo: se usa si no hay VITE_SHEET_ID o si la planilla no responde.
//
// unidad: 'kg' | 'unidad' | 'malla' | 'atado'
// hayHoy: lo uso en vez de stock exacto, porque en una verdulería eso cambia todo el día
// oferta: si tiene precio de oferta, sale en la sección "Ofertas del día"
// descripcion, idealPara y guardar: lo que sale por detrás de la tarjeta (FlipCard)
// foto: id de la foto en Unsplash (banco gratis, se puede usar sin pagar ni pedir permiso).
//   La armo con fotoUrl() de utils.js. Cuando tenga fotos reales del local, las cambio acá
// emoji: queda de respaldo, se muestra si la foto no carga

export const CATEGORIAS = ['Todo', 'Verduras', 'Frutas', 'Hojas y hierbas', 'Otros'];

export const PRODUCTOS = [
  { id: 1, nombre: 'Tomate', categoria: 'Verduras', unidad: 'kg', precio: 1490, oferta: 990, hayHoy: true, foto: 'photo-1582284540020-8acbe03f4924', emoji: '🍅',
    descripcion: 'Tomate de la zona, maduro y jugoso, de los que todavía tienen olor a tomate.', idealPara: 'Ensaladas, salsas y el clásico chileno', guardar: 'Fuera del refri, con el tallo hacia abajo' },
  { id: 2, nombre: 'Papa', categoria: 'Verduras', unidad: 'malla', precio: 4500, nota: 'Malla de 5 kg', hayHoy: true, foto: 'photo-1518977676601-b53f82aba655', emoji: '🥔',
    descripcion: 'Papa blanca de guarda, pareja de tamaño y firme.', idealPara: 'Puré, cazuela y papas fritas', guardar: 'En lugar oscuro y seco, lejos de la cebolla' },
  { id: 3, nombre: 'Cebolla', categoria: 'Verduras', unidad: 'kg', precio: 990, hayHoy: true, foto: 'photo-1618512496248-a07fe83aa8cb', emoji: '🧅',
    descripcion: 'Cebolla morada y blanca, firme y de capas apretadas.', idealPara: 'Sofrito, pebre y ensalada a la chilena', guardar: 'En un canasto ventilado, nunca en bolsa' },
  { id: 4, nombre: 'Zanahoria', categoria: 'Verduras', unidad: 'kg', precio: 890, hayHoy: true, foto: 'photo-1598170845058-32b9d6a5da37', emoji: '🥕',
    descripcion: 'Zanahoria dulce y crujiente, recién sacada.', idealPara: 'Ensalada rallada, cazuela y jugos', guardar: 'En el refri, sin las hojas' },
  { id: 5, nombre: 'Zapallo italiano', categoria: 'Verduras', unidad: 'unidad', precio: 450, oferta: 300, hayHoy: true, foto: 'photo-1615485499978-1279c3d6302f', emoji: '🥒',
    descripcion: 'Zapallo italiano tierno, de piel brillante y sin manchas.', idealPara: 'Budín, tortilla y salteados', guardar: 'En el refri, máximo 5 días' },
  { id: 6, nombre: 'Pimentón rojo', categoria: 'Verduras', unidad: 'unidad', precio: 690, hayHoy: true, foto: 'photo-1525607551316-4a8e16d1f9ba', emoji: '🫑',
    descripcion: 'Pimentón rojo carnoso y dulce, de cáscara firme.', idealPara: 'Asado a la parrilla, sofrito y ensaladas', guardar: 'En el cajón del refri' },
  { id: 7, nombre: 'Choclo', categoria: 'Verduras', unidad: 'unidad', precio: 500, hayHoy: false, foto: 'photo-1629570585008-27e194a5d0f8', emoji: '🌽',
    descripcion: 'Choclo pastelero de grano tierno. Llega con la temporada.', idealPara: 'Pastel de choclo y humitas', guardar: 'Con las hojas puestas, en el refri' },
  { id: 8, nombre: 'Ajo', categoria: 'Verduras', unidad: 'unidad', precio: 400, nota: 'Cabeza', hayHoy: true, foto: 'photo-1540148426945-6cf22a6b2383', emoji: '🧄',
    descripcion: 'Ajo chileno de diente grande y sabor intenso.', idealPara: 'Aliños, sofritos y pebre', guardar: 'En lugar seco y ventilado' },
  { id: 9, nombre: 'Palta Hass', categoria: 'Frutas', unidad: 'kg', precio: 3990, oferta: 2990, hayHoy: true, foto: 'photo-1523049673857-eb18f1d7b578', emoji: '🥑',
    descripcion: 'Palta Hass cremosa. Si la quieres para hoy, avísanos y te elegimos una a punto.', idealPara: 'Pan con palta, sushi y ensaladas', guardar: 'Para madurar, en una bolsa de papel' },
  { id: 10, nombre: 'Plátano', categoria: 'Frutas', unidad: 'kg', precio: 1190, hayHoy: true, foto: 'photo-1571771894821-ce9b6c11b08e', emoji: '🍌',
    descripcion: 'Plátano dulce, en su punto o un poco verde si prefieres.', idealPara: 'Colaciones, batidos y queques', guardar: 'Fuera del refri, colgado si se puede' },
  { id: 11, nombre: 'Manzana roja', categoria: 'Frutas', unidad: 'kg', precio: 1290, hayHoy: true, foto: 'photo-1560806887-1e4cd0b6cbd6', emoji: '🍎',
    descripcion: 'Manzana roja crujiente y dulce.', idealPara: 'Colación, postres y jugos', guardar: 'En el refri duran semanas' },
  { id: 12, nombre: 'Naranja', categoria: 'Frutas', unidad: 'malla', precio: 2990, nota: 'Malla de 3 kg', hayHoy: true, foto: 'photo-1611080626919-7cf5a9dbab5b', emoji: '🍊',
    descripcion: 'Naranja jugosa, buena para exprimir.', idealPara: 'Jugo natural y postres', guardar: 'En un lugar fresco o en el refri' },
  { id: 13, nombre: 'Limón', categoria: 'Frutas', unidad: 'kg', precio: 1590, hayHoy: true, foto: 'photo-1590502593747-42a996133562', emoji: '🍋',
    descripcion: 'Limón de cáscara delgada y con harto jugo.', idealPara: 'Pebre, ceviche y limonada', guardar: 'En el refri, en bolsa cerrada' },
  { id: 14, nombre: 'Frutilla', categoria: 'Frutas', unidad: 'kg', precio: 2990, hayHoy: false, foto: 'photo-1587393855524-087f83d95bc9', emoji: '🍓',
    descripcion: 'Frutilla de la temporada, dulce y aromática.', idealPara: 'Postres, batidos y con crema', guardar: 'En el refri, sin lavar hasta comerlas' },
  { id: 15, nombre: 'Lechuga', categoria: 'Hojas y hierbas', unidad: 'unidad', precio: 800, oferta: 600, hayHoy: true, foto: 'photo-1622206151226-18ca2c9ab4a1', emoji: '🥬',
    descripcion: 'Lechuga escarola fresca, de hojas firmes.', idealPara: 'Ensaladas y sánguches', guardar: 'Envuelta en papel húmedo, en el refri' },
  { id: 16, nombre: 'Cilantro', categoria: 'Hojas y hierbas', unidad: 'atado', precio: 500, hayHoy: true, foto: 'photo-1588879460618-9249e7d947d1', emoji: '🌿',
    descripcion: 'Cilantro fresco y aromático, recién cortado.', idealPara: 'Pebre, ceviche y cazuelas', guardar: 'En un vaso con agua, como flores' },
  { id: 17, nombre: 'Espinaca', categoria: 'Hojas y hierbas', unidad: 'atado', precio: 900, hayHoy: true, foto: 'photo-1574316071802-0d684efa7bf5', emoji: '🍃',
    descripcion: 'Espinaca de hoja tierna, lista para usar.', idealPara: 'Tortillas, salteados y ensaladas', guardar: 'En el refri, en bolsa con papel' },
  { id: 18, nombre: 'Huevos de campo', categoria: 'Otros', unidad: 'unidad', precio: 4200, nota: 'Bandeja de 12', hayHoy: true, foto: 'photo-1506976785307-8732e854ad03', emoji: '🥚',
    descripcion: 'Huevos de campo de gallinas libres, de yema bien naranja.', idealPara: 'Desayunos, queques y tortillas', guardar: 'En el refri, con la punta hacia abajo' },
];
