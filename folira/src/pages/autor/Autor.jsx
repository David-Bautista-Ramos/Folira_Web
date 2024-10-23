import { useEffect, useState } from 'react'; // Importa useEffect y useState
import { Link } from 'react-router-dom';

const Comunidad = ({ authUser }) => {
  const [autores, setAutores] = useState([]); // Estado para manejar los autores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(''); // Estado para el filtrado
  const [feedType, setFeedType] = useState("autores");

  const fetchAutores = async () => {
    try {
      const response = await fetch(`/api/autror/getAutoresAct`, { // Asegúrate de que esta URL es correcta
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching autores');
      }

      const data = await response.json();
      setAutores(data.autores || []); // Asegúrate de que la respuesta tiene el formato correcto
    } catch (error) {
      console.error('Error fetching autores:', error);
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

  return (
    <div className='flex-[4_4_0] border-r border-primary min-h-screen '>
      {/* Header */}
      <div className='flex w-full border-b border-blue-950'>
        <div
          className={
            "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
          }
          onClick={() => setFeedType("autores")}
        >
          Autores Sugeridos
          {feedType === "autores" && (
            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
          )}
        </div>
      </div>

      {/* Campo de entrada para el filtrado */}
      <input
        type="text"
        placeholder="Buscar autores..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)} // Actualiza el estado de filtro
        className="border border-gray-300 rounded p-2 mb-4 w-full"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredAutores.map((autor) => (
          <div
            key={autor._id} // Asegúrate de que el id del autor se llama _id
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center h-full"
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
          >
            {/* Enlace solo en la imagen */}
            <Link to={`/fichaAutor/${autor._id}`} className="no-underline">
              <img
                src={autor.fotoAutor} // Asegúrate de que la URL de imagen está disponible
                alt={autor.nombre}
                className="w-32 h-32 object-cover rounded-full mb-2" // Imagen circular centrada
              />
            </Link>

            {/* Enlace solo en el nombre del autor */}
            <Link to={`/fichaAutor/${autor._id}`} className="no-underline text-inherit w-full max-w-xs">
              <h2 className="text-lg break-all font-semibold text-center flex-grow truncate w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                Nombre: {autor.nombre}
              </h2>
			  <h2 className="text-lg break-all font-semibold text-center flex-grow truncate w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                Seudonimo: {autor.seudonimo}
              </h2>
            </Link>

            {/* Botón "Agregar" que también actúa como enlace */}
            <Link to={`/fichaAutor/${autor._id}`} className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950 mt-2 mb-4 text-center">
              Ver Ficha
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comunidad;
