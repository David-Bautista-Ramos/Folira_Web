import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const AmigosSugeridos = ({ authUser }) => {
  const [amigos, setAmigos] = useState([]); // Estado para manejar los amigos sugeridos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(''); // Estado para el filtrado

  const fetchAmigos = async () => {
    try {
      const response = await fetch(`/api/amigos/getAmigosSugeridos`, { // Asegúrate de que esta URL es correcta
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching amigos sugeridos');
      }

      const data = await response.json();
      setAmigos(data.amigos || []); // Asegúrate de que la respuesta tiene el formato correcto
    } catch (error) {
      console.error('Error fetching amigos sugeridos:', error);
      setError('Error al cargar los amigos sugeridos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmigos();
  }, [authUser]); // No es necesario pasar authUser en el array de dependencias si no afecta a la carga

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Filtrar amigos según el input
  const filteredAmigos = amigos.filter(amigo =>
    amigo.nombre.toLowerCase().includes(filter.toLowerCase()) || 
    amigo.usuario.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className='flex-[4_4_0] border-primary min-h-screen px-6'>
      {/* Campo de entrada para el filtrado con margen superior y borde rojo en focus */}
      <input
        type="text"
        placeholder="Buscar amigos..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)} // Actualiza el estado de filtro
        className="border border-gray-300 rounded p-2 mb-4 w-full mt-4 focus:outline-none focus:border-blue-950" // Agregamos margen superior y borde rojo en focus
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredAmigos.map((amigo) => (
          <div
            key={amigo._id} // Asegúrate de que el id del amigo se llama _id
            className="bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between h-[300px]" // Distribuye el contenido de manera uniforme con altura fija
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
          >
            {/* Enlace solo en la imagen */}
            <Link to={`/perfilAmigo/${amigo._id}`} className="no-underline">
              <img
                src={amigo.fotoAmigo} // Asegúrate de que la URL de imagen está disponible
                alt={amigo.nombre}
                className="w-32 h-32 object-cover rounded-full mb-2 mx-auto" // Imagen centrada horizontalmente
              />
            </Link>

            {/* El contenedor del nombre y usuario en el centro */}
            <div className="text-left w-full max-w-xs mx-auto">
              <Link to={`/perfilAmigo/${amigo._id}`} className="no-underline text-inherit w-full max-w-xs">
                <h2 className="text-lg break-all font-semibold w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                  Nombre: {amigo.nombre}
                </h2>
                <h2 className="text-lg break-all font-semibold w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                  Usuario: {amigo.usuario}
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

export default AmigosSugeridos;
