import { useState } from 'react';

const ModalCrearInsignia = ({ isOpen, onClose, obtenerInsignias }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotoInsignia, setFotoInsignia] = useState(''); // Cambiado a fotoInsignia para coincidir con el uso en el preview
  const [estado, setEstado] = useState(true); // Por defecto, la insignia está activa
  const [isCreatingInsignia, setIsCreatingInsignia] = useState(false); // Estado para manejar la creación de la insignia

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoInsignia(reader.result); // Guardar la imagen en base64 para la vista previa
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCreatingInsignia(true); // Activar el estado de creación

    // Lógica para crear una nueva insignia
    const nuevaInsignia = {
      _id: Math.random().toString(36).substr(2, 9), // Generar un ID aleatorio
      nombre,
      descripcion,
      fotoInsignia, // Directamente la URL de la imagen
      estado,
    };

    console.log('Nueva Insignia Creada:', nuevaInsignia);
    
    // Aquí llamarías a la función para obtener las insignias actualizadas
    obtenerInsignias();

    // Restablecer campos del formulario
    setNombre('');
    setDescripcion('');
    setFotoInsignia('');
    setEstado(true);
    
    // Cerrar el modal
    onClose();
    setIsCreatingInsignia(false); // Desactivar el estado de creación
  };

  if (!isOpen) return null;

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
        <h2 className="text-lg text-center text-gray-800 mb-4">Crear Insignia</h2>

        <label className="block mb-1 text-gray-700">Foto de la Insignia</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImgChange}
          className="w-full p-2 mb-3 border rounded focus:border-primary"
        />
        {fotoInsignia && (
          <img
            src={fotoInsignia}
            alt="Preview"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-3" // Estilo circular
          />
        )}

        <label className="block mb-1 text-gray-700">Nombre de la Insignia</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          placeholder="Nombre de la insignia"
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
        />

        <label className="block mb-1 text-gray-700">Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
          placeholder="Descripción"
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={estado}
            onChange={() => setEstado(!estado)}
            className="mr-2"
          />
          <label className="text-gray-700">Activa</label>
        </div>

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
            disabled={isCreatingInsignia}
          >
            {isCreatingInsignia ? "Creando..." : "Crear Insignia"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalCrearInsignia;
