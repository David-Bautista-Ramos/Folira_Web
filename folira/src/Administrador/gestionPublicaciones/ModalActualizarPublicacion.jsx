import { useState, useEffect, useRef } from "react";
import useUpdatePublicacion from "../../hooks/useUpdatePost"; // Hook de actualización

function ModalActualizarPublicacion({ isOpen, onClose, publicacionId }) {
  const [formData, setFormData] = useState({
    contenido: "",
    fotoPublicacion: "",
    userId: "",
    comunidadId: "", // Ajuste en el nombre del campo para consistencia
  });

  const [usuarios, setUsuarios] = useState([]);
  const [comunidades, setComunidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fotoPublicacionRef = useRef(null);
  const { updatePost, isUpdatingPost } = useUpdatePublicacion(publicacionId);

  // Cargar la publicación, usuarios y comunidades al abrir el modal
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postResponse = await fetch(`/api/posts/userPost/${publicacionId}`);
        if (!postResponse.ok) throw new Error("Error al obtener la publicación");

        const postData = await postResponse.json();

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

        // Poner los datos de la publicación en el formulario
        setFormData({
          contenido: postData.contenido,
          fotoPublicacion: postData.fotoPublicacion || "",
          userId: postData.user?._id || usuariosData[0]?._id || "",
          comunidadId: postData.idComunidad?._id || "",
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && publicacionId) fetchData();
  }, [isOpen, publicacionId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFormData((prev) => ({ ...prev, fotoPublicacion: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(formData); // Actualizar la publicación
      onClose(); // Cerrar el modal después de actualizar
    } catch (error) {
      console.error("Error al actualizar la publicación:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-5 rounded-lg w-80 md:w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg text-center mb-4">Actualizar Publicación</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">Contenido</label>
            <textarea
              name="contenido"
              value={formData.contenido}
              onChange={handleInputChange}
              className="w-full p-2 border rounded mb-4"
              required
            />

            <label className="block mb-2">Foto de Publicación</label>
            <div className="relative group">
              <img
                src={formData.fotoPublicacion || "/defaultImage.png"}
                alt="Foto"
                className="w-full h-48 object-cover mb-2"
              />
              <input
                type="file"
                accept="image/*"
                ref={fotoPublicacionRef}
                onChange={handleImgChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fotoPublicacionRef.current.click()}
                className="mt-2 text-blue-500"
              >
                Cambiar Imagen
              </button>
            </div>

            <label className="block mb-2">Usuario</label>
            <div className="relative mb-4">
              <div className="w-full p-2 border rounded bg-white cursor-pointer">
                <div className="flex items-center">
                  {formData.userId && (
                    <img
                      src={usuarios.find((user) => user._id === formData.userId)?.fotoPerfil || 'default-profile.png'}
                      alt="Foto de perfil"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <span>
                    {usuarios.find((user) => user._id === formData.userId)?.nombre || 'Seleccione un usuario'}
                  </span>
                </div>
              </div>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleInputChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                required
              >
                {usuarios.map((usuario) => (
                  <option key={usuario._id} value={usuario._id}>
                    {usuario.nombre}
                  </option>
                ))}
              </select>
            </div>


            <label className="block mb-2">Comunidad</label>
            <div className="relative mb-4">
              <div className="w-full p-2 border rounded bg-white cursor-pointer">
                <div className="flex items-center">
                  {formData.comunidadId && (
                    <img
                      src={comunidades.find((comunidad) => comunidad._id === formData.comunidadId)?.fotoComunidad || 'default-community.png'}
                      alt="Imagen de la comunidad"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  )}
                  <span>
                    {comunidades.find((comunidad) => comunidad._id === formData.comunidadId)?.nombre || 'Seleccione una comunidad'}
                  </span>
                </div>
              </div>
              <select
                name="comunidadId"
                value={formData.comunidadId}
                onChange={handleInputChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              >
                <option value="">Ninguna</option>
                {comunidades.map((comunidad) => (
                  <option key={comunidad._id} value={comunidad._id}>
                    {comunidad.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded mt-4"
              disabled={isUpdatingPost}
            >
              {isUpdatingPost ? "Actualizando..." : "Actualizar"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ModalActualizarPublicacion;
