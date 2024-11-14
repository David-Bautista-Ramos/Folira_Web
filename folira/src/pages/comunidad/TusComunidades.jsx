import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ModalCrearNuevaComunidad from './ModalCrearNuevaComunidad';
// import { FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

// Componente para cada tarjeta de comunidad
const ComunidadCard = ({ comunidad, salirComunidad }) => {
  const isAdmin = comunidad.admin; // Asegúrate de que esta propiedad exista

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center h-full" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}>
      <Link to={`/DetalleComunidad/${comunidad._id}`} className="no-underline">
        <img
          src={comunidad.fotoComunidad || "/avatar-placeholder.png"}
          alt={comunidad.nombre}
          className="w-32 h-32 object-cover rounded-full mb-2"
        />
      </Link>
      <Link to={`/DetalleComunidad/${comunidad._id}`} className="no-underline text-inherit w-full max-w-xs">
        <h2 className="text-lg font-semibold text-center flex-grow truncate w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
          {comunidad.nombre}
        </h2>
      </Link>

      {isAdmin ? (
        <Link to={`/DetalleComunidad/${comunidad._id}`} className="bg-primary text-white py-2 px-4 rounded-full hover:bg-blue-950 mt-2 mb-2">
          Ver comunidad
        </Link>
      ) : (
        <button
          className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-700 mt-2 mb-2"
          onClick={() => salirComunidad(comunidad._id)}
        >
          Salir
        </button>
      )}
    </div>
  );
};

const TusComunidades = () => {
  const [comunidadesMias, setComunidadesMias] = useState([]); // Comunidades del usuario
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false); // Estado para el modal
  const [page, setPage] = useState(1); // Página actual
  const pageSize = 9; // Número de comunidades por página
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  // Obtener las comunidades donde el usuario es miembro
  const fetchComunidadesMias = useCallback(async () => {
    if (!authUser) return;
    const userId = authUser._id;

    setLoading(true);
    try {
      const response = await fetch(`/api/comunidad/comuniMiem/${userId}`);
      if (!response.ok) throw new Error('Error al obtener tus comunidades');
      const data = await response.json();
      setComunidadesMias(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    fetchComunidadesMias();
  }, [fetchComunidadesMias]);

  const salirComunidad = async (comunidadId) => {
    const userId = authUser._id;

    try {
      const response = await fetch('/api/comunidad/salircomunidad', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, comunidadId }),
      });

      if (!response.ok) throw new Error('Error al salir de la comunidad');
      const data = await response.json();
      toast.success(data.message);
      fetchComunidadesMias();
    } catch (error) {
      console.error('Error:', error);
      toast.error('No se pudo salir de la comunidad');
    }
  };

  const comunidadesFiltradas = comunidadesMias.filter((comunidad) =>
    comunidad.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPages = Math.ceil(comunidadesFiltradas.length / pageSize);

  // Calcular el rango de comunidades que deben mostrarse en la página actual
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;
  const comunidadesPaginadas = comunidadesFiltradas.reverse().slice(startIndex, endIndex);

  // Función para manejar la paginación
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="p-6">
      <div className="flex mb-4 items-center">
        {/* <button
          onClick={() => setIsActualizarModalOpen(true)} // Abre el modal
          className="mr-3 p-2 bg-primary text-white rounded-full hover:bg-blue-950 w-8 h-8 flex items-center justify-center"
        >
          <FaPlus />
        </button> */}

        <input
          type="text"
          placeholder="Buscar comunidad..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border border-gray-300 rounded p-2 mb-4 w-[565px] mt-4 focus:outline-none focus:border-blue-950"
        />
      </div>

      {loading ? (
        <p>Cargando comunidades...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {comunidadesPaginadas.length === 0 ? (
              <p>No hay comunidades para mostrar.</p>
            ) : (
              comunidadesPaginadas.map((comunidad) => (
                <ComunidadCard
                  key={comunidad._id}
                  comunidad={comunidad}
                  salirComunidad={salirComunidad}
                />
              ))
            )}
          </div>

          {/* Paginación */}
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950"
            >
              <BsArrowLeft />
            </button>
            <span className="flex items-center">
              Página {page} de {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950"
            >
              <BsArrowRight />
            </button>
          </div>
        </>
      )}

      {/* Modal para crear comunidad */}
      <ModalCrearNuevaComunidad
        isOpen={isActualizarModalOpen}
        onClose={() => setIsActualizarModalOpen(false)}
        token={authUser.token}
        userId={authUser._id}
        obtenerComunidades={fetchComunidadesMias} // Llama a esta función para actualizar la lista
      />
    </div>
  );
};

export default TusComunidades;
