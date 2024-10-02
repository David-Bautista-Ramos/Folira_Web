import { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs'; // Importar íconos de estrellas y ojo

const DetallesComunidad = ({ comunidad }) => {
  const { nombre, administrador, descripcion, numeroMiembros, imagen, enlaceConexion } = comunidad;
  const [expandirDescripcion, setExpandirDescripcion] = useState(false); // Estado para manejar la expansión de la descripción

  // Función para manejar el clic en el ícono
  const toggleDescripcion = () => {
    setExpandirDescripcion(!expandirDescripcion);
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg relative">
      <div className="flex">
        <img
          src={imagen}
          alt={nombre}
          className="w-48 h-48 rounded-full object-cover"
          style={{ flexShrink: 0 }} // Para evitar que la imagen se ajuste
        />

        <div className="ml-6 flex flex-col flex-grow"> {/* Contenido de la comunidad */}
          <h2 className="text-2xl font-semibold">{nombre}</h2>
          <p className="text-lg"><strong>Administrador:</strong> {administrador}</p>

          {/* Descripción con lógica de expansión */}
          <p className="text-lg">
            <strong>Descripción:</strong> {expandirDescripcion ? descripcion : `${descripcion.substring(0, 100)}...`}
            {descripcion.length > 150 && (
              <button onClick={toggleDescripcion} className="ml-2 text-primary">
                {expandirDescripcion ? <BsEyeSlash /> : <BsEye />}
              </button>
            )}
          </p>

          <p className="text-lg"><strong>Número de miembros:</strong> {numeroMiembros}</p>
          
          {/* Nuevo párrafo para el enlace de conexión */}
          <p className="text-lg">
            <strong>Enlace de conexión:</strong> <a href={enlaceConexion} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{enlaceConexion}</a>
          </p>
        </div>
      </div>

      {/* Botón "Unirse a la comunidad" debajo de la imagen */}
      <div className="-mt-[15px]"> {/* Cambiado de mt-2 a mt-1 para acercar el botón */}
        <a
          href={enlaceConexion}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary hover:bg-blue-950 text-white font-bold py-2 px-4 rounded"
        >
          Unirse a la comunidad
        </a>
      </div>
    </div>
  );
};

// Ejemplo de uso del componente
const ejemploComunidad = {
  nombre: 'Amantes de la Literatura',
  administrador: 'Laura Martínez',
  descripcion: 'Un espacio para compartir y discutir sobre libros, autores y géneros literarios. Aquí puedes encontrar una variedad de opiniones y recomendaciones para tus próximas lecturas.',
  numeroMiembros: 150,
  imagen: 'https://via.placeholder.com/200', // Imagen de ejemplo
  enlaceConexion: 'https://example.com/unirse', // Link para unirse a la comunidad
};

const App = () => {
  return (
    <div className="p-6">
      <DetallesComunidad comunidad={ejemploComunidad} />
    </div>
  );
};

export default App;
