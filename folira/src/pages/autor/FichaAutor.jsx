import { useState } from 'react'; // Importar useState para el manejo del estado
import ModalReseñas from '../../pages/libro/ModalReseñas';

const FichaAutor = ({ autor }) => {
  const { nombre, pais, nacimiento, anosActivos, distinciones, imagen } = autor;

  // Estado para manejar las reseñas
  const [reseñas, setReseñas] = useState([
    {
      usuario: 'Juan Pérez',
      comentario: 'Un autor fascinante, sus obras son inolvidables.',
      imagen: 'https://via.placeholder.com/48', // Imagen de perfil de ejemplo
    },
    {
      usuario: 'Ana Gómez',
      comentario: 'La narrativa de este autor es increíble, muy recomendable.',
      imagen: 'https://via.placeholder.com/48',
    },
    // Puedes agregar más reseñas aquí
  ]);

  // Estado para manejar el texto del comentario
  const [comentario, setComentario] = useState("");

  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para manejar el envío del comentario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comentario.trim() === "") return; // Validar que no esté vacío

    // Agregar la nueva reseña al estado de reseñas
    const nuevaReseña = {
      usuario: 'Usuario Anónimo', // Puedes cambiar esto por un nombre de usuario real
      comentario,
      imagen: 'https://via.placeholder.com/48', // Imagen de perfil de ejemplo
    };

    setReseñas((prevReseñas) => [...prevReseñas, nuevaReseña]); // Agregar reseña
    setComentario(''); // Limpiar el campo de comentario después de enviar
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

        <div className="ml-6 flex flex-col flex-grow"> {/* Contenido del autor */}
          <h2 className="text-2xl font-semibold">{nombre}</h2>
          <p className="text-lg"><strong>País:</strong> {pais}</p>
          <p className="text-lg"><strong>Nacimiento:</strong> {nacimiento}</p>
          <p className="text-lg"><strong>Años Activos:</strong> {anosActivos}</p>
          <p className="text-lg"><strong>Distinciones:</strong> {distinciones.join(', ')}</p>
        </div>
      </div>

      {/* Botón para ver reseñas */}
      <button 
        onClick={() => setIsModalOpen(true)} 
        className="mt-4 ml-2 bg-primary hover:bg-blue-950 text-white font-bold py-2 w-[180px] px-4 rounded"
      >
        Ver Reseñas
      </button>

      {/* Campo de texto para escribir comentario */}
      <form onSubmit={handleSubmit} className="mt-4 w-full">
        <label className="block mt-4  text-md font-medium mb-2">Escribe una reseña:</label>
        <div className="flex w-full">
          <input
            type="text"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)} // Actualizar estado del comentario
            className="w-full p-2  border rounded focus:border-primary focus:outline-none"
            placeholder="Escribe tu reseña..."
          />
          <button
            type="submit"
            className="ml-2 bg-primary hover:bg-blue-950 text-white p-2 rounded-lg"
          >
            Enviar
          </button>
        </div>
      </form>

      {/* Renderizar solo las primeras 4 reseñas */}
      <div className="mt-6">
        {reseñas.slice(0, 4).map((reseña, index) => (
          <div key={index} className="flex items-start mb-4 p-4 border border-gray-200 rounded-lg bg-gray-100">
            <img 
              src={reseña.imagen} 
              alt={`${reseña.usuario} perfil`} 
              className="w-12 h-12 rounded-full mr-4"
              style={{ width: '48px', height: '48px' }} // Ajustar tamaño a 48x48
            />
            <div>
              <h3 className="font-semibold">{reseña.usuario}</h3>
              <p className="text-md">{reseña.comentario}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Componente ModalReseñas si lo necesitas */}
      <ModalReseñas isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} reseñas={reseñas} />
    </div>
  );
};

// Ejemplo de uso del componente
const ejemploAutor = {
  nombre: 'Gabriel García Márquez',
  pais: 'Colombia',
  nacimiento: '6 de marzo de 1927',
  anosActivos: '1947 - 2014',
  distinciones: ['Premio Nobel de Literatura', 'Premio Rómulo Gallegos'],
  imagen: 'https://via.placeholder.com/200' // Imagen de ejemplo
};

const App = () => {
  return (
    <div className="p-6">
      <FichaAutor autor={ejemploAutor} />
    </div>
  );
};

export default App;
