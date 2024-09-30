function ModalInactivarGenero({ isOpen, onClose }) {
    if (!isOpen) return null;
  
    return (
      <div 
        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50" 
        onClick={onClose}
      >
        <div 
          className="bg-white p-5 rounded-lg max-w-md w-full shadow-lg relative z-50 text-center" 
          onClick={(e) => e.stopPropagation()}
        >
          
          <h2 className="mb-4 text-2xl text-gray-800">Inactivar Genero</h2>
          <p className="mb-5 text-gray-600 text-base">¿Estás seguro de que deseas inactivar este genero?</p>
          <div className="flex justify-end gap-4 mt-4">
            <button 
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              className="px-4 py-2 border  rounded bg-primary text-white hover:bg-blue-950"
            >
              Inactivar
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  export default ModalInactivarGenero;
  