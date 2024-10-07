import { useState, useEffect } from 'react';

function ModalActualizarGenero({ isOpen, onClose, onUpdate, genero }) {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (genero) {
      setNombre(genero.nombre || '');
    }
  }, [genero]);

  const handleUpdate = () => {
    onUpdate({ ...genero, nombre });
    setNombre('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg max-w-sm w-full shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-primary">Actualizar Género</h2>
          
        </div>
        <div className="mt-3">
          <input
            className="w-full p-2 border border-primary rounded-md mb-3"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del género"
          />
          <div className="flex justify-end gap-2 mt-3">
            
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-950 mr-2 ml-4"
              onClick={handleUpdate}
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalActualizarGenero;
