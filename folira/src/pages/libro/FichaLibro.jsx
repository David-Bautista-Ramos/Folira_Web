import { useEffect, useState } from 'react';
import { Link, useParams,  Navigate } from 'react-router-dom'; // Importa useParams
import { BsStarFill, BsStar, BsEye, BsEyeSlash, BsArrowLeft } from 'react-icons/bs';
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
  const [isRedirecting, setIsRedirecting] = useState(false); // Estado para redirigir después de inactivar


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

    // Función para obtener las reseñas del libro
  const fetchReseñas = async () => {
    try {
      const response = await fetch(`/api/resenas/librosRes/${libroId}`); // Cambia la ruta según tu API
      if (!response.ok) {
        throw new Error('Error al obtener las reseñas');
      }
      const data = await response.json();
      setResenas(data); // Ajusta esto según tu estado para reseñas
    } catch (error) {
      console.error('Error al obtener las reseñas:', error);
    }
  };

    fetchLibro();
    fetchReseñas();
  }, [libroId]);

  if (!libro) {
    return <div>Cargando libro...</div>; // Manejo de carga
  }

  const {
    titulo,
    autores,
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
          <strong>Sinopsis:</strong> {isExpanded ? sinopsis : `${sinopsisCorta}...`}
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
  
    // Verifica si el comentario no está vacío
    if (comentario.trim() === '') return;
    // Verifica que authUser y su ID estén disponibles
    if (!authUser || !authUser._id) {
      console.error('El usuario no está autenticado');
      return;
    }
  
    // Crea un nuevo objeto reseña
    const nuevaReseña = {
      contenido: comentario,
      calificacion,
      idUsuario: authUser._id,
      idLibro: libro._id,
    };
  
    try {
      // Realiza la solicitud POST para crear una nueva reseña
      const response = await fetch('/api/resenas/resenas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaReseña),
      });
  
      // Verifica si la respuesta es exitosa
      if (!response.ok) throw new Error('Error al crear la reseña');
      // Convierte la respuesta a JSON
      const data = await response.json();
      // Agrega la nueva reseña al principio de la lista
      setResenas((prevReseñas) => [data.resena, ...prevReseñas]);
      // Limpia el campo de comentario
      setComentario('');
      fetchReseñas();
    } catch (error) {
      // Maneja errores de forma amigable
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
  const calcularCalificacionPromedio = () => {
    if (resenas.length === 0) return 0; // No hay reseñas
    const totalCalificacion = resenas.reduce((acc, reseña) => acc + reseña.calificacion, 0);
    return (totalCalificacion / resenas.length).toFixed(1); // Redondear a un decimal
  };
  const calificacionPromedio = calcularCalificacionPromedio();

  // Función para redirigir
const handleRedirect = () => {
  setIsRedirecting(true); // Cambia el estado a true para redirigir
};
// Renderizado condicional
if (isRedirecting) {
  return <Navigate to="/libro" replace={true} />; // Redirige a la página de libros sugeridos
}

  const filteredReseñas = selectedStarFilter 
    ? resenas.filter((reseña) => reseña.calificacion === selectedStarFilter) 
    : resenas;

  

  return (
    <div className='flex-[4_4_0] border-r border-primary min-h-screen '> 
      <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg relative">
        {/* Render del libro */}
        <div className="flex items-center cursor-pointer gap-5 text-3xl -mt-4 border-b-2 border-gray-300 pb-2 mb-4" onClick={handleRedirect}>
          <Link to="/libro"> 
            <BsArrowLeft className="text-primary mr-2 text-lg " /> {/* Icono de flecha */}
          </Link>
            <span className="text-xl text-primary font-bold flex items-center">{titulo}</span> {/* Título del libro */}
        </div>

        <div className="flex">
          <img 
            src={portada || "/book-placeholder.png"}  
            alt={titulo} 
            className="w-1/3 h-[auto] rounded-lg object-cover"
            style={{ flexShrink: 0 }}
          />
          <div className="ml-6 flex flex-col flex-grow relative">
              <h2 className="text-2xl font-semibold">{titulo}</h2>
              <p className="text-lg font-medium"><strong>Autor:</strong> {autores.length > 0 ? autores.map((autor) => autor.nombre).join(', '): 'Autor no disponible'}</p>
              <p className="text-md"><strong>Serie:</strong> {serie || 'N/A'}</p>
              <p className="text-md"><strong>ISBN:</strong> {isbn}</p>

               
            <div className="text-md break-all max-h-[90px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-200">
              {renderSinopsis()}
            </div>
            <div className="flex items-center mt-2">
              <strong>Calificación General:</strong> 
              {renderEstrellas(calificacionPromedio)} {/* Mostrar calificación promedio en estrellas */}
            </div> 
            <strong>Generos literarios:</strong>
            <div className='flex flex-wrap gap-4'>
            {generos.length > 0 ? (
              generos.map((genero) => (
                <div 
                  key={genero.nombre} 
                  className='flex items-center border rounded-full p-2 bg-white min-w-[120px] max-w-[150px] truncate'
                >
                  <img src={genero.fotoGenero} alt={genero.nombre} className='w-8 h-8 mr-2' />
                  <span className="truncate">{genero.nombre}</span>
                </div>
              ))
            ) : (
              <span>No tiene géneros asignados</span> // Mensaje cuando no hay géneros
            )}
          </div>
          </div>
        </div>

        <button
          className="mt-4 bg-primary hover:bg-blue-950 text-white font-bold py-2 w-[210px] px-4 rounded"
          onClick={openModal}
        >
          Ver reseñas
        </button>

        <form onSubmit={handleSubmit} className="mt-4 ">
          <label className="block text-md font-medium mb-2">Escribe una reseña:</label>
          <div className="flex items-center mt-2 mb-2">{renderEstrellas(calificacion)}</div>

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

        {/* Renderizar solo las primeras 5 reseñas */}
       <div className="mt-6">
  {resenas.length === 0 ? ( // Comprobar si no hay reseñas
    <p>No tiene reseñas.</p>
  ) : (
    // Asegúrate de invertir el arreglo para que la reseña más reciente esté en la parte superior
    resenas.slice().reverse().slice(0, 5).map((reseña, index) => (
      <div key={index} className="flex items-start mb-4 p-4 border border-gray-200 rounded-lg bg-gray-100 break-all">
        <img 
          src={reseña.idUsuario.fotoPerfil || 'https://via.placeholder.com/48'} 
          alt={`${reseña.idUsuario.nombre} perfil`} 
          className="w-12 h-12 rounded-full mr-4"
          style={{ width: '48px', height: '48px' }} // Ajustar tamaño a 48x48
        />
        <div>
          <h3 className="font-semibold">{reseña.idUsuario.nombre}</h3>
          <p className="text-md">{reseña.contenido}</p>
        </div>
        <div className="flex mt-1">
          {renderEstrellasCom(reseña.calificacion)} {/* Renderización de estrellas */}
        </div>
      </div>
    ))
  )}
</div>




{isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 break-all">
          <div className="bg-white rounded-lg p-4 w-[40%] max-h-[800px] overflow-hidden"> {/* Aumenté el max-h a 800px */}
            <h3 className="text-lg font-semibold mb-2">Reseñas</h3>
        
            <div className="mb-2">
              <h4 className="text-sm font-medium">Filtrar por calificación:</h4>
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
        
            <div className="modal-container" style={{ maxHeight: '400px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#111827 transparent' }}> {/* Aumenté maxHeight a 400px */}
              {loadingReseñas ? (
                <p>Cargando reseñas...</p>
              ) : (
                filteredReseñas.length > 0 ? (
                  filteredReseñas.slice().reverse().map((reseña) => (
                    <div key={reseña._id} className="flex items-start mb-2 p-2 border border-gray-200 rounded-lg bg-gray-100">
                      <img 
                        src={reseña.idUsuario.fotoPerfil || 'https://via.placeholder.com/48'} 
                        alt={`${reseña.idUsuario.nombre} perfil`} 
                        className="w-10 h-10 rounded-full mr-2" 
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-sm">{reseña.idUsuario.nombre}</h3>
                        <p className="text-sm break-all">{reseña.contenido}</p>
                        <div className="flex mt-1">
                          {renderEstrellasCom(reseña.calificacion)}
                        </div>
                      </div>
                      {reseña.idUsuario._id === authUser._id && (
                        <button 
                          onClick={() => handleDeleteReseña(reseña._id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <FaTrash className="text-primary cursor-pointer hover:text-blue-900" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No hay reseñas para mostrar.</p>
                )
              )}
            </div>
            
            <button 
              onClick={closeModal}       
              className="mb-2 mt-4 bg-primary hover:bg-blue-950 text-white px-4 py-2 rounded ml-[85%]"> {/* Asegurando que el botón ocupe todo el ancho */}
              Cerrar
            </button>
          </div>
        </div>
        )}
      </div>
    </div>
    
  );
};

// Agrega PropTypes si es necesario
FichaTecnicaLibro.propTypes = {
  id: PropTypes.string,
};

export default FichaTecnicaLibro;