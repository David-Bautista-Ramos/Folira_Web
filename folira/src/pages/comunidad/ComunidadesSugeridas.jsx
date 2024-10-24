import { useQuery } from '@tanstack/react-query';
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ModalCrearNuevaComunidad from './ModalCrearNuevaComunidad.jsx'; // Importa el modal
import toast from 'react-hot-toast';
import { FaPlus } from 'react-icons/fa';

// Componente para cada tarjeta de comunidad
const ComunidadCard = ({ comunidad, unirseComunidad }) => (
  <div
    className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center h-full"
    style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
  >
    <Link to={`/DetalleComunidad/${comunidad._id}`} className="no-underline">
      <img
        src={comunidad.fotoComunidad || 'https://via.placeholder.com/125'}
        alt={comunidad.nombre}
        className="w-32 h-32 object-cover rounded-full mb-2"
      />
    </Link>

    <Link to={`/DetalleComunidad/${comunidad._id}`} className="no-underline text-inherit w-full max-w-xs">
      <h2 className="text-lg font-semibold text-center flex-grow truncate w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
        {comunidad.nombre}
      </h2>
    </Link>

    <button
      className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950 mt-2 mb-2"
      onClick={() => unirseComunidad(comunidad._id)}
    >
      Unirme
    </button>
  </div>
);

const ComunidadesSugeridas = () => {
  const [comunidades, setComunidades] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false); // Estado para el modal de crear comunidad

  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  // Obtener comunidades desde el backend (memoizada para evitar recreaciones innecesarias)
  const fetchComunidades = useCallback(async () => {
    if (!authUser) return;
    const userId = authUser._id;

    setLoading(true);
    try {
      const response = await fetch(`/api/comunidad/comnoMiem/${userId}`);
      if (!response.ok) throw new Error('Error al obtener las comunidades');
      const data = await response.json();
      setComunidades(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    fetchComunidades();
  }, [fetchComunidades]);

  const unirseComunidad = async (comunidadId) => {
    const userId = authUser._id;

    try {
      const response = await fetch('/api/comunidad/unircomunidad', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, comunidadId }),
      });

      if (!response.ok) throw new Error('Error al unirse a la comunidad');
      const data = await response.json();
      toast.success(data.message);
      fetchComunidades();
    } catch (error) {
      console.error('Error:', error);
      toast.error('No se pudo unir a la comunidad');
    }
  };

  // Filtrar comunidades que no son de este usuario
  const comunidadesFiltradas = comunidades.filter(comunidad =>
    !comunidad.miembros.includes(authUser._id) && comunidad.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6">

      <button
        onClick={() => setIsCrearModalOpen(true)} // Abre el modal para crear comunidad
        className="mr-3 p-2 bg-primary text-white rounded-full hover:bg-blue-950 "
      >
        <FaPlus />
      </button>

      <input
        type="text"
        placeholder="Buscar comunidad..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="border border-gray-300 rounded p-2 mb-4 w-[565px] mt-4 focus:outline-none focus:border-blue-950" // Agregamos margen superior y borde rojo en focus
      />
      
      {loading ? (
        <p>Cargando comunidades...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {comunidadesFiltradas.length === 0 ? (
            <p>No hay comunidades sugeridas.</p>
          ) : (
            comunidadesFiltradas.map((comunidad) => (
              <ComunidadCard
                key={comunidad._id}
                comunidad={comunidad}
                unirseComunidad={unirseComunidad}
              />
            ))
          )}
        </div>
      )}

      {/* Modal para crear comunidad */}
      <ModalCrearNuevaComunidad
        isOpen={isCrearModalOpen}
        onClose={() => setIsCrearModalOpen(false)}
        token={authUser.token}
        userId={authUser._id}
        obtenerComunidades={fetchComunidades} // Llama a esta función para actualizar la lista
      />
    </div>
  );
};

export default ComunidadesSugeridas;
