import React from 'react';

function ModalCrearGenero({ isOpen, onClose, onCreate }) {
  const [nombre, setNombre] = React.useState('');

  const handleCreate = () => {
    onCreate(nombre);
    setNombre('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg max-w-sm w-full shadow-lg">
        <h2 className="text-2xl text-gray-800 mb-4">Crear Género</h2>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del género"
          className="w-full p-2 border border-primary rounded-md mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400" 

          >
            Cancelar
          </button>

          <button
            onClick={handleCreate}
            className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-950 mr-2 ml-2 "
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCrearGenero;
