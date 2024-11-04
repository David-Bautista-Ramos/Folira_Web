import { useEffect, useState } from "react";
import Select from "react-select"; // Importa react-select
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
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [selectedAutor, setSelectedAutor] = useState(null);
  const [selectedLibro, setSelectedLibro] = useState(null);

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
          setSelectedUsuario(resenaData.idUsuario?._id || null);
          setSelectedAutor(resenaData.idAutor ? resenaData.idAutor._id : null);
          setSelectedLibro(resenaData.idLibro ? resenaData.idLibro._id : null);
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
        setAvailableUsuarios(usuarios.map(usuario => ({ value: usuario._id, label: usuario.nombre })));
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
        setAvailableAutores(autores.map(autor => ({ value: autor._id, label: autor.nombre })));
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
        setAvailableLibros(libros.map(libro => ({ value: libro._id, label: libro.titulo })));
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

  const handleUsuarioChange = (selectedOption) => {
    setSelectedUsuario(selectedOption);
  };

  const handleAutorChange = (selectedOption) => {
    setSelectedAutor(selectedOption);
  };

  const handleLibroChange = (selectedOption) => {
    setSelectedLibro(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        let updatedData = {
            ...formData,
            idUsuario: selectedUsuario?.value,
        };

        // Solo incluir idAutor o idLibro si están seleccionados
        if (selectedAutor) {
            updatedData.idAutor = selectedAutor.value;
        } 
        if (selectedLibro) {
            updatedData.idLibro = selectedLibro.value;
        }

        await updateResena(updatedData);
        setFormData({ contenido: "", calificacion: 0 });
        setSelectedUsuario(null);
        setSelectedAutor(null);
        setSelectedLibro(null);
        onClose();
        obtenerResenas();
    } catch (error) {
        console.error("Error al actualizar la reseña:", error);
    }
};

const autoResizeTextarea = (e) => {
  e.target.style.height = "auto"; // Resetea la altura
  e.target.style.height = `${e.target.scrollHeight}px`; // Ajusta a la nueva altura
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
  <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">Actualizar Reseña</h2>
    </div>
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Columna izquierda */}
        
        <div className="flex flex-col mb-4 justify-end">
          <label htmlFor="contenido" className="block text-sm font-medium text-gray-700">
            Contenido
          </label>
          <textarea
            id="contenido"
            name="contenido"
            rows="3" // Tamaño fijo en filas
            value={formData.contenido}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-primary rounded-md resize-none overflow-y-auto"
            required
            style={{ height: '100px', maxHeight: '200px' }} // Tamaño fijo en height y maxHeight
          ></textarea>
        </div>

        <div className="flex flex-col mb-4  justify-end">
          <label htmlFor="calificacion" className="block text-sm font-medium text-gray-700">
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

        {/* Columna derecha */}
        <div className="flex flex-col mb-4 justify-end ">
          <label className="block mb-1 text-primary">Usuario</label>
          <Select
            value={selectedUsuario}
            onChange={handleUsuarioChange}
            options={availableUsuarios}
            placeholder="Selecciona un usuario"
            required
          />
        </div>

        <div className="flex flex-col mb-4 justify-end">
          <label className="block mb-1 text-primary">Autor</label>
          <Select
            value={selectedAutor}
            onChange={handleAutorChange}
            options={availableAutores}
            placeholder="Selecciona un autor"
          />
        </div>

        <div className="flex flex-col mb-4 justify-end">
          <label className="block mb-1 text-primary">Libro</label>
          <Select
            value={selectedLibro}
            onChange={handleLibroChange}
            options={availableLibros}
            placeholder="Selecciona un libro"
          />
        </div>
      </div>

      {/* Contenedor de botones */}
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
          className={`bg-primary text-white px-4 py-2 rounded-md ${isUpdatingResena ? "opacity-50" : ""}`}
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
