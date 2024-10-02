const ModalReseñas = ({ isOpen, onClose, reseñas }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold mb-4">Todas las Reseñas</h2>
          
          {/* Contenedor para las reseñas con scroll */}
          <div className="modal-reviews max-h-60 overflow-y-auto mb-4"> {/* Agregar la clase modal-reviews */}
            {reseñas.length === 0 ? (
              <p>No hay reseñas disponibles.</p>
            ) : (
              reseñas.slice(0, 4).map((reseña, index) => (
                <div key={index} className="flex items-start mb-4">
                  <img
                    src={reseña.imagen}
                    alt={`${reseña.usuario} perfil`}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{reseña.usuario}</h3>
                    <p className="text-md">{reseña.comentario}</p>
                  </div>
                </div>
              ))
            )}
          </div>
  
          {/* Línea horizontal encima del botón Cerrar */}
          <hr className="my-4 border-gray-300" />
          
          <button
            className="px-4 py-2 bg-gray-300 ml-[320px] text-gray-800 rounded-md hover:bg-gray-400"
            onClick={onClose} // Cerrar el modal
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  };
  
  export default ModalReseñas;
  