import { useState, useRef, useEffect } from "react";
import useCreateLibro from "../../hooks/useCreateLibro";

function ModalCrearLibro({ isOpen, onClose, token }) {
  const [formData, setFormData] = useState({
    titulo: "",
    isbn: "",
    saga: "",
    fechaPublicacion: "",
    editorial: "",
    autor: "",
    sinopsis: "",
  });

  const [fotoLibro, setFotoLibro] = useState("");
  const [availableGeneros, setAvailableGeneros] = useState([]); // Store available genres
  const [availableAutor, setAvailableAutores] = useState([]); // Store available genres
  const [selectedGeneros, setSelectedGeneros] = useState([]);
  const [selectedAutores, setSelectedAutores] = useState([]);
  const [showGeneros, setShowGeneros] = useState(false);
  const [showAutores, setshowAutores] = useState(false);
  const fotoLibroRef = useRef(null);
  const { createLibro, isCreatingLibro } = useCreateLibro();

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
      reader.onload = () => {
        setFotoLibro(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneroChange = (genero) => {
    setSelectedGeneros((prevSelected) => {
      if (prevSelected.includes(genero)) {
        return prevSelected.filter((g) => g !== genero);
      } else {
        return [...prevSelected, genero];
      }
    });
  };
  const handleAutoresChange = (autor) => {
    setSelectedAutores((prevSelected) => {
      if (prevSelected.includes(autor)) {
        return prevSelected.filter((g) => g !== autor);
      } else {
        return [...prevSelected, autor];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLibro({
        ...formData,
        generos: selectedGeneros,
        portada: fotoLibro, // Correctly pass the fotoLibro state
      });
      // Optionally, clear the form after submission
      setFormData({
        titulo: "",
        isbn: "",
        saga: "",
        fechaPublicacion: "",
        editorial: "",
        autor: "",
        sinopsis: "",
      });
      setSelectedGeneros([]);
      setFotoLibro("");
      onClose(); // Close modal on successful creation
    } catch (error) {
      console.error("Error creating book:", error);
    }
  };

  const toggleGeneros = () => setShowGeneros(!showGeneros);
  const toggleAutores = () => setshowAutores(!showAutores);


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
        setAvailableGeneros(generos); // Store available genres for display
      } catch (error) {
        console.error("Error al obtener los géneros literarios:", error);
      }
    };
    fetchGeneros();
  }, [token]);

  useEffect(() => {
    const fetchAutores = async () => {
      try {
        const response = await fetch("/api/autores/autores", { // Corrected URL
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const autores = await response.json();
        setAvailableAutores(autores); // Set autores
      } catch (error) {
        console.error("Error al obtener los autores:", error);
      }
    };
    fetchAutores();
  }, [token]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-5 rounded-lg w-80 md:w-96 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b-2 border-primary pb-2 mb-5">
          <h2 className="text-lg text-center text-primary">CREAR LIBRO</h2>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-80 text-[#503B31] text-lg modal-scrollbar">
          <div className="relative group/cover">
            <img
              src={fotoLibro || "/cover.png"}
              className="h-52 w-full object-cover"
              alt="cover image"
            />
          </div>
          <div
            className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
            onClick={() => fotoLibroRef.current.click()}
          >
            <span className="w-5 h-5 text-white">Editar</span>
          </div>

          <label className="block mb-1 text-primary">Portada</label>
          <input
            type="file"
            hidden
            accept="image/*"
            ref={fotoLibroRef}
            onChange={handleImgChange}
          />
          <div className="avatar absolute -bottom-16 left-4">
            <div className="w-32 rounded-full relative group/avatar bottom-44 left-8">
              <img src={fotoLibro || "/avatar-placeholder.png"} alt="profile avatar" />
              <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                <span
                  className="w-4 h-4 text-white"
                  onClick={() => fotoLibroRef.current.click()}
                >
                  Editar
                </span>
              </div>
            </div>
          </div>
          <label className="block mb-1 text-primary">Título</label>
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

          <label className="block mb-1 text-primary">Fecha de Publicación</label>
          <input
            type="text"
            name="fechaPublicacion"
            value={formData.fechaPublicacion}
            onChange={handleInputChange}
            placeholder="Fecha de publicación"
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

          <label className="block mb-1 text-primary">Sinopsis</label>
          <textarea
            name="sinopsis"
            value={formData.sinopsis}
            onChange={handleInputChange}
            placeholder="Sinopsis"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1 text-primary">Saga</label>
          <input
            type="text"
            name="saga"
            value={formData.saga}
            onChange={handleInputChange}
            placeholder="Saga"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />

        <div>
            <label className="block mb-1 text-primary">Autores</label>
            <button
              type="button"
              onClick={toggleAutores}
              className="bg-primary text-white p-2 rounded mb-2"
            >
              {showAutores ? "Ocultar Autores" : "Mostrar Autores"}
            </button>
            {showAutores && (
              <div className="flex flex-wrap">
                {availableAutor.map((autor) => (
                  <div key={autor.id} className="flex items-center mr-2">
                    <input
                      type="checkbox"
                      checked={selectedAutores.includes(autor.name)}
                      onChange={() => handleAutoresChange(autor.name)}
                      className="mr-1"
                    />
                    <span>{autor.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 text-primary">Géneros</label>
            <button
              type="button"
              onClick={toggleGeneros}
              className="bg-primary text-white p-2 rounded mb-2"
            >
              {showGeneros ? "Ocultar Géneros" : "Mostrar Géneros"}
            </button>
            {showGeneros && (
              <div className="flex flex-wrap">
                {availableGeneros.map((genero) => (
                  <div key={genero.id} className="flex items-center mr-2">
                    <input
                      type="checkbox"
                      checked={selectedGeneros.includes(genero.name)}
                      onChange={() => handleGeneroChange(genero.name)}
                      className="mr-1"
                    />
                    <span>{genero.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded mt-3"
            disabled={isCreatingLibro}
          >
            {isCreatingLibro ? "Creando..." : "Crear Libro"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModalCrearLibro;
