import { useState } from 'react';
import { BsArrowLeft, BsEmojiSmileFill, BsEye, BsEyeSlash} from 'react-icons/bs';
import { CiImageOn } from 'react-icons/ci';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link, Navigate, useParams } from 'react-router-dom';
import ModalActualizarComunidad from './ActualizarComunidadModal';
import usePosts from '../../hooks/usePost';
import ListaPublicaciones from './ListaPublicaciones';
import EmojiPicker from 'emoji-picker-react';
import ModalMiembrosComunidad from './ModalMiembros';

const DetallesComunidad = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [expandirDescripcion, setExpandirDescripcion] = useState(false);
  const [contenido, setContenido] = useState('');
  const [fotoPublicacion, setFotoPublicacion] = useState(null);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [mostrarEmojis, setMostrarEmojis] = useState(false); // Estado para mostrar emojis
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false); // Estado para redirigir después de inactivar

const handleConfirmInactivar = () => {
  handleInactivarComunidad();
  setIsConfirmModalOpen(false);
};
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
      toast.success('¡Publicación creada con éxito!');
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

      queryClient.invalidateQueries(['comunidad', id]);

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
      setIsRedirecting(true); // Cambia el estado a true para redirigir
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
  if (isRedirecting) {
    return <Navigate to="/comunidad" />; // Redirige a la página de comunidades
  }
  if (loadingComunidad) return <div>Cargando...</div>;

  const { nombre, admin, descripcion, miembros, link, fotoComunidad,generoLiterarios,fotoBanner } = comunidad || {};
  const esMiembro = miembros?.some((m) => m._id === authUser._id);
  const esAdmin = admin?._id === authUser._id;

  return (
    <div className='flex-[4_4_0] border-r border-primary min-h-screen'>
      <div className="flex flex-col border-r border-gray-300 min-h-screen bg-white p-6 rounded-lg shadow-lg">
        {/* Banner de la comunidad */}
    
      {/* Título de la comunidad */}
      <div className="flex items-center cursor-pointer gap-5 text-3xl -mt-4 border-b-2 border-gray-300 pb-2 mb-4">
        <Link to="/comunidad">
          <BsArrowLeft className="text-primary mr-2 text-lg" />
        </Link>
        <span className="text-xl text-primary font-bold flex items-center">{nombre}</span>
      </div>
    
      <div className="relative w-full">
        {/* Columna 1: Imagen de banner */}
        <div className="relative">
          <img
            src={fotoBanner  || "/cover.png"} // Asegúrate de que este sea el nombre de la variable para el banner
            alt="Banner de la comunidad"
            className="h-52 w-full object-cover"
          />
        </div>

        {/* Imagen de la comunidad sobre el banner y alineada a la derecha */}
        <div className="absolute top-46 left-6 transform translate-y-[-50%]">
          <img
            src={fotoComunidad || "/avatar-placeholder.png"}
            alt={nombre}
            className="w-30 h-30 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg"
          />
        </div>

        {/* Contenedor principal */}
        <div className="relative flex flex-col items-center lg:items-start mb-4 space-y-4 p-4 mt-[70px]">
          {/* Botones: Alineados en la parte superior derecha */}
          <div className="absolute top-[-50px] right-0 mt-0 mr-4 flex space-x-2">
            {esMiembro && (
              <button
                onClick={handleSalirComunidad}
                className="btn btn-outline rounded-full btn-sm"
              >
                Salir de la comunidad
              </button>
            )}
            {esAdmin && (
              <>
                <button
                  onClick={() => setIsConfirmModalOpen(true)}
                  className="btn btn-outline rounded-full btn-sm"
                >
                  Inactivar
                </button>
                <button
                  onClick={() => setIsActualizarModalOpen(true)}
                  className="btn btn-outline rounded-full btn-sm"
                >
                  Actualizar
                </button>
              </>
            )}
            {!esMiembro && !esAdmin && (
              <button
                onClick={handleUnirseComunidad}
                className="bg-primary hover:bg-blue-950 text-white py-2 px-4 rounded"
              >
                Unirme a la comunidad
              </button>
            )}
          </div>

          {/* Información de la comunidad */}
          <div className="flex flex-col flex-grow">
            <h2 className="text-2xl font-semibold mb-2">{nombre}</h2>
            <p className="text-lg mb-2">
              <strong>Administrador:</strong> {admin?.nombre}
            </p>

            {/* Lo agregue y cambie */}
            <p className="text-lg mb-4">
              <strong>Descripción:</strong>{' '}
              <span className="break-all">
                {expandirDescripcion ? descripcion : `${descripcion.substring(0, 100)}...`}
              </span>
              {descripcion.length > 100 && (
                <button onClick={toggleDescripcion} className="ml-2 text-blue-950 font-semibold  flex items-center ">
                  {expandirDescripcion ? 'Mostrar menos' : 'Mostrar más'}
                  {expandirDescripcion ? <BsEyeSlash className="ml-1" /> : <BsEye className="ml-1" />}
                </button>
              )}
            </p>

            <div className="text-lg mb-4">
              <ModalMiembrosComunidad miembros={miembros} />
            </div>
            <p className="text-lg mb-4">
              <strong>Enlace de conexión:</strong>{' '}
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {link}
              </a>
            </p>
            <strong className="text-lg mb-2">Géneros Literarios:</strong>
            <div className="flex flex-wrap gap-6">
              {generoLiterarios.length > 0 ? (
                generoLiterarios.map((genero) => (
                  <div
                    key={genero.nombre}
                    className="flex items-center border rounded-full p-2 bg-white min-w-[120px] max-w-[150px] truncate"
                  >
                    <img src={genero.fotoGenero} alt={genero.nombre} className="w-8 h-8 mr-2" />
                    <span className="truncate">{genero.nombre}</span>
                  </div>
                ))
              ) : (
                <span>No tiene géneros asignados</span>
              )}
            </div>
          </div>
        </div>
      </div>

        <div className="flex flex-col mt-8">
          <h2 className="text-2xl font-semibold mb-4">Publicaciones</h2>
          {esMiembro || esAdmin ? (
          // Formulario de creación de publicaciones (solo visible para miembros y admin)
          <form className="flex flex-col space-y-4 items-center" onSubmit={handleSubmit}>
            {/* Contenedor para el textarea y el botón */}
            <div className="flex w-full items-center space-x-2">
              <textarea
                className="border border-primary rounded-lg flex-grow p-2 resize-none focus:outline-none h-12"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="¿Qué quieres compartir?"
                maxLength={550} // Limita la cantidad de caracteres a 550
              />
              <button
                type="submit"
                className="bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-950 transition duration-300 h-12"
              >
                Publicar
              </button>
            </div>

            {/* Contador de caracteres */}
            <p className="text-sm mr-[80%] text-gray-500">{contenido.length}/550 caracteres</p>


            {/* Contenedor para los botones adicionales (Agregue esto)*/} 
              <div className="flex items-center justify-between w-full">
                <label className="flex items-center cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={handleImgChange} />
                  <CiImageOn className="text-primary text-3xl mr-2 cursor-pointer" />
                  <button
                    type="button"
                    onClick={() => setMostrarEmojis(!mostrarEmojis)}
                    className="text-primary text-2xl"
                  >
                    <BsEmojiSmileFill />
                  </button>
                </label>
                {mostrarEmojis && (
                  <div className="absolute top-20">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}
              </div>


            {/* Vista previa de la imagen */}
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
        <ModalActualizarComunidad isOpen={isActualizarModalOpen} comunidadId={id} onClose={() => setIsActualizarModalOpen(false)} />
      </div>
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirmar Inactivación</h2>
            <p>¿Estás seguro de que deseas inactivar esta comunidad?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmInactivar}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetallesComunidad;
