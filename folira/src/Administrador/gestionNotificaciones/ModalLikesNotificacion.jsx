const ModalLikes = ({ isOpen, onClose, likes }) => {
    if (!isOpen) return null; // Si no está abierto, no renderizar

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-4 w-96 relative">
                
                <h2 className="text-xl font-semibold mb-4">Likes</h2>
                {likes.length === 0 ? (
                    <p>No hay likes aún.</p>
                ) : (
                    <ul className="max-h-60 overflow-y-auto">
                        {likes.map((like, idx) => (
                            <li key={idx} className="py-2 border-b border-primary">
                                <span className="font-semibold">{like.user.nombreCompleto}</span>
                            </li>
                        ))}
                    </ul>
                )}
                
                {/* Botón para cerrar el modal al final */}
                <div className="mt-4">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 ml-[280px] bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalLikes;
