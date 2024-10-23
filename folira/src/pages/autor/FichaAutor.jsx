import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import { useQuery } from '@tanstack/react-query';
import { BsStar, BsStarFill } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa';

const FichaTecnicaAutor = () => {
  const { id: autorId } = useParams(); // Obtiene el id desde la URL
  const [autor, setAutor] = useState(null);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [resenas, setResenas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingReseñas, setLoadingReseñas] = useState(false);
  const [selectedStarFilter, setSelectedStarFilter] = useState(0); // Estado para el filtro de estrellas
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  // Formateador de fecha
const formatearFecha = (fechaISO) => {
  const formateador = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return formateador.format(new Date(fechaISO));
};

  useEffect(() => {
    const fetchAutor = async () => {
      try {
        const response = await fetch(`/api/autror/autores/${autorId}`); // Cambia la ruta según tu API
        if (!response.ok) {
          throw new Error('Error al obtener el autor');
        }
        const data = await response.json();
        setAutor(data);
        setCalificacion(data.calificacion || 0);
      } catch (error) {
        console.error('Error al obtener el autor:', error);
      }
    };

    fetchAutor();
  }, [autorId]);

  if (!autor) {
    return <div>Cargando autor...</div>; // Manejo de carga
  }

  const {
    nombre,
    seudonimo,
    pais,
    fechaNacimiento,
    biografia,
    distinciones,
    fotoAutor,
  } = autor;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comentario.trim() === '') return;

    const nuevaReseña = {
      contenido: comentario,
      calificacion,
      idUsuario: authUser._id,
      idAutor: autor._id,
    };

    try {
      const response = await fetch('/api/resenas/resenas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaReseña),
      });

      if (!response.ok) throw new Error('Error al crear la reseña');

      const data = await response.json();
      setResenas((prevReseñas) => [...prevReseñas, data.resena]);
      setComentario('');
    } catch (error) {
      console.error('Error al crear la reseña:', error);
    }
  };

  const handleDeleteReseña = async (id) => {
    try {
      const response = await fetch(`/api/resenas/deleteresenas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar la reseña');

      const data = await response.json();
      setResenas((prevReseñas) => prevReseñas.filter((reseña) => reseña._id !== id));
      console.log(data.message);
    } catch (error) {
      console.error('Error al eliminar la reseña:', error);
    }
  };

  const fetchReseñas = async () => {
    setLoadingReseñas(true);
    try {
      const response = await fetch(`/api/resenas/autorRes/${autorId}`);
      if (!response.ok) {
        throw new Error('Error al obtener las reseñas');
      }
      const data = await response.json();
      setResenas(data);
    } catch (error) {
      console.error('Error al obtener las reseñas:', error);
    } finally {
      setLoadingReseñas(false);
    }
  };

  const renderEstrellas = (calificacion) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i + 1} onClick={() => setCalificacion(i + 1)} className="cursor-pointer">
        {i < calificacion ? <BsStarFill className="text-yellow-500" /> : <BsStar className="text-gray-300" />}
      </div>
    ));
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStarFilter(0); // Reinicia el filtro de estrellas al cerrar el modal
  };

  const openModal = async () => {
    setIsModalOpen(true);
    await fetchReseñas();
  };

  const filteredReseñas = selectedStarFilter 
    ? resenas.filter((reseña) => reseña.calificacion === selectedStarFilter) 
    : resenas;

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg relative">
      <div className="flex">
        <img 
          src={fotoAutor} 
          alt={nombre} 
          className="w-48 h-48 rounded-full object-cover"
          style={{ flexShrink: 0 }} // Para evitar que la imagen se ajuste
        />
        <div className="ml-6 flex flex-col flex-grow">
          <h2 className="text-2xl font-semibold">{nombre}</h2>
          <p className="text-lg"><strong>Seudonimo:</strong> {seudonimo}</p>
          <p className="text-lg"><strong>País:</strong> {pais}</p>
          <p className="text-lg">
            <strong>Fecha de Nacimiento:</strong> {fechaNacimiento ? formatearFecha(fechaNacimiento) : 'N/A'}
          </p>
          <p className="text-lg"><strong>Biografia:</strong> {biografia}</p>
          <p className="text-lg"><strong>Distinciones:</strong> {distinciones.join(', ') || 'N/A'}</p>
        </div>
      </div>

      {/* Botón para ver reseñas */}
      <button 
        onClick={openModal} 
        className="mt-4 ml-2 bg-primary hover:bg-blue-950 text-white font-bold py-2 w-[180px] px-4 rounded"
      >
        Ver Reseñas
      </button>

      {/* Campo de texto para escribir comentario */}
      <form onSubmit={handleSubmit} className="mt-4">
        <label className="block text-md font-medium">Escribe una reseña:</label>
        <div className="flex items-center mt-2">
          {renderEstrellas(calificacion)}
        </div>
        <input
          type="text"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          className="w-full mt-2 p-2 border rounded"
          placeholder="Escribe tu reseña..."
        />
        <button type="submit" className="mt-2 bg-primary text-white px-4 py-2 rounded">
          Enviar
        </button>
      </form>
      {/* Renderizar solo las primeras 4 reseñas */}
      <div className="mt-6">
        {resenas.slice(0, 4).map((reseña, index) => (
          <div key={index} className="flex items-start mb-4 p-4 border border-gray-200 rounded-lg bg-gray-100">
            <img 
              src={reseña.idUsuario.fotoPerfil || 'https://via.placeholder.com/48'} 
              alt={`${reseña.idUsuario} perfil`} 
              className="w-12 h-12 rounded-full mr-4"
              style={{ width: '48px', height: '48px' }} // Ajustar tamaño a 48x48
            />
            <div>
              <h3 className="font-semibold">{reseña.idUsuario.nombre}</h3>
              <p className="text-md">{reseña.contenido}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para mostrar las reseñas */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Reseñas</h3>

            {/* Filtro de estrellas */}
            <div className="mb-4">
              <h4 className="text-md font-medium">Filtrar por calificación:</h4>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div 
                    key={star} 
                    onClick={() => setSelectedStarFilter(star)} 
                    className={`cursor-pointer ${selectedStarFilter === star ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    {star <= selectedStarFilter ? <BsStarFill /> : <BsStar />}
                  </div>
                ))}
                <div 
                  onClick={() => setSelectedStarFilter(0)} 
                  className={`ml-2 cursor-pointer ${selectedStarFilter === 0 ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  <span>Todo</span>
                </div>
              </div>
            </div>

            {/* Renderizar reseñas filtradas */}
            <div>
              {loadingReseñas ? (
                <p>Cargando reseñas...</p>
              ) : (
                filteredReseñas.length > 0 ? (
                  filteredReseñas.map((reseña) => (
                    <div key={reseña._id} className="flex items-start mb-4">
                      <img 
                        src={reseña.idUsuario.fotoPerfil || 'https://via.placeholder.com/48'} 
                        alt={`${reseña.idUsuario} perfil`} 
                        className="w-12 h-12 rounded-full mr-4"
                        style={{ width: '48px', height: '48px' }} // Ajustar tamaño a 48x48
                      />
                      <div>
                        <h4 className="font-semibold">{reseña.idUsuario.nombre}</h4>
                        <p>{reseña.contenido}</p>
                        <div className="flex mt-1">
                          {renderEstrellas(reseña.calificacion)}
                        </div>
                        <button 
                          onClick={() => handleDeleteReseña(reseña._id)} 
                          className="text-red-500 mt-2"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hay reseñas para mostrar.</p>
                )
              )}
              <button onClick={closeModal} className="mb-4 text-red-500">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FichaTecnicaAutor;
