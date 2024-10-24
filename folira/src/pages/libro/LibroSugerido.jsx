import { useEffect, useState, useCallback } from 'react'; // Importa useCallback
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";

const LibroSugerido = () => {
    const [libros, setLibros] = useState([]);
    const [librosGuardados, setLibrosGuardados] = useState(new Set()); // Usamos un Set para un acceso rápido
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState(""); // Estado para manejar el filtro
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

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
            setError('Error al cargar los libros');
        } finally {
            setLoading(false);
        }
    };

    const fetchLibrosGuardados = useCallback(async () => {
        if (!authUser || !authUser._id) return;
        try {
            const response = await fetch(`/api/guardarLibros/libros-guardados/${authUser._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching libros guardados');
            }

            const data = await response.json();
            setLibrosGuardados(new Set(data.librosGuardados.map(libro => libro._id)));
        } catch (error) {
            console.error('Error fetching libros guardados:', error);
        }
    }, [authUser]);

    useEffect(() => {
        fetchLibros();
        fetchLibrosGuardados();
    }, [authUser, fetchLibrosGuardados]);

    const handleSave = async (libroId) => {
        try {
            const userId = authUser._id;

            const response = await fetch(`/api/guardarLibros/guardar-libro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, libroId }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar el libro');
            }

            const result = await response.json();
            console.log('Libro guardado con éxito:', result);
            setLibrosGuardados(prev => new Set(prev).add(libroId)); // Agregar el libro a los guardados
        } catch (error) {
            console.error('Error al guardar el libro:', error);
        }
    };

    const handleRemove = async (libroId) => {
        try {
            const userId = authUser._id;

            const response = await fetch(`/api/guardarLibros/eliminar-libro`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, libroId }),
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el libro guardado');
            }

            const result = await response.json();
            console.log('Libro eliminado con éxito:', result);
            setLibrosGuardados(prev => {
                const updated = new Set(prev);
                updated.delete(libroId); // Eliminar el libro de los guardados
                return updated;
            });
        } catch (error) {
            console.error('Error al eliminar el libro guardado:', error);
        }
    };

    // Filtrar libros según el texto ingresado en el buscador
    const librosFiltrados = libros.filter((libro) =>
        libro.titulo.toLowerCase().includes(filtro.toLowerCase())
    );

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    
    return (
<div className="p-6">
  {/* Buscador */}
  <input
    type="text"
    placeholder="Buscar libro por título..."
    value={filtro}
    onChange={(e) => setFiltro(e.target.value)}
    className="w-full p-2 mb-4 border rounded focus:outline-none focus:border-primary"
  />

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {librosFiltrados.map((libro) => (
      <div
        key={libro._id}
        className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full justify-between"
      >
        <Link
          to={`/fichaLibro/${libro._id}`}
          className="flex flex-col items-center"
        >
          <img
            src={libro.portada}
            alt={libro.titulo}
            className="w-35 h-60 object-cover rounded"
          />
          <h2
            className="text-lg font-semibold mt-4 text-center mb-3"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2, // Limitar a 2 líneas
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {libro.titulo}
          </h2>
        </Link>

        {/* Botón siempre abajo */}
        <button
          onClick={() => {
            if (librosGuardados.has(libro._id)) {
              handleRemove(libro._id); // Eliminar si ya está guardado
            } else {
              handleSave(libro._id); // Guardar si no está guardado
            }
          }}
          className={`mt-auto w-full rounded px-4 py-2 ${
            librosGuardados.has(libro._id) ? 'bg-slate-600' : 'bg-gray-800'
          } text-white hover:${
            librosGuardados.has(libro._id) ? 'bg-slate-700' : 'bg-gray-900'
          } transition`}
        >
          {librosGuardados.has(libro._id) ? 'Eliminar' : 'Guardar'}
        </button>
      </div>
    ))}
  </div>
</div>

      
    );
};

export default LibroSugerido;
