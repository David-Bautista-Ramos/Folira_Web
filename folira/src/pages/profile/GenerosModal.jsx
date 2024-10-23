import{ useEffect, useState } from 'react';

const GenerosModal = ({ isOpen, onClose }) => {
    const [generos, setGeneros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGeneros = async () => {
            try {
                const response = await fetch('/api/geneLiter/getgeneros'); // Reemplaza con la URL de tu API
                if (!response.ok) {
                    throw new Error('Error al cargar los géneros');
                }
                const data = await response.json();
                setGeneros(data); // Asegúrate de que la respuesta tenga el formato esperado
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGeneros();
    }, []);

    if (!isOpen) return null; // Si no está abierto, no renderiza nada

    return (
        <div 
            className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' 
            onClick={onClose} // Cierra el modal al hacer clic en el fondo
        >
            <div 
                className='bg-white p-6 rounded-lg max-w-md w-full' 
                onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal cierre el modal
            >
                <button className="absolute top-2 right-4 text-gray-600" onClick={onClose}>X</button>

                <h2 className='text-xl font-bold mb-4'>Géneros Literarios</h2>

                <div className="modal-scrollbar"> {/* Aplica la clase para el scroll */}
                    {loading ? (
                        <p>Cargando géneros...</p> // Mensaje mientras se cargan los géneros
                    ) : error ? (
                        <p className="text-red-500">{error}</p> // Muestra un mensaje de error si hay uno
                    ) : (
                        generos.map((genero) => (
                            <div key={genero.nombre} className='flex items-center mb-4'>
                                <img src={genero.fotoGenero} alt={genero.nombre} className='w-16 h-16 mr-4' />
                                <div>
                                    <h3 className='font-semibold'>{genero.nombre}</h3>
                                    <p className='text-gray-700'>{genero.descripcion}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <button className='mt-6 bg-primary text-white px-4 py-2 rounded hover:bg-blue-950' onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default GenerosModal;
