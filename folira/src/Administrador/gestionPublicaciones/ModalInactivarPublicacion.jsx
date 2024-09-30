const ModalInactivarPublicacion = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="bg-white rounded-lg p-6 z-60">
              <h2 className="text-lg font-semibold">Inactivar Publicación</h2>
              <p>¿Estás seguro de que deseas inactivar esta publicación?</p>
              <div className="flex justify-end mt-4">
                  <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400" onClick={onClose}>
                      Cancelar
                  </button>
                  <button
                      className="px-4 py-2 ml-4 border rounded bg-primary text-white hover:bg-blue-950"
                      onClick={() => {
                          onConfirm();
                          onClose();
                      }}
                  >
                      Inactivar
                  </button>
              </div>
          </div>
      </div>
  );
};

export default ModalInactivarPublicacion;
