import { useState } from 'react';

// Armo el link de la foto. En la columna Foto de la planilla puede venir:
//  - un id de Unsplash ("photo-1582..."): le pido el ancho justo (w) para no bajar una foto gigante
//  - un link de Google Drive: lo paso al link de miniatura, porque el de "compartir" abre la
//    página de Drive y no la imagen (la foto tiene que estar compartida con "cualquiera con el enlace")
//  - cualquier otro link directo a una imagen: lo uso tal cual
export const fotoUrl = (foto, w = 400) => {
  const f = String(foto ?? '').trim();
  const drive = f.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
  if (drive) return `https://drive.google.com/thumbnail?id=${drive[1]}&sz=w${w * 2}`;
  if (/^https?:\/\//i.test(f)) return f;
  return `https://images.unsplash.com/${f}?w=${w}&q=70&auto=format&fit=crop`;
};

// Foto del producto. Si por algo no carga (sin internet, la sacaron de Unsplash, etc.)
// muestro el emoji, así la tarjeta nunca queda con un cuadro roto
export default function Foto({ producto, w = 400, className = '' }) {
  // guardo QUÉ foto falló y no solo "falló", así si cambian la foto en la planilla
  // vuelve a intentar con la nueva en vez de quedarse pegado en el emoji
  const src = producto.foto ? fotoUrl(producto.foto, w) : '';
  const [fallo, setFallo] = useState(null);

  if (!src || fallo === src) {
    return (
      <span className={`foto foto--emoji ${className}`} aria-hidden="true">
        {producto.emoji}
      </span>
    );
  }

  return (
    <img
      className={`foto ${className}`}
      src={src}
      alt={producto.nombre}
      loading="lazy"
      decoding="async"
      draggable="false"
      onError={() => setFallo(src)}
    />
  );
}
