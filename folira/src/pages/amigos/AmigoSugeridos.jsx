import { useEffect, useState } from 'react'; // Importa useEffect y useState
import { Link } from 'react-router-dom';

const AmigoSugeridos = () => {
  const [amigos, setAmigos] = useState([]); // Estado para manejar los amigos
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // Estado para el filtrado

  useEffect(() => {
    // Simula una carga de datos quemados
    const datosQuemados = [
      {
        _id: '1',
        nombre: 'Juan Pérez',
        fotoPerfil: 'https://via.placeholder.com/150',
      },
      {
        _id: '2',
        nombre: 'María López',
        fotoPerfil: 'https://via.placeholder.com/150',
      },
      {
        _id: '3',
        nombre: 'Carlos García',
        fotoPerfil: 'https://via.placeholder.com/150',
      },
      {
        _id: '4',
        nombre: 'Ana Torres',
        fotoPerfil: 'https://via.placeholder.com/150',
      },
    ];

    // Simula un retardo para imitar la carga de datos
    setTimeout(() => {
      setAmigos(datosQuemados);
      setLoading(false);
    }, 1000); // 1 segundo de retardo
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Filtrar usuarios según el input
  const filteredAmigos = amigos.filter((amigo) =>
    amigo.nombre.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className='flex-[4_4_0] border-primary min-h-screen px-6'>
      {/* Campo de entrada para el filtrado */}
      <input
        type="text"
        placeholder="Buscar usuarios..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)} // Actualiza el estado de filtro
        className="border border-gray-300 rounded p-2 mb-4 w-full mt-4 focus:outline-none focus:border-blue-950"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredAmigos.map((amigo) => (
          <div
            key={amigo._id}
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between h-[300px]"
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
          >
            {/* Enlace en la imagen para redireccionar al perfil */}
            <Link to={`/perfilAmigo/${amigo._id}`} className="no-underline">
              <img
                src={amigo.fotoPerfil}
                alt={`Perfil de ${amigo.nombre}`}
                className="w-32 h-32 object-cover rounded-full mb-2 mx-auto"
              />
            </Link>

            {/* Mostrar solo el nombre */}
            <div className="text-left w-full max-w-xs mx-auto">
              <Link to={`/perfilAmigo/${amigo._id}`} className="no-underline text-inherit w-full max-w-xs">
                <h2 className="text-lg break-all font-semibold w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                  {amigo.nombre}
                </h2>
              </Link>
            </div>

            {/* Botón "Ver Perfil" en la parte inferior */}
            <Link to={`/perfilAmigo/${amigo._id}`} className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950 text-center">
              Ver Perfil
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AmigoSugeridos;
