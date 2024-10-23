import { useEffect, useState } from 'react'; // Importa useEffect y useState
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";

const AutorSugerido = () => {
  const [autores, setAutores] = useState([]); // Estado para manejar los autores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(''); // Estado para el filtrado
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

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
    <div className="p-6">
      {/* Campo de entrada para el filtrado */}
      <input
        type="text"
        placeholder="Buscar autores..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)} // Actualiza el estado de filtro
        className="border border-gray-300 rounded p-2 mb-4 w-full"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredAutores.map((autores) => (
          <div
            key={autores._id} // Asegúrate de que el id del autor se llama _id
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center h-full"
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
          >
            {/* Enlace solo en la imagen */}
            <Link to={`/fichaAutor/${autores._id}`} className="no-underline">
              <img
                src={autores.fotoAutor} // Asegúrate de que la URL de imagen está disponible
                alt={autores.nombre}
                className="w-32 h-32 object-cover rounded-full mb-2" // Imagen circular centrada
              />
            </Link>

            {/* Enlace solo en el nombre del autor */}
            <Link to={`/fichaAutor/${autores._id}`} className="no-underline text-inherit w-full max-w-xs">
              <h2 className="text-lg font-semibold text-center flex-grow truncate w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                {autores.nombre}
              </h2>
              <h2 className="text-lg font-semibold text-center flex-grow truncate w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                {autores.seudonimo}
              </h2>
            </Link>

            <button className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950 mt-2 mb-4">
              Agregar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutorSugerido;
