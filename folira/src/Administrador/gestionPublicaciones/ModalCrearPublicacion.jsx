import { useState, useRef, useEffect } from "react";
import useCreatePublicacion from "../../hooks/useCreatePost";
import toast from "react-hot-toast";
import Select from "react-select"

function ModalCrearPublicacion({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    contenido: "",
    userId: "",
    comunidadId: "",
  });

  const [fotoPublicacion, setfotoPublicacion] = useState("");
  const [esComunidad, setEsComunidad] = useState(false);
  const [comunidadSeleccionada, setComunidadSeleccionada] = useState("");
  const fotoPublicacionRef = useRef(null);
  const [usuarios, setUsuarios] = useState([]);
  const [comunidades, setComunidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { createPost, isCreatingPost } = useCreatePublicacion();

  // Estado para controlar la búsqueda
  const [busquedaUsuario, setBusquedaUsuario] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usuariosResponse, comunidadesResponse] = await Promise.all([
          fetch("/api/users/allUsers"),
          fetch("/api/comunidad/comunidad"),
        ]);

        if (!usuariosResponse.ok || !comunidadesResponse.ok) {
          throw new Error("Error al obtener usuarios o comunidades");
        }

        const usuariosData = await usuariosResponse.json();
        const comunidadesData = await comunidadesResponse.json();

        setUsuarios(usuariosData);
        setComunidades(comunidadesData);

        if (usuariosData.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            userId: usuariosData[0]._id,
          }));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Manejo de la búsqueda de usuario
  const handleBusquedaChange = (e) => {
    setBusquedaUsuario(e.target.value);
  };

  // Filtra usuarios basados en la búsqueda
  const usuariosFiltrados = usuarios.filter((usuario) =>
    `${usuario.nombre} ${usuario.apellido}`
      .toLowerCase()
      .includes(busquedaUsuario.toLowerCase())
  );

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "fotoPost" && setfotoPublicacion(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.contenido || !formData.userId) {
      toast.error("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      await createPost({
        ...formData,
        fotoPublicacion,
        comunidadId: esComunidad ? comunidadSeleccionada : "",
      });

      setFormData({
        contenido: "",
        userId: usuarios[0]?._id || "",
        fotoPublicacion: null,
        comunidadId: "",
      });
      setEsComunidad(false);
      setComunidadSeleccionada(""); 
      onClose();
    } catch (error) {
      console.error("Error creando publicación:", error);
    }
  };

  const toggleEsComunidad = () => setEsComunidad(!esComunidad);

  if (!isOpen) return null;

  return (
    <div
  className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  onClick={onClose}
>
  <div
    className="bg-white p-8 rounded-lg w-11/12 max-w-3xl h-[95%] md:w-2/3 md:h-[75%] relative overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="border-b-2 border-primary pb-2 mb-5">
      <h2 className="text-lg text-center text-primary">CREAR PUBLICACIÓN</h2>
    </div>

    {loading ? (
      <p>Cargando...</p>
    ) : error ? (
      <p>Error: {error}</p>
    ) : (
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 overflow-y-auto max-h-[80%] text-[#503B31] text-lg ">
        
        {/* Columna Izquierda */}
        <div>
          <label className="block mb-1 text-primary">Contenido</label>
          <textarea
            name="contenido"
            value={formData.contenido}
            onChange={handleInputChange}
            placeholder="Escribe tu publicación"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
            maxLength={550}
            required
          />
          <p className="text-sm text-gray-500">{formData.contenido.length}/550 caracteres</p>

          <label className="block mb-1 text-primary">Usuario</label>
          <input
            type="text"
            value={busquedaUsuario}
            onChange={handleBusquedaChange}
            placeholder="Buscar usuario"
            className="w-full p-2 mb-2 border rounded focus:border-primary focus:outline-none"
          />
          <Select
            options={usuariosFiltrados.map((usuario) => ({
              value: usuario._id,
              label: `${usuario.nombre} ${usuario.apellido}`,
            }))}
            value={usuariosFiltrados.find((usuario) => usuario._id === formData.userId)}
            onChange={(selectedOption) => handleInputChange({ target: { name: "userId", value: selectedOption.value } })}
            placeholder="Selecciona un usuario"
            className="w-full mb-3 h-[40px]"
            required
          />
        </div>

        {/* Columna Derecha */}
        <div>
          <label className="block mb-1 text-primary">Foto de Publicación</label>
          <div className="relative group/cover mb-3">
            <img
              src={fotoPublicacion || "/defaultImage.png"}
              className="h-52 w-full object-cover"
              alt="cover"
            />
            <div
              className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
              onClick={() => fotoPublicacionRef.current.click()}
            >
              <span className="w-5 h-5 text-white">Editar</span>
            </div>
            <input
              type="file"
              hidden
              accept="image/*"
              ref={fotoPublicacionRef}
              onChange={(e) => handleImgChange(e, "fotoPost")}
            />
          </div>

          <div>
            <label className="flex items-center mb-1 text-primary">
              <input
                type="checkbox"
                checked={esComunidad}
                onChange={toggleEsComunidad}
                className="mr-2"
              />
              ¿Es una publicación en comunidad?
            </label>
            {esComunidad && (
              <div>
                <label className="block mb-1 text-primary">Comunidad</label>
                <Select
                  options={comunidades.map((comunidad) => ({
                    value: comunidad._id,
                    label: comunidad.nombre,
                  }))}
                  value={comunidades.find((comunidad) => comunidad._id === comunidadSeleccionada)}
                  onChange={(selectedOption) => setComunidadSeleccionada(selectedOption.value)}
                  placeholder="Selecciona una comunidad"
                  className="w-full mb-3"
                />
              </div>
            )}
          </div>
        </div>

        {/* Botón de envío en la parte inferior, ocupando ambas columnas */}
        <div className="col-span-2">
          
          <button
            type="submit"
            className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950 mr-3 ml-[55%]"
            disabled={isCreatingPost}
          >
            {isCreatingPost ? "Creando..." : "Crear Publicación"}
          </button>

          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>

        </div>
      </form>
    )}
  </div>
</div>
  );
}

export default ModalCrearPublicacion;
