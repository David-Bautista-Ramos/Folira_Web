import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Importa useParams
import { BsStarFill, BsStar, BsEye, BsEyeSlash } from 'react-icons/bs';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { FaTrash } from 'react-icons/fa';

const FichaTecnicaLibro = () => {
  const { id: libroId } = useParams(); // Obtiene el id desde la URL
  const [libro, setLibro] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [resenas, setResenas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingReseñas, setLoadingReseñas] = useState(false);
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const [selectedStarFilter, setSelectedStarFilter] = useState(0); // Estado para el filtro de estrellas

  useEffect(() => {
    // Función para obtener los detalles del libro por id
    const fetchLibro = async () => {
      try {
        const response = await fetch(`/api/libro/getlibros/${libroId}`); // Cambia la ruta según tu API
        if (!response.ok) {
          throw new Error('Error al obtener el libro');
        }
        const data = await response.json();
        setLibro(data);
        setCalificacion(data.calificacion || 0); // Ajusta esto según tu API
      } catch (error) {
        console.error('Error al obtener el libro:', error);
      }
    };

    fetchLibro();
  }, [libroId]);

  if (!libro) {
    return <div>Cargando libro...</div>; // Manejo de carga
  }

  const {
    titulo,
    autor,
    generos,
    sinopsis,
    serie,
    isbn,
    portada,
  } = libro;

  const renderSinopsis = () => {
    const sinopsisCorta = sinopsis.slice(0, 100);
    const esLarga = sinopsis.length > 100;

    return (
      <div>
        <p className="text-md">
          Sinopsis: {isExpanded ? sinopsis : `${sinopsisCorta}...`}
          {esLarga && (
            <span
              className="inline ml-2 cursor-pointer text-blue-500"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <><BsEyeSlash className="inline" /> Leer menos</> : <><BsEye className="inline" /> Leer más</>}
            </span>
          )}
        </p>
      </div>
    );
  };

  const renderEstrellas = (calificacion) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i + 1} onClick={() => setCalificacion(i + 1)} className="cursor-pointer">
        {i < calificacion ? <BsStarFill className="text-yellow-500" /> : <BsStar className="text-gray-300" />}
      </div>
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comentario.trim() === '') return;

    const nuevaReseña = {
      contenido: comentario,
      calificacion,
      idUsuario: authUser._id,
      idLibro: libro._id,
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

  const fetchReseñas = async () => {
    setLoadingReseñas(true);
    try {
      const response = await fetch(`/api/resenas/librosRes/${libroId}`);
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

   // Función para eliminar una reseña
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

  const renderEstrellasCom = (calificacion) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div key={i + 1} className="cursor-pointer">
        {i < calificacion ? <BsStarFill className="text-yellow-500" /> : <BsStar className="text-gray-300" />}
      </div>
    ));
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
          src={portada} 
          alt={titulo} 
          className="w-1/3 h-[250px] rounded-lg object-cover"
          style={{ flexShrink: 0 }}
        />
        <div className="ml-6 flex flex-col flex-grow">
          <h2 className="text-2xl font-semibold">{titulo}</h2>
          <p className="text-lg font-medium">Autor: {autor}</p>
          <p className="text-md">Géneros: {generos && generos.length > 0 ? generos.map(genero => (
              <span key={genero.id} className="mr-2">{genero.nombre}</span>
            )) : 'No disponible'}</p>
          <p className="text-md">Serie: {serie || 'N/A'}</p>
          <p className="text-md">ISBN: {isbn}</p>
          {renderSinopsis()}
          <div className="flex items-center mt-2">
            <span className="text-lg font-medium">Calificación:</span>
            <div className="flex ml-2">{renderEstrellas(calificacion)}</div>
          </div>
        </div>
      </div>

      <button
        className="mt-4 bg-primary hover:bg-blue-950 text-white font-bold py-2 w-[180px] px-4 rounded"
        onClick={openModal}
      >
        Ver reseñas
      </button>

      <form onSubmit={handleSubmit} className="mt-4 w-full">
        <label className="block text-md font-medium mb-2">Escribe una reseña:</label>
        <div className="flex w-full">
          <input
            type="text"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full p-2 border rounded focus:border-primary focus:outline-none"
            placeholder="Escribe tu reseña..."
            aria-label="Escribe tu reseña"
          />
          <button
            type="submit"
            className="ml-2 bg-primary hover:bg-blue-950 text-white p-2 rounded-lg"
          >
            Enviar
          </button>
        </div>
      </form>

      <div className="mt-6">
        {resenas.map((reseña) => (
          <div key={reseña._id} className="flex items-start mb-4 p-4 border border-gray-200 rounded-lg bg-gray-100">
            <img 
              src={reseña.idUsuario.fotoPerfil} 
              alt={`${reseña.idUsuario.nombre} perfil`} 
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="font-semibold">{reseña.idUsuario.nombre}</h3>
              <p className="text-md">{reseña.contenido}</p>
            </div>
          </div>
        ))} 
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
            <h2 className="text-xl font-semibold mb-4">Reseñas</h2>
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
            <div>
              {loadingReseñas ? (
                <p>Cargando reseñas...</p>
              ) : (
                filteredReseñas.map((reseña) => (
                  <div key={reseña._id} className="flex items-start mb-4 p-4 border border-gray-200 rounded-lg bg-gray-100">
                    <img 
                      src={reseña.idUsuario.fotoPerfil} 
                      alt={`${reseña.idUsuario.nombre} perfil`} 
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{reseña.idUsuario.nombre}</h3>
                      <p className="text-md break-all">{reseña.contenido}</p>
                      <div className="flex mt-1">
                        {renderEstrellasCom(reseña.calificacion)} {/* Aquí renderizas las estrellas con la calificación de la reseña */}
                      </div>
                    </div>
                    {reseña.idUsuario._id === authUser._id && (
                      <button 
                        onClick={() => handleDeleteReseña(reseña._id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))
              )}
                <button className="mb-4 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded" onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Agrega PropTypes si es necesario
FichaTecnicaLibro.propTypes = {
  id: PropTypes.string,
};

export default FichaTecnicaLibro;
