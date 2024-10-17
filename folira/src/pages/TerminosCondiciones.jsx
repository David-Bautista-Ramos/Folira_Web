import { useState } from 'react';

const TerminosConditionsModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Botón para abrir el modal */}
            <button 
                onClick={toggleModal} 
                className="rounded-full text-primary border border-transparent hover:bg-gray-200 px-4 py-2"
            >
                Términos y Condiciones
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2">
                        <h2 className="text-2xl font-bold mb-4">Términos y Condiciones</h2>
                        <div className="mb-4">
                            <p>
                                Estos son los términos y condiciones de uso de nuestra plataforma...
                            </p>
                            {/* Aquí puedes agregar más contenido sobre tus términos y condiciones */}
                        </div>
                        <button 
                            onClick={toggleModal} 
                            className="mt-4 rounded-full text-primary border border-transparent hover:bg-gray-200 px-4 py-2"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default TerminosConditionsModal;
