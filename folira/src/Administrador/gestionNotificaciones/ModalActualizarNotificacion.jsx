
  import { useState, useEffect, useCallback } from "react";
  import useUpdateNotificacion from "../../hooks/useUpdateNotificacion";
  import toast from "react-hot-toast";
  import Select from 'react-select';


function ModalActualizarNotificacion({ isOpen, onClose, NotificacionId, obtenerNotificaciones, token }) {
  const [formData, setFormData] = useState({
    de: "",
    para: "",
    tipo: "",
    mensaje: "",
  });


    const [availableUsuarios, setAvailableUsuarios] = useState([]);
    const [selectedDeUsuario, setSelectedDeUsuario] = useState(""); // State for "de" user
    const [selectedParaUsuario, setSelectedParaUsuario] = useState(""); // State for "para" user
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

  const { updateNotificacion, isUpdatingNotificacion } = useUpdateNotificacion(NotificacionId);

  const fetchNotificacionDetalles = useCallback(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/notifications/notifiid/${NotificacionId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const notificacion = await response.json();
        setFormData({
          de: notificacion.de?._id || "",
          para: notificacion.para?._id || "",
          tipo: notificacion.tipo || "",
          mensaje: notificacion.mensaje || "",
        });
        setSelectedDeUsuario(notificacion.de?._id || "");
        setSelectedParaUsuario(notificacion.para?._id || "");
      } catch (error) {
        console.error("Error al obtener los detalles de la notificación:", error);
      }
    };

    fetchData();
  }, [NotificacionId, token]);

  useEffect(() => {
    if (isOpen && NotificacionId) {
      fetchNotificacionDetalles();
    }
  }, [isOpen, NotificacionId, fetchNotificacionDetalles]);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/notifications/allUsers')
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch users");
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data.usuarios)) {
            setAvailableUsuarios(data.usuarios);
            setError('');
          } else {
            throw new Error("La respuesta de usuarios no es un arreglo");
          }
        })
        .catch((error) => {
          console.error("Error al obtener usuarios:", error);
          setError("No se pudieron cargar los usuarios.");
          setAvailableUsuarios([]);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDeUsuarioChange = (selectedOption) => {
    setSelectedDeUsuario(selectedOption?.value || "");
  };

  const handleParaUsuarioChange = (selectedOption) => {
    setSelectedParaUsuario(selectedOption?.value || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateNotificacion({
        ...formData,
        para: selectedParaUsuario,
        de: selectedDeUsuario,
      });
      setFormData({
        de: "",
        para: "",
        tipo: "",
        mensaje: "",
      });
      setSelectedDeUsuario("");
      setSelectedParaUsuario("");
      onClose();
      obtenerNotificaciones();
    } catch (error) {
      console.error("Error al actualizar la notificación:", error);
      toast.error("Ocurrió un error al actualizar la notificación. Intente nuevamente.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg w-80 md:w-96 relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="border-b-2 border-primary pb-2 mb-5">
          <h2 className="text-lg text-center text-primary">ACTUALIZAR NOTIFICACIÓN</h2>
        </div>
        {loading && <div>Cargando usuarios...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading && !error && (
          <form onSubmit={handleSubmit}>
            <label className="block mb-1 text-primary">De</label>
            <Select
  options={availableUsuarios.map((usuario) => ({
    value: usuario._id,
    label: usuario.nombre,
    imgURL: usuario.fotoPerfil, // Agrega la URL de la imagen como propiedad
  }))}
  value={availableUsuarios
    .filter((usuario) => usuario._id === selectedDeUsuario)
    .map((usuario) => ({
      value: usuario._id,
      label: usuario.nombre,
      imgURL: usuario.fotoPerfil, // Agrega la URL de la imagen como propiedad
    }))[0] || null} // Asegura que solo se seleccione un valor o sea null
  onChange={handleDeUsuarioChange}
  className="w-full mb-3"
  placeholder="Seleccione un usuario"
  isClearable
  formatOptionLabel={(option) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={option.imgURL}
        alt="Perfil"
        style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px' }}
      />
      <span>{option.label}</span>
    </div>
  )}
/>

<label className="block mb-1 text-primary">Para</label>
<Select
  options={availableUsuarios.map((usuario) => ({
    value: usuario._id,
    label: usuario.nombre,
    imgURL: usuario.fotoPerfil, // Agrega la URL de la imagen como propiedad
  }))}
  value={availableUsuarios
    .filter((usuario) => usuario._id === selectedParaUsuario)
    .map((usuario) => ({
      value: usuario._id,
      label: usuario.nombre,
      imgURL: usuario.fotoPerfil, // Agrega la URL de la imagen como propiedad
    }))[0] || null} // Asegura que solo se seleccione un valor o sea null
  onChange={handleParaUsuarioChange}
  className="w-full mb-3"
  placeholder="Seleccione un usuario"
  isClearable
  formatOptionLabel={(option) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={option.imgURL}
        alt="Perfil"
        style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '8px' }}
      />
      <span>{option.label}</span>
    </div>
  )}
/>
            <label className='block mb-2'>Mensaje</label>
            <input
              type="text"
              name='mensaje'
              onChange={handleInputChange}
              value={formData.mensaje}
              placeholder="Puedes dejar un mensaje para el usuario"
              className="w-full p-2 mb-2 border rounded focus:border-primary focus:outline-none text-sm"
            />

            <label className="block mb-2">Tipo de Notificación:</label>
            <Select
              options={[
                { value: 'seguidor', label: 'Seguidor' },
                { value: 'like', label: 'Like' },
                { value: 'comunidad', label: 'Comunidad' },
                { value: 'denuncia', label: 'Denuncia' },
                { value: 'comentario', label: 'Comentario' },
              ]}
              value={formData.tipo ? { value: formData.tipo, label: formData.tipo.charAt(0).toUpperCase() + formData.tipo.slice(1) } : null}
              onChange={(selectedOption) => handleInputChange({ target: { name: 'tipo', value: selectedOption.value } })}
              className="w-full mb-4"
              placeholder="Seleccionar tipo"
              isClearable
              menuPortalTarget={document.body}
              styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              }}
              menuPosition="fixed"
              menuPlacement="bottom"
            />

            <div className="flex justify-end">
              
              <button
                className={`bg-primary mt-3 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-950 ${isUpdatingNotificacion ? "opacity-50 cursor-not-allowed" : ""}`}
                type="submit"
                disabled={isUpdatingNotificacion}
              >
                {isUpdatingNotificacion ? "Actualizando..." : "Actualizar"}
              </button>

              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mt-3 ml-4 hover:bg-gray-400" type="button" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ModalActualizarNotificacion;
