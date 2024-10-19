import { useEffect, useState } from "react";
import useUpdateResena from "../../hooks/useUpdateReseña";

const ModalActualizarReseña = ({
  isOpen,
  onClose,
  resenaId,
  obtenerResenas,
  token,
}) => {
  const [formData, setFormData] = useState({
    contenido: "",
    calificacion: 0,
  });

  const [availableAutores, setAvailableAutores] = useState([]);
  const [availableLibros, setAvailableLibros] = useState([]);
  const [availableUsuarios, setAvailableUsuarios] = useState([]);
  const [selectedAutores, setSelectedAutores] = useState([]);
  const [selectedLibros, setSelectedLibros] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showAutores, setShowAutores] = useState(false);
  const [showLibros, setShowLibros] = useState(false);

  const { updateResena, isUpdatingResena } = useUpdateResena(resenaId);

  useEffect(() => {
    const fetchReseña = async () => {
      if (isOpen && resenaId) {
        try {
          const response = await fetch(`/api/resenas/getresenas/${resenaId}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          const resenaData = await response.json();
          setFormData({
            contenido: resenaData.contenido || "",
            calificacion: resenaData.calificacion || 0,
          });
          setSelectedAutores(resenaData.idAutor || []);
          setSelectedLibros(resenaData.idLibro || []);
          setSelectedUsuario(resenaData.idUsuario || null);
        } catch (error) {
          console.error("Error al obtener la reseña:", error);
        }
      }
    };
    fetchReseña();
  }, [isOpen, resenaId, token]);

  useEffect(() => {
    const fetchAutores = async () => {
      try {
        const response = await fetch("/api/autror/autores", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const autores = await response.json();
        setAvailableAutores(autores);
      } catch (error) {
        console.error("Error al obtener los autores:", error);
      }
    };
    fetchAutores();
  }, [token]);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const response = await fetch("/api/libro/getlibros", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const libros = await response.json();
        setAvailableLibros(libros);
      } catch (error) {
        console.error("Error al obtener los libros:", error);
      }
    };
    fetchLibros();
  }, [token]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("/api/users/allUsers", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const usuarios = await response.json();
        setAvailableUsuarios(usuarios);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    fetchUsuarios();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUsuarioChange = (usuarioId) => {
    setSelectedUsuario(usuarioId);
  };

  const handleAutoresChange = (autorId) => {
    setSelectedAutores((prev) =>
      prev.includes(autorId)
        ? prev.filter((id) => id !== autorId)
        : [...prev, autorId]
    );
  };

  const handleLibrosChange = (libroId) => {
    if (selectedLibros.includes(libroId)) {
      setSelectedLibros(selectedLibros.filter((id) => id !== libroId));
    } else {
      setSelectedLibros([...selectedLibros, libroId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateResena({
        ...formData,
        libros: selectedLibros,
        autores: selectedAutores,
        usuario: selectedUsuario,
      });
      setFormData({ contenido: "", calificacion: 0 });
      setSelectedLibros([]);
      setSelectedAutores([]);
      setSelectedUsuario(null);
      onClose();
      obtenerResenas();
    } catch (error) {
      console.error("Error al actualizar la reseña:", error);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Actualizar Reseña</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="contenido"
              className="block text-sm font-medium text-gray-700"
            >
              Contenido
            </label>
            <textarea
              id="contenido"
              name="contenido"
              rows="4"
              value={formData.contenido}
              onChange={handleInputChange}
              className="mt-1 block w-full p-2 border border-primary rounded-md"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              htmlFor="calificacion"
              className="block text-sm font-medium text-gray-700"
            >
              Calificación
            </label>
            <input
              type="number"
              id="calificacion"
              name="calificacion"
              value={formData.calificacion}
              onChange={handleInputChange}
              min="1"
              max="5"
              required
              className="mt-1 block w-full p-2 border border-primary rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 text-primary">Usuario</label>
            <select
              value={selectedUsuario || ""}
              onChange={(e) => handleUsuarioChange(e.target.value)}
              className="block w-full p-2 border border-primary rounded-md mb-4"
              required
            >
              <option value="" disabled>
                Selecciona un usuario
              </option>
              {availableUsuarios.map((usuario) => (
                <option key={usuario._id} value={usuario._id}>
                  {usuario.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-primary">Autores</label>
            <button
              type="button"
              onClick={() => setShowAutores(!showAutores)}
              className="bg-primary text-white p-2 rounded mb-2"
            >
              {showAutores ? "Ocultar Autores" : "Mostrar Autores"}
            </button>
            {showAutores && (
              <div className="flex flex-wrap">
                {availableAutores.map((autor) => (
                  <div key={autor._id} className="flex items-center mr-2">
                    <input
                      type="checkbox"
                      checked={selectedAutores.includes(autor._id)}
                      onChange={() => handleAutoresChange(autor._id)}
                      className="mr-1"
                    />
                    <span>{autor.nombre}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 text-primary">Libros</label>
            <button
              type="button"
              onClick={() => setShowLibros(!showLibros)}
              className="bg-primary text-white p-2 rounded mb-2"
            >
              {showLibros ? "Ocultar Libros" : "Mostrar Libros"}
            </button>
            {showLibros && (
              <div className="flex flex-wrap">
                {Array.isArray(availableLibros) &&
                  availableLibros.map((libro) => (
                    <div
                      key={libro._id}
                      className="flex items-center mr-4 mb-2"
                    >
                      <input
                        type="checkbox"
                        checked={selectedLibros.includes(libro._id)}
                        onChange={() => handleLibrosChange(libro._id)}
                        className="mr-2"
                      />
                      <span>{libro.titulo}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 border border-gray-300 rounded-md px-4 py-2"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUpdatingResena}
              className={`bg-primary text-white px-4 py-2 rounded-md ${
                isUpdatingResena ? "opacity-50" : ""
              }`}
            >
              {isUpdatingResena ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalActualizarReseña;
