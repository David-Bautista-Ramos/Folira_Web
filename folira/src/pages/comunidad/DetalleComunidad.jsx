import { useState } from 'react';
import { BsArrowLeft, BsEye, BsEyeSlash } from 'react-icons/bs';
import { CiImageOn } from 'react-icons/ci';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link, Navigate, useParams } from 'react-router-dom';
import ModalActualizarComunidad from './ActualizarComunidadModal';
import usePosts from '../../hooks/usePost';
import ListaPublicaciones from './ListaPublicaciones';
import EmojiPicker from 'emoji-picker-react';

const DetallesComunidad = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [expandirDescripcion, setExpandirDescripcion] = useState(false);
  const [contenido, setContenido] = useState('');
  const [fotoPublicacion, setFotoPublicacion] = useState(null);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [mostrarEmojis, setMostrarEmojis] = useState(false); // Estado para mostrar emojis

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

  const { mutate: crearPost} = useMutation({
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
  const onEmojiClick = (emojiObject) => {
    setContenido((prev) => prev + emojiObject.emoji);
    setMostrarEmojis(false); // Cierra el selector de emojis al elegir uno
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
  const handleRedirect = () => {
    Navigate('/comunidad'); // Redirección
  };
  if (loadingComunidad) return <div>Cargando...</div>;

  const { nombre, admin, descripcion, miembros, link, fotoComunidad } = comunidad || {};
  const esMiembro = miembros?.some((m) => m._id === authUser._id);
  const esAdmin = admin?._id === authUser._id;

  return (
    <div className='flex-[4_4_0] border-r border-primary min-h-screen'>
      <div className="flex flex-col border-r border-gray-300 min-h-screen bg-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center cursor-pointer gap-5 text-3xl -mt-4 border-b-2 border-gray-300 pb-2 mb-4" onClick={handleRedirect}>
          <Link to="/comunidad">
            <BsArrowLeft className="text-primary mr-2 text-lg" /> {/* Icono de flecha */}
          </Link>
          <span className="text-xl text-primary font-bold flex items-center">{nombre}</span> {/* Título del libro */}
        </div>
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
            )}{!esMiembro && !esAdmin && (
              <button onClick={handleUnirseComunidad} className="mt-4 bg-primary hover:bg-blue-950 text-white py-2 px-4 rounded">
                Unirme a la comunidad
              </button>
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
        <div className="flex flex-col mt-8">
          <h2 className="text-2xl font-semibold mb-4">Publicaciones</h2>
          {esMiembro || esAdmin ? (
          // Formulario de creación de publicaciones (solo visible para miembros y admin)
          <form className="flex flex-col space-y-4 items-center" onSubmit={handleSubmit}>
            <textarea
              className="border border-primary rounded-lg w-full h-20 p-4 mb-4 resize-none focus:outline-none"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="¿Qué quieres compartir?"
            />
            <div className="flex items-center justify-between w-full">
              <label className="flex items-center cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleImgChange} />
                <CiImageOn className="text-primary text-3xl mr-2 cursor-pointer" />
                <span>Subir imagen</span>
              </label>
              <button
                type="button"
                onClick={() => setMostrarEmojis(!mostrarEmojis)}
                className="text-primary text-2xl"
              >
                😃
              </button>
              {mostrarEmojis && (
                <div className="absolute top-20">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <button
                type="submit"
                className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-950 transition duration-300"
              >
                Publicar
              </button>
            </div>
            {fotoPublicacion && (
              <div className="mt-4">
                <img
                  src={fotoPublicacion}
                  alt="Vista previa"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                />
              </div>
            )}
          </form>
        ) : (
          // Mensaje para usuarios que no son miembros ni admin
          <div className="text-center text-gray-500 text-lg mt-4">
            Debes ser miembro de la comunidad para hacer publicaciones.
          </div>
        )}
          <ListaPublicaciones posts={posts} esAdmin={esAdmin} esMiembro={esMiembro}/>
        </div>
        <ModalActualizarComunidad isOpen={isActualizarModalOpen} onClose={() => setIsActualizarModalOpen(false)} />
      </div>
    </div>
  );
};

export default DetallesComunidad;
