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
    <div className="flex flex-row border-r border-gray-300 min-h-screen bg-white">
      <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
        <div className="flex">
          <img
            src={fotoComunidad}
            alt={nombre}
            className="w-48 h-48 rounded-full object-cover"
          />
          <div className="ml-6 flex flex-col flex-grow">
            <h2 className="text-2xl font-semibold">{nombre}</h2>
            <p className="text-lg">
              <strong>Administrador:</strong> {admin?.nombre}
            </p>
            <p className="text-lg">
              <strong>Descripción:</strong>{' '}
              {expandirDescripcion ? descripcion : `${descripcion.substring(0, 100)}...`}
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

            {esMiembro && (
              <button onClick={handleSalirComunidad} className="mt-4 text-red-600">
                Salir de la comunidad
              </button>
            )}
            {esAdmin && (
              <>
                <button onClick={handleInactivarComunidad} className="mt-4 text-red-600">
                  Inactivar comunidad
                </button>
                <button
                  onClick={() => setIsActualizarModalOpen(true)}
                  className="mt-4 bg-blue-600 text-white py-2 px-4 rounded"
                >
                  Actualizar comunidad
                </button>
              </>
            )} {!esMiembro && !esAdmin && (
              <button onClick={handleUnirseComunidad} className="mt-4 bg-green-600 text-white py-2 px-4 rounded">
                Unirme a la comunidad
              </button>
            )}
          </div>
        </div>

        {esMiembro || esAdmin ? (
          <form className="mt-8" onSubmit={handleSubmit}>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Escribe algo..."
            />
            <label className="mt-2 flex items-center">
              <CiImageOn />
              <input type="file" accept="image/*" onChange={handleImgChange} className="hidden" />
            </label>
            <button type="submit" disabled={isPending} className="mt-2 bg-blue-600 text-white py-1 px-4 rounded">
              {isPending ? 'Cargando...' : 'Publicar'}
            </button>
          </form>
        ) : (
          <p>Debes ser miembro para publicar.</p>
        )}

        <ListaPublicaciones posts={posts} esAdmin={esAdmin}
         esMiembro={esMiembro} /> {/* Usar el nuevo componente */}
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
