import { useEffect, useState } from 'react'; // Importa useEffect y useState
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const Comunidad = ({ authUser }) => {
  const [autores, setAutores] = useState([]); // Estado para manejar los autores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(''); // Estado para el filtrado
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [authorsPerPage] = useState(6); // Número de autores por página

  const fetchAutores = async () => {
    try {
      const response = await fetch(`/api/autror/getAutoresAct`, { // Asegúrate de que esta URL es correcta
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al recuperar los autores');
      }

      const data = await response.json();
      setAutores(data.autores || []); // Asegúrate de que la respuesta tiene el formato correcto
    } catch (error) {
      console.error('Error al recuperar los autores:', error);
      setError('Error al cargar los autores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAutores();
  }, [authUser]); // No es necesario pasar authUser en el array de dependencias si no afecta a la carga

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Filtrar autores según el input
  const filteredAutores = autores.filter(autor =>
    autor.nombre.toLowerCase().includes(filter.toLowerCase()) || 
    autor.seudonimo.toLowerCase().includes(filter.toLowerCase())
  );

  // Ordenar los autores por fecha de creación (o la propiedad que tengas para ordenarlos)
  const sortedAutores = filteredAutores.sort((a, b) => {
    // Asegúrate de que la propiedad `fechaCreacion` esté en formato adecuado (Date o timestamp)
    const dateA = new Date(a.fechaCreacion); // Si `fechaCreacion` es una cadena en formato ISO, esto lo convierte a Date
    const dateB = new Date(b.fechaCreacion); // Si `fechaCreacion` no es válida, se devolverá NaN
    return dateB - dateA; // Ordena de más reciente a más antiguo
  });

  // Lógica para obtener los autores de la página actual
  const indexOfLastAuthor = currentPage * authorsPerPage;
  const indexOfFirstAuthor = indexOfLastAuthor - authorsPerPage;
  const currentAuthors = sortedAutores.reverse().slice(indexOfFirstAuthor, indexOfLastAuthor);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(sortedAutores.length / authorsPerPage);

  // Función para cambiar de página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className='flex-[4_4_0] border-primary min-h-screen px-6'>

      {/* Campo de entrada para el filtrado con margen superior y borde rojo en focus */}
      <input
        type="text"
        placeholder="Buscar autores..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)} // Actualiza el estado de filtro
        className="border border-gray-300 rounded p-2 mb-4 w-full mt-4 focus:outline-none focus:border-blue-950" // Agregamos margen superior y borde rojo en focus
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentAuthors.map((autor) => (
          <div
            key={autor._id} // Asegúrate de que el id del autor se llama _id
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between h-[300px]" // Distribuye el contenido de manera uniforme con altura fija
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
          >
            {/* Enlace solo en la imagen */}
            <Link to={`/fichaAutor/${autor._id}`} className="no-underline">
              <img
                src={autor.fotoAutor || "/avatar-placeholder.png"} // Asegúrate de que la URL de imagen está disponible
                alt={autor.nombre}
                className="w-32 h-32 object-cover rounded-full mb-2 mx-auto" // Imagen centrada horizontalmente
              />
            </Link>

            {/* El contenedor del nombre y seudónimo en el centro */}
            <div className="text-left w-full max-w-xs mx-auto">
              <Link to={`/fichaAutor/${autor._id}`} className="no-underline text-inherit w-full max-w-xs">
                <h2 className="text-lg break-all font-semibold w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                  Nombre: {autor.nombre}
                </h2>
                <h2 className="text-lg break-all font-semibold w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                  Seudonimo: {autor.seudonimo}
                </h2>
              </Link>
            </div>

            {/* Botón "Ver Ficha" en la parte inferior */}
            <Link to={`/fichaAutor/${autor._id}`} className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950 text-center">
              Ver Ficha
            </Link>
          </div>
        ))}
      </div>

      {/* Paginado */}
      <div className="flex justify-center mt-5 mb-5 gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950"
        >
          <BsArrowLeft />
        </button>
        <span className="text-lg mx-2">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950"
        >
          <BsArrowRight  />
        </button>
      </div>

    </div>
  );
};

export default Comunidad;
