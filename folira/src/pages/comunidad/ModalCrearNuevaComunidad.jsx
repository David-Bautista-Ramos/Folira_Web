// ModalCrearComunidad.js
const ModalCrearComunidad = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // No renderiza el modal si no está abierto

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Crear Nueva Comunidad</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Nombre de la Comunidad</label>
            <input type="text" className="w-full border border-gray-300 p-2 rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Descripción</label>
            <textarea className="w-full border border-gray-300 p-2 rounded-md" rows="4"></textarea>
          </div>
          <button type="submit" className="w-full bg-primary hover:bg-blue-950 text-white font-semibold py-2 rounded-md">
            Crear Comunidad
          </button>
          <button
            type="button"
            className="w-full mt-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearComunidad;
