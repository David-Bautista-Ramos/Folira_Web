import { useState } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { CiImageOn } from 'react-icons/ci';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import ModalActualizarComunidad from './ActualizarComunidadModal';
import usePosts from '../../hooks/usePost';
import ListaPublicaciones from './ListaPublicaciones';

const DetallesComunidad = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [expandirDescripcion, setExpandirDescripcion] = useState(false);
  const [contenido, setContenido] = useState('');
  const [fotoPublicacion, setFotoPublicacion] = useState(null);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);

  // Query para obtener la comunidad
  const { data: comunidad, isLoading: loadingComunidad } = useQuery({
    queryKey: ['comunidad', id],
    queryFn: async () => {
      const res = await fetch(`/api/comunidad/comunidad/${id}`);
      if (!res.ok) throw new Error('Error al obtener la comunidad');
      return res.json();
    },
  });

  const { data: authUser } = useQuery({ queryKey: ['authUser'] });
  const { data: posts = [] } = usePosts(id);

  const toggleDescripcion = () => setExpandirDescripcion(!expandirDescripcion);

  const { mutate: crearPost, isLoading: isPending } = useMutation({
    mutationFn: async ({ contenido, fotoPublicacion }) => {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido, fotoPublicacion, comunidadId: id }),
      });
      if (!res.ok) throw new Error('Error al crear la publicación');
      return res.json();
    },
    onSuccess: () => {
      setContenido('');
      setFotoPublicacion(null);
      toast.success('¡Post creado con éxito!');
      // Refresca los posts para que se muestren en la lista
      queryClient.invalidateQueries(['posts', id]);
    },
  });
  

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFotoPublicacion(reader.result);
      reader.readAsDataURL(file);
    } else {
      toast.error('Formato de imagen no válido');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!contenido && !fotoPublicacion) {
      return toast.error('Debes escribir algo o subir una imagen');
    }
    crearPost({ contenido, fotoPublicacion });
  };

  const handleSalirComunidad = async () => {
    try {
      const res = await fetch('/api/comunidad/salircomunidad', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: authUser._id, comunidadId: id }),
      });
      if (!res.ok) throw new Error('Error al salir de la comunidad');
      toast.success('Has salido de la comunidad');
    } catch {
      toast.error('No se pudo salir de la comunidad');
    }
  };

  const handleInactivarComunidad = async () => {
    try {
      const res = await fetch(`/api/comunidad/comunidaddes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authUser.token}`,
        },
      });
      if (!res.ok) throw new Error('Error al inactivar la comunidad');
      toast.success('Comunidad inactivada con éxito');
      setIsActualizarModalOpen(false);
    } catch {
      toast.error('Hubo un problema al inactivar la comunidad');
    }
  };
  const handleUnirseComunidad = async () => {
    const userId = authUser._id;

  try {
    const response = await fetch('/api/comunidad/unircomunidad', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, comunidadId: id }),
    });

    if (!response.ok) throw new Error('Error al unirse a la comunidad');
    const data = await response.json();
    toast.success(data.message);

    // Invalida la consulta de la comunidad para actualizar los datos
    queryClient.invalidateQueries(['comunidad', id]);
  } catch (error) {
    console.error('Error:', error);
    toast.error('No se pudo unir a la comunidad');
  }
  };

  if (loadingComunidad) return <div>Cargando...</div>;

  const { nombre, admin, descripcion, miembros, link, fotoComunidad } = comunidad || {};
  const esMiembro = miembros?.some((m) => m._id === authUser._id);
  const esAdmin = admin?._id === authUser._id;

  return (
    <div className='flex-[4_4_0] border-r border-primary min-h-screen'> 
    <div className="flex flex-col border-r border-gray-300 min-h-screen bg-white p-6 rounded-lg shadow-lg">
      
      {/* Columna 1: Imagen y botones */}
      <div className="flex flex-row mb-4">
        <div className="flex flex-col items-center mr-6">
          <img
            src={fotoComunidad}
            alt={nombre}
            className="w-48 h-48 rounded-full object-cover mb-4"
          />
  
          {esMiembro && (
            <button onClick={handleSalirComunidad} className="mb-2 bg-primary text-white py-2 px-4 rounded hover:bg-blue-950">
              Salir de la comunidad
            </button>
          )}
  
          {esAdmin && (
            <div className="flex space-x-2"> {/* Usar space-x-2 para espaciar los botones */}
              <button
                onClick={handleInactivarComunidad}
                className="bg-primary text-white py-2 px-3 rounded hover:bg-blue-950"
              >
                Inactivar
              </button>
              <button
                onClick={() => setIsActualizarModalOpen(true)}
                className="bg-primary text-white py-2 px-3 rounded hover:bg-blue-950"
              >
                Actualizar
              </button>
            </div>
          )}
        </div>
  
        {/* Columna 2: Información de la comunidad */}
        <div className="flex flex-col flex-grow">
          <h2 className="text-2xl font-semibold">{nombre}</h2>
          <p className="text-lg">
            <strong>Administrador:</strong> {admin?.nombre}
          </p>
          <p className="text-lg">
            <strong>Descripción:</strong>{' '}
            <span className="break-all"> {/* Mantenido break-all para manejar los cortes */}
              {expandirDescripcion ? descripcion : `${descripcion.substring(0, 100)}...`}
            </span>
            {descripcion.length > 100 && (
              <button onClick={toggleDescripcion} className="ml-2 text-blue-600">
                {expandirDescripcion ? <BsEyeSlash /> : <BsEye />}
              </button>
            )}
          </p>
          <p className="text-lg">
            <strong>Número de miembros:</strong> {miembros?.length || 0}
          </p>
          <p className="text-lg">
            <strong>Enlace de conexión:</strong>{' '}
            <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {link}
            </a>
          </p>
        </div>
      </div>
  
      {/* Sección de Publicación */}
      {esMiembro || esAdmin ? (
        <form className="mt-4" onSubmit={handleSubmit}>
          <h2 className="font-bold text-xl">¡Haz una nueva publicación!🎊</h2>
          
          <div className="flex items-center mt-4">
            {/* Icono de imagen a la izquierda */}
            <label className="mr-4 cursor-pointer">
              <CiImageOn className="text-4xl" /> {/* Icono ajustado */}
              <input type="file" accept="image/*" onChange={handleImgChange} className="hidden" />
            </label>
        
            {/* Textarea */}
            <textarea
              value={contenido}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setContenido(e.target.value);
                }
              }}
              className="border border-gray-300 rounded p-2 mb-2 h-[48px] w-[455px] focus:outline-none focus:border-blue-950 resize-none" // Espacio ajustado
              placeholder="Escribe algo..."
            />
        
            {/* Botón de Publicar a la derecha */}
            <button 
              type="submit" 
              disabled={isPending} 
              className="ml-4 bg-primary text-white py-2 px-4 rounded hover:bg-blue-950 h-[48px]" // Mismo alto que el textarea
            >
              {isPending ? 'Cargando...' : 'Publicar'}
            </button>
          </div>
        
          <p className="text-sm text-gray-500 ml-[53px]">
            {300 - contenido.length} caracteres restantes
          </p>
        </form>
      ) : (
        <p className='mt-10 font-bold'>Debes ser miembro para publicar.*</p>
      )}
  
      <ListaPublicaciones posts={posts} esAdmin={esAdmin} esMiembro={esMiembro} /> {/* Usar el nuevo componente */}
      
    </div>
  
    {isActualizarModalOpen && (
      <ModalActualizarComunidad 
        isOpen={isActualizarModalOpen} 
        onClose={() => setIsActualizarModalOpen(false)} 
        token={authUser.token} 
        comunidadId={id} 
      />
    )}
  </div>
  

  

    
  );
};

export default DetallesComunidad;
