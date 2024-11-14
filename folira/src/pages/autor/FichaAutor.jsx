import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom'; // Importa useParams
import { useQuery } from '@tanstack/react-query';
import { BsArrowLeft, BsEye, BsEyeSlash, BsStar, BsStarFill } from 'react-icons/bs';
import { FaTrash } from 'react-icons/fa';

const FichaTecnicaAutor = () => {
  const { id: autorId } = useParams(); // Obtiene el id desde la URL
  const [autor, setAutor] = useState(null);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [resenas, setResenas] = useState([]);
  const [generos, setGeneros] = useState([]); // Cambiar a useState para almacenar los géneros
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingReseñas, setLoadingReseñas] = useState(false);
  const [selectedStarFilter, setSelectedStarFilter] = useState(0); // Estado para el filtro de estrellas
  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const [isRedirecting, setIsRedirecting] = useState(false); // Estado para redirigir después de inactivar

  // Formateador de fecha
const formatearFecha = (fechaISO) => {
  const formateador = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  return formateador.format(new Date(fechaISO));
};

const [isBiografiaVisible, setIsBiografiaVisible] = useState(false); // Estado para controlar la visibilidad

// Función para alternar la visibilidad de la biografía
const toggleBiografiaVisibility = () => {
    setIsBiografiaVisible(!isBiografiaVisible);
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
        setGeneros(data.generos)
      } catch (error) {
        console.error('Error al obtener el autor:', error);
      }
    };

     // Función para obtener las reseñas del libro
  const fetchReseñas = async () => {
    try {
      const response = await fetch(`/api/resenas/autorRes/${autorId}`); // Cambia la ruta según tu API
      if (!response.ok) {
        throw new Error('Error al obtener las reseñas');
      }
      const data = await response.json();
      setResenas(data); // Ajusta esto según tu estado para reseñas
    } catch (error) {
      console.error('Error al obtener las reseñas:', error);
    }
  };

    fetchAutor();
    fetchReseñas();
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
      // Aquí se agrega la nueva reseña al principio de la lista
      setResenas((prevReseñas) => [data.resena, ...prevReseñas]);
      setComentario('');
      fetchReseñas();

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
  if (isRedirecting) {
    return <Navigate to="/autor" replace={true} />; // Redirige a la página de libros sugeridos
  }

  const filteredReseñas = selectedStarFilter 
    ? resenas.filter((reseña) => reseña.calificacion === selectedStarFilter) 
    : resenas;

  return (
    <div className='flex-[4_4_0] border-r border-primary min-h-screen '>
      <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg relative">
      <div className="flex items-center cursor-pointer gap-5 text-3xl -mt-4 border-b-2 border-gray-300 pb-2 mb-4" onClick={handleRedirect}>
          <Link to="/autor  "> 
            <BsArrowLeft className="text-primary mr-2 text-lg " /> {/* Icono de flecha */}
          </Link>
            <span className="text-xl text-primary font-bold flex items-center">{nombre}</span> {/* Título del libro */}
        </div>
        <div className="flex items-start space-x-6">
        {/* Columna izquierda: Imagen del autor y botón de reseñas */}
        <div className="flex flex-col items-start">
          <img 
            src={fotoAutor || "/avatar-placeholder.png"} 
            alt={nombre} 
            className="w-52 h-52 rounded-full object-cover"
            style={{ flexShrink: 0 }} 
          />
          {/* Botón para ver reseñas */}
          <button 
            onClick={openModal} 
            className="bg-primary hover:bg-blue-950 text-white font-bold py-2 w-[180px] px-4 rounded mt-4"
          >
            Ver Reseñas
          </button>
        </div>

        {/* Columna derecha: Información del autor */}
        <div className="flex flex-col flex-grow">
          <h2 className="text-2xl font-semibold">{nombre}</h2>
          <p className="text-lg"><strong>Seudonimo:</strong> {seudonimo}</p>
          <p className="text-lg"><strong>País:</strong> {pais}</p>
          <p className="text-lg">
            <strong>Fecha de Nacimiento:</strong> {fechaNacimiento ? formatearFecha(fechaNacimiento) : 'N/A'}
          </p>
          <p className="text-lg"><strong>Biografía:</strong></p>
          
          <div className="text-md break-all max-h-[90px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-200">
            {biografia.length > 150 && !isBiografiaVisible
              ? `${biografia.slice(0, 100)}...`
              : biografia}
          </div>
          
          {/* Icono de ojo para alternar la visibilidad */}
          {biografia.length > 100 && (
            <button
              onClick={toggleBiografiaVisibility}
              className="text-xl text-blue-950 cursor-pointer"
            >
              {isBiografiaVisible ? <BsEyeSlash /> : <BsEye />}
            </button>
          )}
          <p className="text-lg"><strong>Distinciones:</strong> {distinciones || 'N/A'}</p>
          <div className="flex items-center mt-2">
            <strong>Calificación General:</strong>
            {renderEstrellas(calificacionPromedio)} {/* Mostrar calificación promedio en estrellas */}
          </div>
          <strong>Generos Literarios</strong>
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
              <span>No tiene géneros asignados</span>
            )}
          </div>
        </div>
      </div>



            
            

            <form onSubmit={handleSubmit} className="mt-4">
              <label className="block text-md font-medium">Escribe una reseña:</label>
              
              <div className="flex items-center mt-2">
                {renderEstrellas(calificacion)}
              </div>

              <div className="flex items-center mt-2">
                <input
                  type="text"
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  className="w-[510px] p-2 border rounded"
                  placeholder="Escribe tu reseña..."
                />
                <button 
                  type="submit" 
                  className="bg-primary text-white px-4 py-2 rounded ml-3"
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
                // Crear una copia del arreglo, invertirlo y limitarlo a las últimas 5 reseñas
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
                      {renderEstrellas(reseña.calificacion)} {/* Renderización de estrellas */}
                    </div>
                  </div>
                ))
              )}
            </div>


          {/* Modal para mostrar las reseñas */}
          {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 break-all">
              <div className="bg-white rounded-lg p-4 w-[40%] max-h-[800px] overflow-hidden">
                <h3 className="text-lg font-semibold mb-2">Reseñas</h3>
            
                {/* Filtro de estrellas */}
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
            
                {/* Renderizar reseñas filtradas */}
                <div className="modal-container" style={{ maxHeight: '400px', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#111827 transparent' }}>
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
                              {renderEstrellas(reseña.calificacion)}
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
                  className="mb-2 mt-4 bg-primary hover:bg-blue-950 text-white px-4 py-2 rounded ml-[85%]">
                  Cerrar
                </button>
              </div>
            </div>
            )}
      </div>
    </div> 
    

  );
};

export default FichaTecnicaAutor;