import { useState, useEffect, useRef, useCallback } from "react";
import useUpdateLibro from "../../hooks/useUpdateLibro";

function ModalActualizarLibro({ isOpen, onClose, libroId, obtenerLibros, token }) {
  const [formData, setFormData] = useState({
    titulo: "",
    isbn: "",
    calificacion: "",
    fechaPublicacion: "",
    editorial: "",
    sinopsis: "",
  });

  const [fotoLibro, setFotoLibro] = useState("");
  const [showAutores, setShowAutores] = useState(false);
  const [showGeneros, setShowGeneros] = useState(false);
  const [availableGeneros, setAvailableGeneros] = useState([]);
  const [availableAutores, setAvailableAutores] = useState([]);
  const [selectedGeneros, setSelectedGeneros] = useState([]);
  const [selectedAutores, setSelectedAutores] = useState([]);
  const fotoLibroRef = useRef(null);

  const { updateLibro, isUpdatingLibro } = useUpdateLibro(libroId);

  const fetchLibroDetalles = useCallback(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/libro/getlibros/${libroId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const libro = await response.json();
        setFormData({
          titulo: libro.titulo || "",
          isbn: libro.isbn || "",
          calificacion: libro.calificacion || "",
          fechaPublicacion: libro.fechaPublicacion? new Date(libro.fechaPublicacion).toISOString().split('T')[0] : "",
          editorial: libro.editorial || "",
          sinopsis: libro.sinopsis || "",
        });
        setFotoLibro(libro.portada || "");
        setSelectedGeneros(libro.generos.map(g => g._id) || []); // Asegúrate de que `libro.generos` sea un array de objetos
        setSelectedAutores(libro.autores.map(a => a._id) || []); // Asegúrate de que `libro.autores` sea un array de objetos
      } catch (error) {
        console.error("Error al obtener los detalles del libro:", error);
      }
    };

    fetchData();
  }, [libroId, token]);

  useEffect(() => {
    if (isOpen && libroId) {
      fetchLibroDetalles();
    }
  }, [isOpen, libroId, fetchLibroDetalles]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFotoLibro(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGeneroChange = (genero) => {
    if (selectedGeneros.includes(genero)) {
      setSelectedGeneros(selectedGeneros.filter((g) => g !== genero));
    } else {
      setSelectedGeneros([...selectedGeneros, genero]);
    }
  };

  const handleAutoresChange = (autorId) => {
    if (selectedAutores.includes(autorId)) {
      setSelectedAutores(selectedAutores.filter((id) => id !== autorId));
    } else {
      setSelectedAutores([...selectedAutores, autorId]);
    }
  };

  const toggleGeneros = () => setShowGeneros(!showGeneros);
  const toggleAutores = () => setShowAutores(!showAutores);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLibro({
        ...formData,
        generos: selectedGeneros,
        autores: selectedAutores,
        portada: fotoLibro,
      });
      setFormData({
        titulo: "",
        isbn: "",
        calificacion: "",
        fechaPublicacion: "",
        editorial: "",
        sinopsis: "",
      });
      setSelectedGeneros([]);
      setSelectedAutores([]);
      setFotoLibro("");
      onClose();
      obtenerLibros();
    } catch (error) {
      console.error("Error al actualizar el libro:", error);
    }
  };

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const response = await fetch("/api/geneLiter/getgeneros", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const generos = await response.json();
        setAvailableGeneros(generos);
      } catch (error) {
        console.error("Error al obtener los géneros literarios:", error);
      }
    };
    fetchGeneros();
  }, [token]);

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

  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
  <div className="bg-white p-5 rounded-lg w-80 md:w-[50%] max-h-[85vh] flex flex-col relative">
    <div className="border-b-2 border-primary pb-2 mb-5">
      <h2 className="text-lg text-center text-primary">ACTUALIZAR LIBRO</h2>
    </div>
    <div className="flex flex-grow overflow-y-auto">
      {/* Columna izquierda: Portada */}
      <div className="flex-shrink-0 w-[50%] pr-3">
        <label className="block mb-1 text-primary">Portada</label>
        <div className="relative group/cover">
          <img
            src={fotoLibro || "/cover.png"}
            className="h-[90%] w-full object-cover" // Reduce la altura aquí
            alt="cover image"
          />
          <div
            className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
            onClick={() => fotoLibroRef.current.click()}
          >
            <span className="w-5 h-5 text-white">Editar</span>
          </div>
          <input
            type="file"
            hidden
            accept="image/*"
            ref={fotoLibroRef}
            onChange={handleImgChange}
          />
        </div>

        <label className="block mb-1 mt-3 text-primary">Título</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleInputChange}
          placeholder="Nombre del libro"
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
        />

        <label className="block mb-1 text-primary">ISBN</label>
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleInputChange}
          placeholder="ISBN del libro"
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
        />

        <label className="block mb-1 text-primary">Fecha de publicación</label>
        <input
          type="date"
          name="fechaPublicacion"
          value={formData.fechaPublicacion}
          onChange={handleInputChange}
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
        />

        <label className="block mb-1 text-primary">Editorial</label>
        <input
          type="text"
          name="editorial"
          value={formData.editorial}
          onChange={handleInputChange}
          placeholder="Editorial"
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
        />
      </div>
      
      {/* Columna derecha: Campos de entrada */}
      <div className="w-2/3">
        <label className="block mb-1 text-primary">Sinopsis</label>
        <textarea
          name="sinopsis"
          value={formData.sinopsis}
          onChange={handleInputChange}
          placeholder="Sinopsis del libro"
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none h-20" // Ajusta la altura aquí
        />
        <label className="block mb-1 text-primary">Calificación</label>
        <textarea
          name="calificacion"
          value={formData.calificacion}
          onChange={handleInputChange}
          placeholder="Calificación del libro"
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none h-20" // Ajusta la altura aquí
        />

        <div>
          <h3 className="block mb-1 text-primary">Géneros:</h3>
          <button type="button" onClick={toggleGeneros} className="bg-primary text-white p-2 rounded w-full mb-3">Seleccionar</button>
        </div>
        {showGeneros && (
          <div className="max-h-24 overflow-y-auto border p-2 mb-3">
            {availableGeneros.map((genero) => (
              <label key={genero._id} className="block">
                <input
                  type="checkbox"
                  checked={selectedGeneros.includes(genero._id)}
                  onChange={() => handleGeneroChange(genero._id)}
                />
                {genero.nombre}
              </label>
            ))}
          </div>
        )}

        <div>
          <h3 className="block mb-1 text-primary">Autores:</h3>
          <button type="button" onClick={toggleAutores} className="bg-primary text-white p-2 rounded w-full mb-3">Seleccionar</button>
        </div>
        {showAutores && (
          <div className="max-h-24 overflow-y-auto border p-2 mb-3">
            {availableAutores.map((autor) => (
              <label key={autor._id} className="block">
                <input
                  type="checkbox"
                  checked={selectedAutores.includes(autor._id)}
                  onChange={() => handleAutoresChange(autor._id)}
                />
                {autor.nombre}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>

    <div className="flex justify-end mt-auto">

    <button
        className={`bg-primary mt-3 text-white px-4 py-2 rounded-md hover:bg-blue-950 ${isUpdatingLibro ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={handleSubmit}
        disabled={isUpdatingLibro}
      >
        {isUpdatingLibro ? "Actualizando..." : "Actualizar"}
      </button>
      
      <button
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mt-3 ml-4  hover:bg-gray-400"
        onClick={onClose}
      >
        Cancelar
      </button>
      
    </div>

  </div>
</div>

  );
} 

export default ModalActualizarLibro;
