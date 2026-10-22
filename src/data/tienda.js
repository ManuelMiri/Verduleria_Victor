// Aquí dejo todos los datos del negocio juntos, así cuando hable con el dueño
// solo cambio este archivo y no tengo que andar buscando por todo el código.
export const TIENDA = {
  nombre: 'FruteriaDonVic',
  // el título va en dos partes: lo de arriba queda fijo y abajo van rotando las frases
  titulo: 'Lo de la feria,',
  frases: ['sin ir a la feria', 'sin cargar las bolsas', 'directo a tu puerta'],
  // número con código de país y sin el "+", así lo pide WhatsApp
  whatsapp: '56937766589',
  direccion: 'Calle Ejemplo 123, Padre Las Casas, Temuco',
  horario: 'Lun a Sáb · 8:30 a 20:00',
  instagram: 'verduleria.elhuerto',
  pedidoMinimo: 8000,
  // sectores donde reparte y lo que cobra por cada uno (esto se lo tengo que preguntar)
  sectores: [
    { nombre: 'Retiro en el local', costo: 0 },
    { nombre: 'Centro', costo: 1500 },
    { nombre: 'Oriente', costo: 2000 },
    { nombre: 'Norte', costo: 2500 },
    { nombre: 'Sur', costo: 2500 },
  ],
};
