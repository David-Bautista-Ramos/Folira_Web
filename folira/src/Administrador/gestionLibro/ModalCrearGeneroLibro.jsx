import { useState } from "react";
import useCreateGenero from "../../hooks/useCreateGenero";

function ModalCrearGenero({ isOpen, onClose , obtenerGenerosLiterarios}) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  });
  const [fotoGenero, setFotoGenero] = useState(null);
  const { createComuniad, isCreatingComunidad } = useCreateGenero();

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFotoGenero(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createComuniad({ ...formData, fotoGenero });
    setFormData({ nombre: "", descripcion: "" });
    setFotoGenero(null);
    onClose();
    obtenerGenerosLiterarios();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <form
        className="bg-white p-5 rounded-lg max-w-md w-full shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg text-center text-gray-800 mb-4">Crear Género</h2>

        <label className="block mb-1 text-gray-700">Foto del género</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImgChange}
          className="w-full p-2 mb-3 border rounded focus:border-primary"
        />
        {fotoGenero && (
          <img
            src={fotoGenero}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-3" // Estilo circular
          />
        )}

        <label className="block mb-1 text-gray-700">Nombre del género</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          placeholder="Nombre del género"
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
        />

        <label className="block mb-1 text-gray-700">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleInputChange}
          placeholder="Descripción"
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={onClose}
            type="button"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-950"
            disabled={isCreatingComunidad}
          >
            {isCreatingComunidad ? "Creando..." : "Crear Género"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModalCrearGenero;
