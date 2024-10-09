import { useState } from "react";
import useCreateAutor from "../../hooks/useCreateAutor";

function ModalCrearAutor({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    seudonimo: "",
    fechaNacimiento: "",
    pais: "",
    biografia: "",
  });

  const { createAutor, isCreatingAutor } = useCreateAutor();
  const [fotoAutor, setFotoAutor] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFotoAutor(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Enviar datos del formulario y las imágenes
    await createAutor({
      ...formData,
      fotoAutor,
    });
    onClose(); // Close the modal after creation
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <form
        className="bg-white p-5 rounded-lg w-90 md:w-106 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent click on modal content from closing the modal
        onSubmit={handleSubmit} // Form submission handling
      >
        <div className="border-b-2 border-primary pb-2 mb-5">
          <h2 className="text-lg text-center text-primary">CREAR AUTOR</h2>
        </div>
        <div className="overflow-y-auto max-h-80 mb-5 text-primary text-lg modal-scrollbar">
          <label className="block mb-1 text-primary">Foto del autor</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImgChange}
            className="w-full p-2 mb-3 rounded focus:border-primary border"
          />
          {fotoAutor && ( // Use local state for image preview
            <img
              src={fotoAutor}
              alt="Preview"
              className="max-w-full h-auto mb-3"
            />
          )}

          <label className="block mb-1 text-primary">Nombre autor</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Nombre autor"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1 text-primary">Seudónimo</label>
          <input
            type="text"
            name="seudonimo"
            value={formData.seudonimo}
            onChange={handleInputChange}
            placeholder="Seudónimo"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1 text-primary">Fecha de nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1 text-primary">País</label>
          <input
            type="text"
            name="pais"
            value={formData.pais}
            onChange={handleInputChange}
            placeholder="País"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1 text-primary">Biografía</label>
          <textarea
            name="biografia"
            value={formData.biografia}
            onChange={handleInputChange}
            placeholder="Biografía"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            onClick={onClose}
            type="button" // Make sure this is a button to prevent form submission
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950"
            type="submit" // Ensure this triggers form submission
            disabled={isCreatingAutor}
          >
            {isCreatingAutor ? "Creando..." : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModalCrearAutor;
