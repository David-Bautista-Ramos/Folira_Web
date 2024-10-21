import { useState, useRef, useEffect } from "react";
import useCreatePublicacion from "../../hooks/useCreatePost";

function ModalCrearPublicacion({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    contenido: "",
    userId: "",
    comunidadId: "", // Aquí se mantendrá el ID de la comunidad
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

  // Función para manejar el cambio en las imágenes
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
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }

    try {
      await createPost({
        ...formData,
        fotoPublicacion,
        comunidadId: esComunidad ? comunidadSeleccionada : "", // Envío de comunidadId correcto
      });

      // Resetear el formulario después de la creación
      setFormData({
        contenido: "",
        userId: usuarios[0]?._id || "", // Para manejar caso sin usuarios
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
        className="bg-white p-5 rounded-lg w-80 md:w-96 relative overflow-hidden"
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
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-80 text-[#503B31] text-lg modal-scrollbar">
            <label className="block mb-1 text-primary">Contenido</label>
            <textarea
              name="contenido"
              value={formData.contenido}
              onChange={handleInputChange}
              placeholder="Escribe tu publicación"
              className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
              required
            />

            <label className="block mb-1 text-primary">Foto de Publicación</label>
            <div className="relative group/cover">
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

            <label className="block mb-1 text-primary">Usuario</label>
            <select
              name="userId"
              value={formData.userId}
              onChange={handleInputChange}
              className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
              required
            >
              {usuarios.map((usuario) => (
                <option key={usuario._id} value={usuario._id}>
                  {usuario.nombre} {usuario.apellido}
                </option>
              ))}
            </select>

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
                  <select
                    name="comunidadId"
                    value={comunidadSeleccionada}
                    onChange={(e) => setComunidadSeleccionada(e.target.value)}
                    className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
                  >
                    {comunidades.map((comunidad) => (
                      <option key={comunidad._id} value={comunidad._id}>
                        {comunidad.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90 transition duration-200"
              disabled={isCreatingPost}
            >
              {isCreatingPost ? "Creando..." : "Crear Publicación"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ModalCrearPublicacion;
