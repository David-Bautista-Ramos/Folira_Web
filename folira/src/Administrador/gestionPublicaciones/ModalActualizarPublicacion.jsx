import { useState, useEffect, useRef } from "react";
import useUpdatePublicacion from "../../hooks/useUpdatePost"; // Hook de actualización
import Select from 'react-select';


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
    className="modal-box border rounded-md border-blue-950 shadow-md p-6 relative max-h-[85vh] max-w-[120vh] overflow-y-auto"
    onClick={(e) => e.stopPropagation()}
  >
    <h2 className="text-lg text-center mb-4">Actualizar Publicación</h2>

    {loading ? (
      <p>Cargando...</p>
    ) : error ? (
      <p>Error: {error}</p>
    ) : (
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Columna Izquierda */}
        <div className="col-span-2 md:col-span-1">
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
        </div>

        {/* Columna Derecha */}
        <div className="col-span-2 md:col-span-1">
          <label className="block mb-2">Usuario</label>
          <div className="relative mb-4">
            <Select
              options={usuarios.map((usuario) => ({
                value: usuario._id,
                label: usuario.nombre,
              }))}
              value={{
                value: formData.userId,
                label:
                  usuarios.find((user) => user._id === formData.userId)
                    ?.nombre || "Seleccione un usuario",
              }}
              onChange={(selectedOption) =>
                handleInputChange({
                  target: { name: "userId", value: selectedOption.value },
                })
              }
              className="react-select-container"
              classNamePrefix="react-select"
              required
            />
          </div>

          <label className="block mb-2">Comunidad</label>
          <div className="relative mb-4">
            <Select
              options={[
                { value: "", label: "Ninguna" },
                ...comunidades.map((comunidad) => ({
                  value: comunidad._id,
                  label: comunidad.nombre,
                })),
              ]}
              value={{
                value: formData.comunidadId,
                label:
                  comunidades.find(
                    (comunidad) => comunidad._id === formData.comunidadId
                  )?.nombre || "Seleccione una comunidad",
              }}
              onChange={(selectedOption) =>
                handleInputChange({
                  target: { name: "comunidadId", value: selectedOption.value },
                })
              }
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        </div>

        {/* Botón de actualización en una sola fila */}
        <div className="col-span-2">
          <button
            type="submit"
            className="px-4 py-2 border rounded bg-primary ml-[70%] text-white hover:bg-blue-950"
            disabled={isUpdatingPost}
          >
            {isUpdatingPost ? "Actualizando..." : "Actualizar"}
          </button>

          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 ml-4 rounded-md hover:bg-gray-400"
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

export default ModalActualizarPublicacion;
