import { useState, useEffect, useCallback } from "react";
import useUpdateNotificacion from "../../hooks/useUpdateNotificacion";

function ModalActualizarNotificacion({ isOpen, onClose, NotificacionId, obtenerNotificaciones, token }) {
  const [formData, setFormData] = useState({
    de: "",
    para: "",
    tipo: "",
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
        const response = await fetch(`/api/notifications/notifi/${NotificacionId}`, {
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
        });
        setSelectedDeUsuario(notificacion.de || ""); // Correctly set "de" user
        setSelectedParaUsuario(notificacion.para || ""); // Correctly set "para" user
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
      alert("Ocurrió un error al actualizar la notificación. Intente nuevamente.");
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
            <select
              name="de"
              value={selectedDeUsuario}
              onChange={handleDeUsuarioChange}
              className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
            >
              <option value="">Seleccione un usuario</option>
              {availableUsuarios.map((usuario) => (
                <option key={usuario._id} value={usuario._id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>

            <label className="block mb-1 text-primary">Para</label>
            <select
              name="para"
              value={selectedParaUsuario}
              onChange={handleParaUsuarioChange}
              className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
            >
              <option value="">Seleccione un usuario</option>
              {availableUsuarios.map((usuario) => (
                <option key={usuario._id} value={usuario._id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>

            <label className="block mb-2">Tipo de Notificación:</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            >
              <option value="">Seleccionar tipo</option>
              <option value="seguidor">Seguidor</option>
              <option value="like">Like</option>
              <option value="insignia">Insignia</option>
              <option value="denuncia">Denuncia</option>
              <option value="comentario">Comentario</option>
            </select>

            <div className="flex justify-end">
              <button className="btn-outline bg-primary text-white p-2 rounded w-full mt-4 mr-2" type="button" onClick={onClose}>
                Cancelar
              </button>
              <button
                className={`bg-primary text-white p-2 rounded w-full mt-4${isUpdatingNotificacion ? " opacity-50 cursor-not-allowed" : ""}`}
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
