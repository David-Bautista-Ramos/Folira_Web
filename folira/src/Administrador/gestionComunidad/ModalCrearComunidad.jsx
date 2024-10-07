import { useState } from 'react';

function ModalCrearComunidad({ isOpen, onClose }) {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="relative bg-white p-6 rounded-lg w-4/5 max-w-lg" onClick={(e) => e.stopPropagation()}>
        <div className="border-b-2 border-primary pb-4 mb-4">
          <h2 className="text-2xl text-primary text-center">Crear Comunidad</h2>
        </div>
        <div className="mb-4 text-primary text-lg">
          <label className="block  mb-2">Imagen</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full p-2 border border-primary rounded mb-4 focus:border-blue-950 focus:outline-none" />
          {image && <img src={image} alt="Preview" className="max-w-full h-auto mb-4" />}
          
          <label className="block  mb-2">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la comunidad"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

          <label className="block  mb-2">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción de la comunidad"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400" onClick={onClose}>Cancelar</button>
          <button className="px-4 py-2 border  rounded bg-primary text-white hover:bg-blue-950">Crear</button>
        </div>
      </div>
    </div>
  );
}

export default ModalCrearComunidad;
