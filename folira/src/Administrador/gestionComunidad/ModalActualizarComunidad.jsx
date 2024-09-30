import { useState } from 'react';

function ModalActualizarComunidad({ isOpen, onClose }) {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg w-4/5 max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
       
        <div className="border-b-2 border-primary pb-4 mb-6">
          <h2 className="text-2xl text-primary text-center">Actualizar Comunidad</h2>
        </div>
        <div className="space-y-4">
          <label className="block ">Imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full p-2 border border-primary rounded-md"
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="w-full max-h-64 object-contain mb-4"
            />
          )}

          <label className="block ">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la comunidad"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

          <label className="block ">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción de la comunidad"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400
"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button className="px-4 py-2 border  rounded bg-primary text-white hover:bg-blue-950">
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalActualizarComunidad;
