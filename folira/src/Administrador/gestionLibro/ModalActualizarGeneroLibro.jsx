  import { useState, useEffect } from 'react';
  import useUpdateGenero from '../../hooks/useUpdateGenero';

  function ModalActualizarGenero({ isOpen, onClose,generoId, onUpdate,obtenerGenerosLiterarios }) {
    const [formData, setFormData] = useState({
      nombre: '',
      descripcion: '',
    });
    const [fotoGenero, setFotoGenero] = useState(null);
    const { updateGenero, isUpdatingGenero } = useUpdateGenero(generoId,obtenerGenerosLiterarios);

    // Function to fetch the genre data
    const fetchGenero = async (generoId) => {
      try {
        const response = await fetch(`/api/geneLiter/generoid/${generoId}`); // Adjust API endpoint as needed
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const genero = await response.json();
        setFormData({
          nombre: genero.nombre || '',
          descripcion: genero.descripcion || '',
        });
        setFotoGenero(genero.fotoGenero || null);
      } catch (error) {
        console.error("Error fetching genre:", error);
      }
    };

    useEffect(() => {
      if (isOpen && generoId) {
        fetchGenero(generoId); // Fetch genre when modal opens
      } else {
        setFormData({ nombre: '', descripcion: '' });
        setFotoGenero(null); // Reset fields when modal closes
        
      }
    }, [isOpen, generoId]);


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
      updateGenero({ ...formData, fotoGenero });
      setFormData({ nombre: '', descripcion: '' });
      setFotoGenero(null);
      onClose();
      onUpdate(); // Call to update the list of genres
      obtenerGenerosLiterarios();
    };
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <form
          className="bg-white p-5 rounded-lg max-w-sm w-full shadow-lg"
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl text-primary text-center mb-4">Actualizar Género</h2>

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

          <div className="flex justify-end gap-2 mt-3">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              onClick={onClose}
              type="button"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-950"
              disabled={isUpdatingGenero}
            >
              {isUpdatingGenero ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  export default ModalActualizarGenero;
