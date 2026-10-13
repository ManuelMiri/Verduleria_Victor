import { useState } from 'react';

// Armo el link de la foto de Unsplash. Le pido el ancho justo que necesito (w) para que
// no baje una foto gigante en el celular. auto=format hace que Unsplash mande webp si se puede
export const fotoUrl = (id, w = 400) =>
  `https://images.unsplash.com/${id}?w=${w}&q=70&auto=format&fit=crop`;

// Foto del producto. Si por algo no carga (sin internet, la sacaron de Unsplash, etc.)
// muestro el emoji, así la tarjeta nunca queda con un cuadro roto
export default function Foto({ producto, w = 400, className = '' }) {
  const [fallo, setFallo] = useState(false);

  if (fallo || !producto.foto) {
    return (
      <span className={`foto foto--emoji ${className}`} aria-hidden="true">
        {producto.emoji}
      </span>
    );
  }

  return (
    <img
      className={`foto ${className}`}
      src={fotoUrl(producto.foto, w)}
      alt={producto.nombre}
      loading="lazy"
      decoding="async"
      draggable="false"
      onError={() => setFallo(true)}
    />
  );
}
