import { useState, useEffect } from "react";

const ModalCrearReseña = ({ isOpen, onClose, token }) => {
  const [contenido, setContenido] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [availableAutores, setAvailableAutores] = useState([]);
  const [availableLibros, setAvailableLibros] = useState([]);
  const [selectedAutores, setSelectedAutores] = useState([]);
  const [selectedLibros, setSelectedLibros] = useState([]);
  const [showAutores, setShowAutores] = useState(false);
  const [showLibros, setShowLibros] = useState(false);

  useEffect(() => {
    const fetchAutores = async () => {
      try {
        const response = await fetch("/api/autror/autores", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const libros = await response.json();
        setAvailableLibros(libros);
      } catch (error) {
        console.error("Error al obtener los libros:", error);
      }
    };
    fetchLibros();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevaResena = {
      contenido,
      calificacion,
      autores: selectedAutores,
      libros: selectedLibros,
    };

    try {
      const response = await fetch("/api/resenas/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevaResena),
      });

      if (!response.ok) {
        throw new Error("Error al crear la reseña");
      }

      const data = await response.json();
      console.log("Reseña creada con éxito:", data);

      onClose();
    } catch (error) {
      console.error("Error al crear la reseña:", error.message);
      alert("Hubo un problema al crear la reseña.");
    }
  };

  const toggleAutores = () => setShowAutores(!showAutores);
  const toggleLibros = () => setShowLibros(!showLibros);

  const handleAutoresChange = (autorId) => {
    setSelectedAutores((prev) =>
      prev.includes(autorId)
        ? prev.filter((id) => id !== autorId)
        : [...prev, autorId]
    );
  };

  const handleLibrosChange = (libroId) => {
    setSelectedLibros((prev) =>
      prev.includes(libroId)
        ? prev.filter((id) => id !== libroId)
        : [...prev, libroId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Crear Reseña</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="contenido" className="block text-sm font-medium text-gray-700">
              Contenido
            </label>
            <textarea
              id="contenido"
              rows="4"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="mt-1 block w-full p-2 border border-primary rounded-md"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="calificacion" className="block text-sm font-medium text-gray-700">
              Calificación
            </label>
            <input
              type="number"
              id="calificacion"
              value={calificacion}
              onChange={(e) => setCalificacion(Number(e.target.value))}
              min="1"
              max="5"
              required
              className="mt-1 block w-full p-2 border border-primary rounded-md"
            />
          </div>
          <div>
            <label className="block mb-1 text-primary">Autores</label>
            <button type="button" onClick={toggleAutores} className="bg-primary text-white p-2 rounded mb-2">
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
            <button type="button" onClick={toggleLibros} className="bg-primary text-white p-2 rounded mb-2">
              {showLibros ? "Ocultar Libros" : "Mostrar Libros"}
            </button>
            {showLibros && (
              <div className="flex flex-wrap">
                {availableLibros.map((libro) => (
                  <div key={libro._id} className="flex items-center mr-2">
                    <input
                      type="checkbox"
                      checked={selectedLibros.includes(libro._id)}
                      onChange={() => handleLibrosChange(libro._id)}
                      className="mr-1"
                    />
                    <span>{libro.titulo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearReseña;
