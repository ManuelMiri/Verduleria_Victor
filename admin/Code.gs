// Panel admin para la planilla de la Frutería don Vic.
// Lo dejé pegado a la misma hoja (Extensiones > Apps Script), así me ahorro
// las credenciales de Google Cloud y el panel siempre apunta a la planilla correcta.

const HOJA = 'Productos'; // nombre de la pestaña, si don Vic la renombra hay que cambiarlo acá

// Si quiero restringir más, pongo los correos acá. Vacío = entra cualquiera
// que ya tenga permiso de edición en la planilla.
const PERMITIDOS = [];

// Mismo orden que las columnas A..L de la hoja
const COLS = ['nombre', 'categoria', 'unidad', 'precio', 'oferta', 'hay',
              'nota', 'descripcion', 'ideal', 'guardar', 'foto', 'emoji'];

function doGet() {
  verificarAcceso_();
  const t = HtmlService.createTemplateFromFile('Index');
  t.urlPlanilla = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  return t.evaluate()
    .setTitle('Panel Frutería don Vic')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ---------- lectura ----------

function obtenerDatos() {
  verificarAcceso_();
  const h = hoja_();
  const ultima = h.getLastRow();
  const filas = ultima < 2 ? [] : h.getRange(2, 1, ultima - 1, COLS.length).getValues();

  const productos = [];
  filas.forEach((f, i) => {
    if (String(f[0]).trim() === '') return; // me salto las filas vacías
    const p = { fila: i + 2 };
    COLS.forEach((c, j) => p[c] = typeof f[j] === 'number' ? f[j] : String(f[j]));
    p.precio = num_(p.precio);
    p.oferta = p.oferta === '' ? '' : num_(p.oferta);
    productos.push(p);
  });

  return {
    productos,
    opciones: {
      categoria: opciones_(h, 2, productos, 'categoria'),
      unidad: opciones_(h, 3, productos, 'unidad'),
      hay: opciones_(h, 6, productos, 'hay', ['Sí', 'No'])
    }
  };
}

// Saco las opciones de los desplegables que ya tiene la planilla,
// así si agregan una categoría nueva en la hoja aparece sola en el panel.
function opciones_(h, col, productos, campo, porDefecto) {
  const regla = h.getRange(2, col).getDataValidation();
  if (regla) {
    const tipo = regla.getCriteriaType();
    const vals = regla.getCriteriaValues();
    const T = SpreadsheetApp.DataValidationCriteria;
    if (tipo === T.VALUE_IN_LIST) return vals[0].map(String);
    if (tipo === T.VALUE_IN_RANGE) return vals[0].getValues().flat().map(String).filter(Boolean);
  }
  const usados = [...new Set(productos.map(p => p[campo]).filter(Boolean))];
  return usados.length ? usados : (porDefecto || []);
}

// ---------- escritura ----------

// Guarda un producto completo (nuevo si no trae fila, edición si la trae)
function guardarProducto(p) {
  verificarAcceso_();
  validar_(p);
  return conLock_(() => {
    const h = hoja_();
    const valores = [[
      p.nombre.trim(), p.categoria, p.unidad, Number(p.precio),
      vacio_(p.oferta) ? '' : Number(p.oferta), p.hay || 'Sí',
      p.nota || '', p.descripcion || '', p.ideal || '', p.guardar || '',
      p.foto || '', p.emoji || ''
    ]];

    if (p.fila) {
      comprobarFila_(h, p.fila, p.nombreOriginal);
      h.getRange(p.fila, 1, 1, COLS.length).setValues(valores);
    } else {
      const destino = primeraFilaLibre_(h);
      // le copio el formato de la fila 2 para que el precio salga con $ y todo
      h.getRange(2, 1, 1, COLS.length).copyTo(
        h.getRange(destino, 1, 1, COLS.length),
        SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
      h.getRange(destino, 1, 1, COLS.length).setValues(valores);
    }
  });
}

// Para los cambios rápidos desde la lista: precio, oferta y el "¿Hay hoy?"
function cambiarCampo(fila, nombre, campo, valor) {
  verificarAcceso_();
  if (!['precio', 'oferta', 'hay'].includes(campo)) throw new Error('Ese campo no se edita desde acá.');
  if (campo === 'precio' && (vacio_(valor) || !(Number(valor) >= 0))) throw new Error('El precio tiene que ser un número.');
  if (campo === 'oferta' && !vacio_(valor) && !(Number(valor) >= 0)) throw new Error('La oferta tiene que ser un número.');

  return conLock_(() => {
    const h = hoja_();
    comprobarFila_(h, fila, nombre);
    const col = COLS.indexOf(campo) + 1;
    const v = campo === 'hay' ? valor : (vacio_(valor) ? '' : Number(valor));
    h.getRange(fila, col).setValue(v);
  });
}

function eliminarProducto(fila, nombre) {
  verificarAcceso_();
  return conLock_(() => {
    const h = hoja_();
    comprobarFila_(h, fila, nombre);
    h.deleteRow(fila);
  });
}

// ---------- utilidades ----------

function hoja_() {
  const h = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(HOJA);
  if (!h) throw new Error('No encontré la pestaña "' + HOJA + '".');
  return h;
}

function verificarAcceso_() {
  if (!PERMITIDOS.length) return;
  const email = (Session.getActiveUser().getEmail() || '').toLowerCase();
  if (!PERMITIDOS.map(e => e.toLowerCase()).includes(email)) {
    throw new Error('Tu cuenta no tiene acceso a este panel.');
  }
}

// El lock es por si don Vic y alguien más editan al mismo tiempo
function conLock_(fn) {
  const lock = LockService.getDocumentLock();
  lock.waitLock(10000);
  try {
    fn();
    SpreadsheetApp.flush();
  } finally {
    lock.releaseLock();
  }
  return obtenerDatos(); // devuelvo todo actualizado para refrescar la vista
}

// Antes de tocar una fila reviso que siga siendo el mismo producto,
// por si alguien borró o movió filas directo en la planilla.
function comprobarFila_(h, fila, nombre) {
  const actual = String(h.getRange(fila, 1).getValue()).trim();
  if (actual !== String(nombre || '').trim()) {
    throw new Error('La planilla cambió mientras tanto. Recarga el panel y vuelve a intentar.');
  }
}

function primeraFilaLibre_(h) {
  const maxFilas = h.getMaxRows();
  const colA = h.getRange(2, 1, Math.max(maxFilas - 1, 1), 1).getValues();
  for (let i = 0; i < colA.length; i++) {
    if (String(colA[i][0]).trim() === '') return i + 2;
  }
  return maxFilas + 1;
}

function validar_(p) {
  if (!p || !String(p.nombre || '').trim()) throw new Error('Falta el nombre.');
  if (vacio_(p.precio) || !(Number(p.precio) >= 0)) throw new Error('El precio tiene que ser un número.');
  if (!vacio_(p.oferta)) {
    if (!(Number(p.oferta) >= 0)) throw new Error('La oferta tiene que ser un número.');
    if (Number(p.oferta) >= Number(p.precio)) throw new Error('La oferta tiene que ser más barata que el precio.');
  }
}

function vacio_(v) {
  return v === '' || v === null || v === undefined;
}

// Por si algún precio quedó escrito como texto tipo "$1.490"
function num_(v) {
  if (typeof v === 'number') return v;
  const n = Number(String(v).replace(/[^\d]/g, ''));
  return isNaN(n) ? 0 : n;
}
