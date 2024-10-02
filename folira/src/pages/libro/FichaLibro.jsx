import { useState } from 'react'; // Importar useState para el manejo del estado
import { BsStarFill, BsStar, BsEye, BsEyeSlash } from 'react-icons/bs'; // Importar íconos de estrellas y ojo
import ModalReseñas from './ModalReseñas'; // Importar el componente ModalReseñas

const FichaTecnicaLibro = ({ libro }) => {
  const {
    titulo,
    autor,
    generos,
    sinopsis,
    serie,
    isbn,
    calificacion: calificacionInicial,
    imagen,
  } = libro;

  // Estado para controlar si la sinopsis está expandida o no
  const [isExpanded, setIsExpanded] = useState(false);

  // Estado para manejar la calificación del usuario
  const [calificacion, setCalificacion] = useState(calificacionInicial);

  // Estado para el texto del comentario
  const [comentario, setComentario] = useState("");

  // Estado para manejar las reseñas
  const [reseñas, setReseñas] = useState([
    {
      usuario: 'Juan Pérez',
      comentario: 'Un libro fascinante que me mantuvo enganchado desde la primera página.',
      imagen: 'https://via.placeholder.com/50', // Imagen de perfil de ejemplo
    },
    {
      usuario: 'Ana Gómez',
      comentario: 'Una obra maestra del realismo mágico, cada relectura es un nuevo descubrimiento.',
      imagen: 'https://via.placeholder.com/50',
    },
    {
      usuario: 'Carlos López',
      comentario: 'No me gustó tanto como esperaba, la historia es un poco lenta en algunas partes.',
      imagen: 'https://via.placeholder.com/50',
    },
    {
      usuario: 'María Torres',
      comentario: 'Excelente narración, con personajes inolvidables y un estilo único.',
      imagen: 'https://via.placeholder.com/50',
    },
  ]);

  // Estado para el modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Limitar la sinopsis a 100 caracteres y agregar el ícono
  const renderSinopsis = () => {
    const sinopsisCorta = sinopsis.slice(0, 100);
    const esLarga = sinopsis.length > 100;

    return (
      <div>
        <p className="text-md">
          Sinopsis: {isExpanded ? sinopsis : `${sinopsisCorta}...`}
          {esLarga && (
            <span
              className="inline ml-2 cursor-pointer text-blue-500"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <BsEyeSlash className="inline" /> Leer menos
                </>
              ) : (
                <>
                  <BsEye className="inline" /> Leer más
                </>
              )}
            </span>
          )}
        </p>
      </div>
    );
  };

  // Función para renderizar las estrellas según la calificación
  const renderEstrellas = () => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <div
          key={i}
          onClick={() => setCalificacion(i)} // Actualizar calificación al hacer clic
          className="cursor-pointer"
        >
          {i <= calificacion ? (
            <BsStarFill className="text-yellow-500" />
          ) : (
            <BsStar className="text-gray-300" />
          )}
        </div>
      );
    }
    return estrellas;
  };

  // Función para manejar el envío del comentario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (comentario.trim() === "") return; // Validar que no esté vacío

    // Agregar la nueva reseña al estado de reseñas
    const nuevaReseña = {
      usuario: 'Usuario Anónimo', // Puedes cambiar esto por un nombre de usuario real
      comentario,
      imagen: 'https://via.placeholder.com/50', // Imagen de perfil de ejemplo
    };

    setReseñas((prevReseñas) => [...prevReseñas, nuevaReseña]); // Agregar reseña
    setComentario(''); // Limpiar el campo de comentario después de enviar
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg relative">
      <div className="flex">
        <img 
          src={imagen} 
          alt={titulo} 
          className="w-1/3 h-[250px] rounded-lg object-cover"
          style={{ flexShrink: 0 }} // Para evitar que la imagen se ajuste
        />

        <div className="ml-6 flex flex-col flex-grow"> {/* Contenido del libro */}
          <h2 className="text-2xl font-semibold">{titulo}</h2>
          <p className="text-lg font-medium">Autor: {autor}</p>
          <p className="text-md">Géneros: {generos.join(', ')}</p>
          <p className="text-md">Serie: {serie || 'N/A'}</p>
          <p className="text-md">ISBN: {isbn}</p>
          {renderSinopsis()} {/* Renderizar la sinopsis */}
          <div className="flex items-center mt-2">
            <span className="text-lg font-medium">Calificación:</span>
            <div className="flex ml-2">{renderEstrellas()}</div>
          </div>
        </div>
      </div>

      {/* Botón "Ver reseña" que abre el modal */}
      <button
        className="mt-4 bg-primary hover:bg-blue-950 text-white font-bold py-2 w-[180px] px-4 rounded"
        onClick={() => setIsModalOpen(true)} // Abrir el modal al hacer clic
      >
        Ver reseñas
      </button>

      {/* Campo de texto para escribir comentario */}
      <form onSubmit={handleSubmit} className="mt-4 w-full">
        <label className="block text-md font-medium mb-2">Escribe una reseña:</label>
        <div className="flex w-full">
          <input
            type="text"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)} // Actualizar estado del comentario
            className="w-full p-2 border rounded focus:border-primary focus:outline-none"
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
            />
            <div>
              <h3 className="font-semibold">{reseña.usuario}</h3>
              <p className="text-md">{reseña.comentario}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Componente ModalReseñas */}
      <ModalReseñas isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} reseñas={reseñas} />
    </div>
  );
};

// Ejemplo de uso del componente
const ejemploLibro = {
  titulo: 'Cien años de soledad',
  autor: 'Gabriel García Márquez',
  generos: ['Ficción', 'Realismo mágico'],
  sinopsis: 'Una historia de la familia Buendía en el pueblo de Macondo. Una historia de la familia Buendía en el pueblo de Macondo. Una historia de la familia Buendía en el pueblo de Macondo. Una historia de la familia Buendía en el pueblo de Macondo. Una historia de la familia Buendía en el pueblo de Macondo.',
  serie: null,
  isbn: '978-3-16-148410-0',
  calificacion: 4, // 4 estrellas
  imagen: 'https://via.placeholder.com/150', // URL de imagen de ejemplo
};

const App = () => {
  return (
    <div className="p-6">
      <FichaTecnicaLibro libro={ejemploLibro} />
    </div>
  );
};

export default App;
