  import { useState, useEffect, useCallback } from "react";
  import useUpdateNotificacion from "../../hooks/useUpdateNotificacion";
  import toast from "react-hot-toast";
  import Select from 'react-select';

  function ModalActualizarNotificacion({ isOpen, onClose, NotificacionId, obtenerNotificaciones, token }) {
    const [formData, setFormData] = useState({
      de: "",
      para: "",
      tipo: "",
      mensaje:"",
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
            de: notificacion.de || "",
            para: notificacion.para || "",
            tipo: notificacion.tipo || "",
            mensaje: notificacion.mensaje || "",
          });
          setSelectedDeUsuario(notificacion.de._id || ""); // Correctly set "de" user
          setSelectedParaUsuario(notificacion.para._id || ""); // Correctly set "para" user
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

    const handleDeUsuarioChange = (e) => {
      setSelectedDeUsuario(e.target.value);
    };

    const handleParaUsuarioChange = (e) => {
      setSelectedParaUsuario(e.target.value);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await updateNotificacion({
          ...formData,
          para: selectedParaUsuario, // Use selected para user
          de: selectedDeUsuario, // Use selected de user
        });
        setFormData({
          de: "",
          para: "",
          tipo: "",
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
          }))}
          value={availableUsuarios
            .filter((usuario) => usuario._id === selectedDeUsuario)
            .map((usuario) => ({
              value: usuario._id,
              label: usuario.nombre,
            }))}
          onChange={(selectedOption) => handleDeUsuarioChange(selectedOption.value)}
          className="w-full mb-3"
          placeholder="Seleccione un usuario"
          isClearable
        />

        {/* Vista previa de la selección "De" */}
        {selectedDeUsuario && (
          <div className="flex items-center mt-2 p-2 border rounded shadow-sm">
            <img
              src={availableUsuarios.find((usuario) => usuario._id === selectedDeUsuario)?.fotoPerfil}
              alt="Foto del usuario"
              className="w-10 h-10 rounded-full mr-3"
            />
            <span>{availableUsuarios.find((usuario) => usuario._id === selectedDeUsuario)?.nombre}</span>
          </div>
        )}

        <label className="block mb-1 text-primary">Para</label>
        <Select
          options={availableUsuarios.map((usuario) => ({
            value: usuario._id,
            label: usuario.nombre,
          }))}
          value={availableUsuarios
            .filter((usuario) => usuario._id === selectedParaUsuario)
            .map((usuario) => ({
              value: usuario._id,
              label: usuario.nombre,
            }))}
          onChange={(selectedOption) => handleParaUsuarioChange(selectedOption.value)}
          className="w-full mb-3"
          placeholder="Seleccione un usuario"
          isClearable
        />

        {/* Vista previa de la selección "Para" */}
        {selectedParaUsuario && (
          <div className="flex items-center mt-2 p-2 border rounded shadow-sm">
            <img
              src={availableUsuarios.find((usuario) => usuario._id === selectedParaUsuario)?.fotoPerfil}
              alt="Foto del usuario"
              className="w-10 h-10 rounded-full mr-3"
            />
            <span>{availableUsuarios.find((usuario) => usuario._id === selectedParaUsuario)?.nombre}</span>
          </div>
        )}

          <label className='block mb-2'>Mensaje</label>
            <input
             type="text"
             name='mensaje'
             onChange={handleInputChange}
             value={formData.mensaje}
             placeholder="Puedes dejar un mesaje para el usuario"
             className="w-full p-2 mb-2 border rounded focus:border-primary focus:outline-none text-sm"
          />

        <label className="block mb-2">Tipo de Notificación:</label>
        <Select
          options={[
            { value: 'seguidor', label: 'Seguidor' },
            { value: 'like', label: 'Like' },
            { value: 'insignia', label: 'Insignia' },
            { value: 'denuncia', label: 'Denuncia' },
            { value: 'comentario', label: 'Comentario' },
          ]}
          value={formData.tipo ? { value: formData.tipo, label: formData.tipo.charAt(0).toUpperCase() + formData.tipo.slice(1) } : null}
          onChange={(selectedOption) => handleInputChange({ target: { name: 'tipo', value: selectedOption.value } })}
          className="w-full mb-4"
          placeholder="Seleccionar tipo"
          isClearable
          menuPortalTarget={document.body}  // Renderiza el menú en un portal
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),  // Asegura que el menú esté por encima del modal
            menu: (provided) => ({
              ...provided,
              animation: 'slideDown 0.3s ease',  // Aplica la animación
            }),
          }}
          menuPosition="fixed"  // Fija la posición del menú
          menuPlacement="bottom" // Asegúrate de que el menú se abra hacia abajo
        />


        <div className="flex justify-end">
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mt-3 ml-4 hover:bg-gray-400" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button
            className={`bg-primary mt-3 text-white px-4 py-2 rounded-md ml-2 hover:bg-blue-950 ${isUpdatingNotificacion ? " opacity-50 cursor-not-allowed" : ""}`}
            type="submit"
            disabled={isUpdatingNotificacion}
          >
            {isUpdatingNotificacion ? "Actualizando..." : "Actualizar"}
          </button>

        </div>
      </form>
    )}
  </div>
</div>

    );
  }

  export default ModalActualizarNotificacion;
