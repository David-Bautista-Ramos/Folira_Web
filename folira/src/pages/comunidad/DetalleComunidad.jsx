import { useState, useRef } from 'react';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const DetallesComunidad = ({ comunidad }) => {
  const { nombre, administrador, descripcion, numeroMiembros, imagen, enlaceConexion } = comunidad;
  const [expandirDescripcion, setExpandirDescripcion] = useState(false);
  const [contenido, setContenido] = useState("");
  const [fotoPublicacion, setFotoPublicacion] = useState(null);
  const fotoPublicacionRef = useRef(null);
  const [feedType, setFeedType] = useState("posts"); // Estado para controlar el feed seleccionado
  const [posts, setPosts] = useState([]); // Estado para almacenar los posts
  const queryClient = useQueryClient();

  const toggleDescripcion = () => {
    setExpandirDescripcion(!expandirDescripcion);
  };

  const { mutate: crearPost, isPending, isError, error } = useMutation({
    mutationFn: async ({ contenido, fotoPublicacion }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contenido, fotoPublicacion }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Algo salió mal");
        return data;
      } catch (error) { throw new Error(error); }
    },
    onSuccess: (newPost) => {
      setContenido("");
      setFotoPublicacion(null);
      setPosts((prevPosts) => [newPost, ...prevPosts]); // Agregar el nuevo post al inicio de la lista
      setFeedType("posts"); // Cambiar automáticamente a "posts" después de crear una publicación
      toast.success("¡Post creado con éxito!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    crearPost({ contenido, fotoPublicacion });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFotoPublicacion(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col p-6 bg-white rounded-lg shadow-lg relative">
      <div className="flex">
        <img
          src={imagen}
          alt={nombre}
          className="w-48 h-48 rounded-full object-cover"
          style={{ flexShrink: 0 }}
        />
        <div className="ml-6 flex flex-col flex-grow">
          <h2 className="text-2xl font-semibold">{nombre}</h2>
          <p className="text-lg"><strong>Administrador:</strong> {administrador}</p>
          <p className="text-lg">
            <strong>Descripción:</strong> {expandirDescripcion ? descripcion : `${descripcion.substring(0, 100)}...`}
            {descripcion.length > 150 && (
              <button onClick={toggleDescripcion} className="ml-2 text-primary">
                {expandirDescripcion ? <BsEyeSlash /> : <BsEye />}
              </button>
            )}
          </p>
          <p className="text-lg"><strong>Número de miembros:</strong> {numeroMiembros}</p>
          <p className="text-lg">
            <strong>Enlace de conexión:</strong> <a href={enlaceConexion} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{enlaceConexion}</a>
          </p>
        </div>
      </div>
      <div className="-mt-[15px]">
        <a
          href={enlaceConexion}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary hover:bg-blue-950 text-white font-bold py-2 px-4 rounded"
        >
          Unirse a la comunidad
        </a>
      </div>

      
      {/* Formulario de Creación de Publicación */}
      <form className='flex flex-col gap-2 w-full mt-8 border-t pt-4' onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold mb-2">Crear una publicación</h3>
        <textarea
          className='textarea w-full p-2 text-lg resize-none border border-gray-300 rounded-md focus:outline-none'
          placeholder='Escribe algo para la comunidad...'
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        />
        {fotoPublicacion && (
          <div className='relative w-72 mx-auto'>
            <IoCloseSharp
              className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
              onClick={() => {
                setFotoPublicacion(null);
                fotoPublicacionRef.current.value = null;
              }}
            />
            <img src={fotoPublicacion} className='w-full mx-auto h-72 object-contain rounded' />
          </div>
        )}
        <div className='flex justify-between items-center border-t py-2 border-t-gray-300 mt-2'>
          <div className='flex gap-2 items-center'>
            <CiImageOn
              className='fill-primary w-6 h-6 cursor-pointer'
              onClick={() => fotoPublicacionRef.current.click()}
            />
            <BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
          </div>
          <input type='file' accept="image/*" hidden ref={fotoPublicacionRef} onChange={handleImgChange} />
          <button className='btn bg-primary hover:bg-blue-950 text-white font-semibold rounded-md px-4 py-2'>
            {isPending ? "Publicando..." : "Publicar"}
          </button>
        </div>
        {isError && <div className='text-red-500'>{error.message}</div>}
      </form>

      {/* Selector de Feed */}
      <div className="flex w-full border-b border-gray-700 mt-4">
        <div
          className={`flex justify-center flex-1 p-3 ${feedType === "posts" ? "text-primary" : "text-slate-500"} hover:bg-secondary transition duration-300 relative cursor-pointer`}
          onClick={() => setFeedType("posts")}
        >
          Posts
          {feedType === "posts" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
          )}
        </div>
        <div
          className={`flex justify-center flex-1 p-3 ${feedType === "likes" ? "text-primary" : "text-slate-500"} hover:bg-secondary transition duration-300 relative cursor-pointer`}
          onClick={() => setFeedType("likes")}
        >
          Likes
          {feedType === "likes" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
          )}
        </div>
      </div>

      {/* Lista de Posts */}
      {feedType === "posts" && (
        <div className="mt-4">
          {posts.map((post, index) => (
            <div key={index} className="border-b py-4">
              <p>{post.contenido}</p>
              {post.fotoPublicacion && (
                <img src={post.fotoPublicacion} alt="Publicación" className="w-full h-auto mt-2 rounded-md" />
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

// Ejemplo de uso del componente
const ejemploComunidad = {
  nombre: 'Amantes de la Literatura',
  administrador: 'Laura Martínez',
  descripcion: 'Un espacio para compartir y discutir sobre libros, autores y géneros literarios...',
  numeroMiembros: 150,
  imagen: 'https://via.placeholder.com/200',
  enlaceConexion: 'https://example.com/unirse',
};

const App = () => {
  return (
    <div className="p-6">
      <DetallesComunidad comunidad={ejemploComunidad} />
    </div>
  );
};

export default App;
