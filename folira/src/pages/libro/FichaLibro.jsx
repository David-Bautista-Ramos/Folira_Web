import { useState } from 'react'; // Importar useState para el manejo del estado
import { BsStarFill, BsStar, BsEye, BsEyeSlash } from 'react-icons/bs'; // Importar íconos de estrellas y ojo

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

  return (
    <div className="flex items-start p-6 bg-white rounded-lg shadow-lg relative">
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
