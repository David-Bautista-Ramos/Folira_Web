import { useState } from "react";

function ModalActualizarLibro({ isOpen, onClose }) {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [isbn, setIsbn] = useState("");
  const [saga, setSaga] = useState("");
  const [selectedGeneros, setSelectedGeneros] = useState([]);
  const [showGeneros, setShowGeneros] = useState(false);

  const generosDisponibles = [
    "Ficción",
    "No ficción",
    "Ciencia ficción",
    "Fantasía",
    "Misterio",
    "Romance",
    "Terror",
    "Biografía",
  ];

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const handleGeneroChange = (genero) => {
    if (selectedGeneros.includes(genero)) {
      setSelectedGeneros(selectedGeneros.filter((g) => g !== genero));
    } else {
      setSelectedGeneros([...selectedGeneros, genero]);
    }
  };

  const toggleGeneros = () => {
    setShowGeneros(!showGeneros);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div
        className="bg-white p-5 rounded-lg w-80 md:w-96 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
       
        <div className="border-b-2 border-primary pb-2 mb-5">
          <h2 className="text-lg text-center text-primary">ACTUALIZAR LIBRO</h2>
        </div>
        <div className="overflow-y-auto max-h-80 mb-5 text-[#503B31] text-lg modal-scrollbar">
          <label className="block mb-1  text-primary">Portada</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 mb-3 border border-gray-300 rounded focus:border-primary focus:outline-none"
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="max-w-full h-auto mb-3"
            />
          )}

          <label className="block mb-1 text-primary">Título</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del libro"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1  text-primary">ISBN</label>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="ISBN del libro"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1  text-primary">Fecha de publicación</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Fecha de publicación"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1 text-primary">Editorial</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Editorial"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1  text-primary">Autor</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Editorial"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1  text-primary">Sinopsis</label>
          <textarea
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sinopsis"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1  text-primary">Serie</label>
          <input
            type="text"
            value={saga}
            onChange={(e) => setSaga(e.target.value)}
            placeholder="Serie"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

          <div>
            <label className="block mb-1  text-primary">Generos</label>
            <button
              type="button"
              className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none text-gray-500 text-left"
              onClick={toggleGeneros}
            >
              Seleccionar Géneros {selectedGeneros.length > 0 ? `(${selectedGeneros.join(", ")})` : ""}
            </button>
            {showGeneros && (
              <div className="border  rounded p-2 mb-3">
                {generosDisponibles.map((genero) => (
                  <div key={genero} className="flex items-center text-gray-500">
                    <input
                      type="checkbox"
                      id={genero}
                      value={genero}
                      checked={selectedGeneros.includes(genero)}
                      onChange={() => handleGeneroChange(genero)}
                      className="mr-2"
                    />
                    <label htmlFor={genero}>{genero}</label>
                  </div>
                ))}
              </div>
            )}
          </div>

          
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950">
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalActualizarLibro;
