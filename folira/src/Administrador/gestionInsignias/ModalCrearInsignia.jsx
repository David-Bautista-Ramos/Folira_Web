import { useState } from "react";
import useCreateInsignia from "../../hooks/useCreateInsignias";

function ModalCrearInsignia({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    criterio: "",
    cantidadObjetivo: 0,
  });

  const { createInisgnia, isCreatingInisgnia } = useCreateInsignia();
  const [fotoInsignia, setFotoInsignia] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoInsignia(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const data = new FormData();
    
    // Add form data to FormData object
    data.append("nombre", formData.nombre);
    data.append("descripcion", formData.descripcion);
    data.append("criterio", formData.criterio);
    data.append("cantidadObjetivo", formData.cantidadObjetivo);
    
    if (fotoInsignia) {
      data.append("icono", fotoInsignia);
    }

    try {
      await createInisgnia(data); // Call the create insignia function
      onClose(); // Close the modal after creation
    } catch (error) {
      console.error("Error al crear insignia:", error);
    }
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
          <h2 className="text-lg text-center text-primary">CREAR INSIGNIA</h2>
        </div>
        <div className="overflow-y-auto max-h-80 mb-5 text-primary text-lg modal-scrollbar">
          <label className="block mb-1 text-primary">Foto de la Insignia</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImgChange}
            className="w-full p-2 mb-3 rounded focus:border-primary border"
          />
          {fotoInsignia && ( // Preview of the image
            <img
              src={URL.createObjectURL(fotoInsignia)}
              alt="Preview"
              className="max-w-full h-auto mb-3"
            />
          )}

          <label className="block mb-1 text-primary">Nombre de la Insignia</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Nombre de la insignia"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
            required
          />

          <label className="block mb-1 text-primary">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Descripción"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
            required
          />

          <label className="block mb-1 text-primary">Criterio</label>
          <input
            type="text"
            name="criterio"
            value={formData.criterio}
            onChange={handleInputChange}
            placeholder="Criterio"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
            required
          />

          <label className="block mb-1 text-primary">Cantidad Objetivo</label>
          <input
            type="number"
            name="cantidadObjetivo"
            value={formData.cantidadObjetivo}
            onChange={handleInputChange}
            placeholder="Cantidad objetivo"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
            required
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
            disabled={isCreatingInisgnia} // Disable button while creating
          >
            {isCreatingInisgnia ? "Creando..." : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ModalCrearInsignia;
