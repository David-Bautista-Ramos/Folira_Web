import { useState } from 'react';
import useCreateComunidad from '../../hooks/useCreateComunidad';

const ModalCrearComunidad = ({ isOpen, onClose }) => {
  const { createComunidad, isCreatingComunidad } = useCreateComunidad();
  const [fotoComunidad, setFotoComunidad] = useState(null);
  const [nombre, setNombre] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    setFotoComunidad(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!nombre || !description) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', description);
    if (fotoComunidad) {
      formData.append('fotoComunidad', fotoComunidad);
    }

    try {
      await createComunidad(formData); // Call the function to create the comunidad
      onClose(); // Close the modal after submission
    } catch (error) {
      alert('Error al crear la comunidad.' + error); // Notify the user of the error
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="relative bg-white p-6 rounded-lg w-4/5 max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="border-b-2 border-primary pb-4 mb-4">
          <h2 className="text-2xl text-primary text-center">Crear Comunidad</h2>
        </div>
        <div className="mb-4 text-primary text-lg">
          <label className="block mb-1 text-gray-700">Foto de la Comunidad</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 mb-3 border rounded focus:border-primary"
          />
          {fotoComunidad && (
            <img
              src={URL.createObjectURL(fotoComunidad)} 
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-3" 
            />
          )}

          <label className="block mb-2">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre de la comunidad"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-2">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción de la comunidad"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400" onClick={onClose}>
            Cancelar
          </button>
          <button
            className={`px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950 ${isCreatingComunidad ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
            disabled={isCreatingComunidad}
          >
            {isCreatingComunidad ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCrearComunidad;
