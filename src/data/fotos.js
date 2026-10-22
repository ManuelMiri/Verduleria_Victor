// Fotos de respaldo para cuando la columna Foto de la planilla viene vacía.
// Todas son de Unsplash (licencia gratis, se pueden usar sin pagar ni pedir permiso).
// La clave es el nombre del producto "limpio" (sin tildes, minúscula y con guiones).
// Si no hay una clave exacta, uso la más larga con la que empiece el nombre: así
// "sandia-amarilla" usa su foto, y una "sandia-calipso" nueva caería en "sandia".
export const FOTOS = {
  // genéricas por tipo de producto
  huevos: 'photo-1506976785307-8732e854ad03',
  sandia: 'photo-1587049352846-4a222e784d38',
  melon: 'photo-1773487743024-756afae04b87',
  frutilla: 'photo-1587393855524-087f83d95bc9',
  palta: 'photo-1523049673857-eb18f1d7b578',
  naranja: 'photo-1611080626919-7cf5a9dbab5b',
  mandarina: 'photo-1564415900645-30612d54dd0c',
  clementina: 'photo-1743071877775-87d87793c8b4',
  platano: 'photo-1571771894821-ce9b6c11b08e',
  pera: 'photo-1570115114436-63d3405246e7',
  tuna: 'photo-1792002038174-f8e82976ffdf',
  mango: 'photo-1553279768-865429fa0078',
  pomelo: 'photo-1577234286642-fc512a5f8f11',
  limon: 'photo-1590502593747-42a996133562',
  manzana: 'photo-1560806887-1e4cd0b6cbd6',
  tomate: 'photo-1582284540020-8acbe03f4924',
  choclo: 'photo-1629570585008-27e194a5d0f8',
  esparrago: 'photo-1780595678100-b7b704c9fe13',
  aji: 'photo-1693664132282-29467c147940',
  morron: 'photo-1525607551316-4a8e16d1f9ba',
  pimenton: 'photo-1525607551316-4a8e16d1f9ba',
  pepino: 'photo-1449300079323-02e209d9d3a6',
  zanahoria: 'photo-1598170845058-32b9d6a5da37',
  zapallo: 'photo-1533924049770-7c32435557c5',
  'zapallo-italiano': 'photo-1615485499978-1279c3d6302f',
  beterraga: 'photo-1663961355715-cf362778dc0e',
  papa: 'photo-1518977676601-b53f82aba655',
  cebolla: 'photo-1618512496248-a07fe83aa8cb',
  ajo: 'photo-1540148426945-6cf22a6b2383',
  lechuga: 'photo-1622206151226-18ca2c9ab4a1',
  cilantro: 'photo-1588879460618-9249e7d947d1',
  perejil: 'photo-1758055660473-a61e426ade6e',
  cibulette: 'photo-1763221126413-5e7bbad876f6',
  acelga: 'photo-1558373235-cabfa82b2337',
  espinaca: 'photo-1574316071802-0d684efa7bf5',
  puerro: 'photo-1760108273146-c1ad5f5bce30',
  cebollin: 'photo-1654722346666-fc814e4457a5',
  repollo: 'photo-1555694758-9f4db327ada9',
  pickle: 'photo-1773306255915-921ea95858aa',
  pepinillo: 'photo-1774456567094-726973275d34',
  americanas: 'photo-1693212454137-0d2909d79b27',
  aceituna: 'photo-1706378398576-57a21244ef7a',
  papaya: 'photo-1765454195979-812683c802aa',
  oregano: 'photo-1737099099970-448f8740df90',
  alino: 'photo-1596040033229-a9821ebd058d',
  canela: 'photo-1622798337764-259682f03741',
  sal: 'photo-1646722670581-974d084e0ec0',
  pimienta: 'photo-1777483997189-9d934b0f177d',
  bicarbonato: 'photo-1562245376-3f9dae9f0e73',
  coco: 'photo-1588413333412-82148535db53',
  harina: 'photo-1610725664285-7c57e6eeac3f',
  'flor-de-jamaica': 'photo-1788963704657-ed5bf1064976',
  miel: 'photo-1558642452-9d2a7deb7f62',
  nuez: 'photo-1524593000379-d4729b2c4f99',
  nueces: 'photo-1524593000379-d4729b2c4f99',
  pasas: 'photo-1642102903918-b97c37955bbf',
  carbon: 'photo-1621851709622-e19c9a4f0cc5',
  lena: 'photo-1571040195944-85a412548a43',

  // las que necesitan una foto distinta a la genérica
  'sandia-amarilla': 'photo-1789562721106-f034c0c69283',
  'manzana-verde': 'photo-1512578659172-63a4634c05ec',
  'pepino-ensalada-mediano': 'photo-1587411768638-ec71f8e33b78',
  'cebolla-morada': 'photo-1760368104753-fe0994f94ff3',
  'cebolla-en-escabeche': 'photo-1786046873392-fac519ea6fa7',
  'cebolla-perla': 'photo-1641738219797-c814f6fab4d3',
  'aji-en-escabeche': 'photo-1788386554965-5d548ca652ac',
  'aji-salsa-artesanal': 'photo-1615810227931-4d9f62fd02aa',
  'aji-chileno-salsa': 'photo-1567539549213-cc1697632146',
  'aji-cacho-de-cabra-seco': 'photo-1602237514002-c2d8ae2da393',
  'miel-liquida': 'photo-1613548058193-1cd24c1bebcf',
};

// Busco la foto por nombre: primero exacta, si no la clave más larga con la que empiece.
// Comparo también sin la "s" final, así "sandias" o "tunas" encuentran "sandia" y "tuna"
export function fotoDeRespaldo(slugNombre) {
  if (FOTOS[slugNombre]) return FOTOS[slugNombre];
  const palabras = slugNombre.split('-');
  for (let n = palabras.length; n > 0; n--) {
    const pedazo = palabras.slice(0, n).join('-');
    // pruebo tal cual, sin la "s" (pickles -> pickle) y sin "es" (limones -> limon)
    for (const k of [pedazo, pedazo.replace(/s$/, ''), pedazo.replace(/es$/, '')]) {
      if (FOTOS[k]) return FOTOS[k];
    }
  }
  return '';
}
