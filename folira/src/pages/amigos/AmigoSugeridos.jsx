import { useEffect, useState } from 'react'; 
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const AmigoSugeridos = () => {
    const [amigos, setAmigos] = useState([]); // Estado para manejar los amigos
    const [loading, setLoading] = useState(true); // Estado para el loading
    const [filter, setFilter] = useState(''); // Estado para el filtrado
    const [error, setError] = useState(null); // Estado para el manejo de errores
    const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
    const amigosPorPagina = 6; // Número de amigos por página

    useEffect(() => {
        const fetchAmigos = async () => {
            try {
                const response = await fetch('/api/users/useractamg'); 
                if (!response.ok) {
                    throw new Error('Hubo un error al obtener los amigos');
                }
                const data = await response.json();
                setAmigos(data);
                setLoading(false); 
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchAmigos();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Filtrar usuarios según el input
    const filteredAmigos = Array.isArray(amigos)
        ? amigos.filter((amigo) =>
            amigo.nombre.toLowerCase().includes(filter.toLowerCase())
          )
        : [];

    // Calcular la paginación
    const totalPaginas = Math.ceil(filteredAmigos.length / amigosPorPagina);
    const inicioIndice = (currentPage - 1) * amigosPorPagina;
    const amigosPaginados = filteredAmigos.reverse().slice(inicioIndice, inicioIndice + amigosPorPagina);

    // Cambiar de página
    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
            setCurrentPage(nuevaPagina);
        }
    };

    return (
        <div className='flex-[4_4_0] border-primary min-h-screen px-6'>
            <input
                type="text"
                placeholder="Buscar usuarios..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded p-2 mb-4 w-full mt-4 focus:outline-none focus:border-blue-950"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {amigosPaginados.map((amigo) => (
                    <div
                        key={amigo._id}
                        className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between h-[300px]"
                        style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
                    >
                        <Link to={`/profile/${amigo?.nombre}`} className="no-underline">
                            
                            <img
                                src={amigo.fotoPerfil || "/avatar-placeholder.png"}
                                alt={`Perfil de ${amigo.nombre}`}
                                className="w-32 h-32 object-cover rounded-full mb-2 mx-auto"
                            />
                        </Link>
                        <div className="text-left w-full max-w-xs mx-auto">
                            <Link to={`/profile/${amigo.nombre}`} className="no-underline text-inherit w-full max-w-xs">
                                <h2 className="text-lg break-all font-semibold w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                    {amigo.nombre}
                                </h2>
                            </Link>
                        </div>
                        <Link to={`/profile/${amigo.nombre}`} className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950 text-center">
                            Ver Perfil
                        </Link>
                    </div>
                ))}
            </div>

            {/* Controles de paginación */}
            <div className="flex justify-center mt-5 mb-5 gap-4">
                <button
                    onClick={() => cambiarPagina(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950"
                    >
                    <BsArrowLeft />
                </button>
                <span>Página {currentPage} de {totalPaginas}</span>
                <button
                    onClick={() => cambiarPagina(currentPage + 1)}
                    disabled={currentPage === totalPaginas}
                    className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950"
                    >
                    <BsArrowRight  />
                </button>
            </div>
        </div>
    );
};

export default AmigoSugeridos;
