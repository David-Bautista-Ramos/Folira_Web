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
        className="bg-white p-5 rounded-lg w-80 md:w-[40%] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
      <div className="border-b-2 border-primary pb-2 mb-5">
        <h2 className="text-lg text-center text-primary">Actualizar Publicación</h2>
      </div>

        {loading ? (
          <p>Cargando...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (

          <div className="flex-1"> 
            <form
              onSubmit={handleSubmit}
              className="text-[#503B31] text-lg modal-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Columna izquierda */}
              <div>
                <label className="block mb-1 text-primary">Contenido</label>
                <textarea
                  name="contenido"
                  value={formData.contenido}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
                  required
                />
                
                <label className="block mb-1 text-primary">Foto de Publicación</label>
                <div className="relative group/cover">
                  <img
                    src={formData.fotoPublicacion || "/defaultImage.png"}
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
              </div>

              {/* Columna derecha */}
              <div>
                <label className="block mb-1 text-primary">Usuario</label>
                <Select
                  options={usuarios.map((usuario) => ({
                    value: usuario._id,
                    label: `${usuario.nombre} ${usuario.apellido}`
                  }))}
                  value={usuarios.find(user => user._id === formData.userId)}
                  onChange={(selectedOption) =>
                    handleInputChange({ target: { name: 'userId', value: selectedOption.value } })
                  }
                  className="mb-3"
                  placeholder="Selecciona un usuario"
                />

                <label className="block mb-2">Comunidad</label>
                <Select
                  options={comunidades.map((comunidad) => ({
                    value: comunidad._id,
                    label: comunidad.nombre
                  }))}
                  value={comunidades.find(comm => comm._id === formData.comunidadId)}
                  onChange={(selectedOption) =>
                    handleInputChange({ target: { name: 'comunidadId', value: selectedOption.value } })
                  }
                  className="mb-4"
                  placeholder="Selecciona una comunidad"
                  isClearable
                />
              </div>
            </form>
          </div>
        )}
        {/* Botones en la parte inferior */}
        <div className="flex justify-end mt-4 space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cerrar
          </button>
          <button
            type="submit"
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-950"
            disabled={isUpdatingPost}
          >
            {isUpdatingPost ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>
    </div>

  );
}

export default ModalActualizarPublicacion;
