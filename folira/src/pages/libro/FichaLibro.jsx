import { BsStarFill, BsStar } from 'react-icons/bs'; // Importar íconos de estrellas de react-icons

const FichaTecnicaLibro = ({ libro }) => {
  const {
    titulo,
    autor,
    generos,
    sinopsis,
    serie,
    isbn,
    calificacion,
    imagen,
  } = libro;

  // Función para renderizar las estrellas según la calificación
  const renderEstrellas = () => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= calificacion) {
        estrellas.push(<BsStarFill key={i} className="text-yellow-500" />);
      } else {
        estrellas.push(<BsStar key={i} className="text-gray-300" />);
      }
    }
    return estrellas;
  };

  return (
    <div className="flex items-center p-6 bg-white rounded-lg shadow-lg relative">
      <img 
        src={imagen} 
        alt={titulo} 
        className="w-1/3 h-[250px] rounded-lg object-cover"
      />
      <div className="ml-6 flex flex-col"> {/* Contenido del libro */}
        <h2 className="text-2xl font-semibold">{titulo}</h2>
        <p className="text-lg font-medium">Autor: {autor}</p>
        <p className="text-md">Géneros: {generos.join(', ')}</p>
        <p className="text-md">Serie: {serie || 'N/A'}</p>
        <p className="text-md">ISBN: {isbn}</p>
        <p className="text-md">Sinopsis: {sinopsis}</p>
        <div className="flex items-center mt-2">
          <span className="text-lg font-medium">Calificación:</span>
          <div className="flex ml-2">{renderEstrellas()}</div>
        </div>
      </div>
      {/* Línea vertical fuera del contenedor */}
      <div className="absolute right-0 h-full border-l border-gray-300"></div>
    </div>
  );
};

// Ejemplo de uso del componente
const ejemploLibro = {
  titulo: 'Cien años de soledad',
  autor: 'Gabriel García Márquez',
  generos: ['Ficción', 'Realismo mágico'],
  sinopsis: 'Una historia de la familia Buendía en el pueblo de Macondo.',
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
