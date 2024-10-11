import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LibroSugerido = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Estado para manejar errores

  const fetchLibros = async () => {
    try {
      const response = await fetch(`/api/libro/getlibrosact`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching libros');
      }

      const data = await response.json();
      setLibros(data.libros || []);
    } catch (error) {
      console.error('Error fetching libros:', error);
      setError('Error al cargar los libros'); // Manejar el error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibros();
  }, []);

  const handleSave = async (libro) => {
    try {
      const response = await fetch(`/api/guardarLibros/guardar-libro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(libro),
      });
  
      const responseText = await response.text(); // Obtén la respuesta como texto
      console.log('Respuesta del servidor:', responseText); // Muestra la respuesta en la consola
  
      if (!response.ok) {
        throw new Error('Error al guardar el libro');
      }
  
      const result = JSON.parse(responseText); // Analiza el JSON aquí
      console.log('Libro guardado con éxito:', result);
    } catch (error) {
      console.error('Error al guardar el libro:', error);
    }
  };
  

  if (loading) {
    return <div>Cargando...</div>; // Mensaje de carga mientras se obtiene
  }

  if (error) {
    return <div>{error}</div>; // Mostrar error si ocurre
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {libros.map((libro) => (
          <div
            key={libro.id} // Asegúrate de que 'id' sea único
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full"
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
          >
            <Link to="/fichaLibro" className="flex flex-col items-center">
              <img
                src={libro.imagen}
                alt={libro.titulo}
                className="w-35 h-60 object-cover rounded"
              />
              <h2 className="text-lg font-semibold mt-4 text-center">{libro.titulo}</h2>
            </Link>
            <button
              onClick={() => handleSave(libro._id)}
              className="mt-4 bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibroSugerido;
