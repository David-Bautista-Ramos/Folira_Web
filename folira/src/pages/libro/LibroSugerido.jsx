import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from "@tanstack/react-query";
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';


const LibroSugerido = () => {
    const [libros, setLibros] = useState([]);
    const [librosGuardados, setLibrosGuardados] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState(""); 
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [booksPerPage] = useState(6); // Libros por página
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
            setLibrosGuardados(prev => new Set(prev).add(libroId));
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
                updated.delete(libroId);
                return updated;
            });
        } catch (error) {
            console.error('Error al eliminar el libro guardado:', error);
        }
    };

    // Filtrar libros
    const librosFiltrados = libros.filter((libro) =>
        libro.titulo.toLowerCase().includes(filtro.toLowerCase())
    );

    // Calcular número total de páginas
    const totalPages = Math.ceil(librosFiltrados.length / booksPerPage);

    // Obtener los libros de la página actual
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = librosFiltrados.reverse().slice(indexOfFirstBook, indexOfLastBook);

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

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
                {currentBooks.map((libro) => (
                    <div
                        key={libro._id}
                        className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full justify-between"
                    >
                        <Link
                            to={`/fichaLibro/${libro._id}`}
                            className="flex flex-col items-center"
                        >
                            <img
                                src={libro.portada && libro.portada !== "" ? libro.portada :"/book-placeholder.png"}
                                alt={libro.titulo}
                                className="w-35 h-60 object-cover rounded"
                            />
                            <h2
                                className="text-lg font-semibold mt-4 text-center mb-3"
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
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
                                    handleRemove(libro._id); 
                                } else {
                                    handleSave(libro._id); 
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

            {/* Paginación */}
            <div className="flex justify-center mt-4 gap-4">
              <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950"
                    disabled={currentPage === 1}
                >
                  <BsArrowLeft />
                </button>
                <span className="flex items-center">
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950"
                    disabled={currentPage === totalPages}
                >
                  <BsArrowRight
                    />
                </button>
            </div>
        </div>
    );
};

export default LibroSugerido;
