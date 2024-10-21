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

  const [availableUsuarios, setAvailableUsuarios] = useState([]);
  const [availableAutores, setAvailableAutores] = useState([]);
  const [availableLibros, setAvailableLibros] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState("");
  const [selectedAutor, setSelectedAutor] = useState("");
  const [selectedLibro, setSelectedLibro] = useState("");

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

          console.log("Reseña data:", resenaData);

          setFormData({
            contenido: resenaData.contenido || "",
            calificacion: resenaData.calificacion || 0,
          });
          setSelectedUsuario(resenaData.idUsuario?._id || ""); // Verifica la existencia del usuario
          setSelectedAutor(resenaData.idAutor ? resenaData.idAutor._id : ""); // Verifica la existencia del autor
          setSelectedLibro(resenaData.idLibro ? resenaData.idLibro._id : ""); // Verifica la existencia del libro
        } catch (error) {
          console.error("Error al obtener la reseña:", error);
        }
      }
    };
    fetchReseña();
  }, [isOpen, resenaId, token]);
  
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUsuarioChange = (e) => {
    setSelectedUsuario(e.target.value);
  };

  const handleAutorChange = (e) => {
    setSelectedAutor(e.target.value);
  };

  const handleLibroChange = (e) => {
    setSelectedLibro(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        let updatedData = {
            ...formData,
            idUsuario: selectedUsuario,
        };

        // Solo incluir idAutor o idLibro si están seleccionados
        if (selectedAutor) {
            updatedData.idAutor = selectedAutor;
        } else if (selectedLibro) {
            updatedData.idLibro = selectedLibro;
        }

        await updateResena(updatedData);
        setFormData({ contenido: "", calificacion: 0 });
        setSelectedUsuario("");
        setSelectedAutor("");
        setSelectedLibro("");
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

          <div className="mb-4">
            <label className="block mb-1 text-primary">Usuario</label>
            <select
              value={selectedUsuario}
              onChange={handleUsuarioChange}
              className="block w-full p-2 border border-primary rounded-md"
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

          <div className="mb-4">
            <label className="block mb-1 text-primary">Autor</label>
            <select
              value={selectedAutor}
              onChange={handleAutorChange}
              className="block w-full p-2 border border-primary rounded-md"
            >
              <option value="" disabled>
                Selecciona un autor
              </option>
              {availableAutores.map((autor) => (
                <option key={autor._id} value={autor._id}>
                  {autor.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-primary">Libro</label>
            <select
              value={selectedLibro}
              onChange={handleLibroChange}
              className="block w-full p-2 border border-primary rounded-md"
            >
              <option value="" disabled>
                Selecciona un libro
              </option>
              {availableLibros.map((libro) => (
                <option key={libro._id} value={libro._id}>
                  {libro.titulo}
                </option>
              ))}
            </select>
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
