const ModalTipoNotificacion = ({ isOpen, onClose, onFilter }) => {
  if (!isOpen) return null;

  return (
<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Filtrar por Tipo de Notificación</h2>
        <div className="flex flex-col gap-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => onFilter("seguidor")}
          >
            Seguidor
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => onFilter("like")}
          >
            Like
          </button>
          {/* <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() => onFilter("insignia")}
          >
            Insignia
          </button> */}
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => onFilter("denuncia")}
          >
            Denuncia
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={() => onFilter("comentario")}
          >
            Comentario
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded mt-4"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalTipoNotificacion;
