const GenerosModal = ({ isOpen, onClose }) => {
    const generos = [
        { 
            nombre: "Drama", 
            imagen: "/path/to/drama.png", 
            descripcion: "El drama es un género literario que se enfoca en conflictos emocionales y situaciones humanas intensas." 
        },
        { 
            nombre: "Terror", 
            imagen: "/path/to/terror.png", 
            descripcion: "El género de terror tiene como objetivo causar miedo y tensión en el lector a través de lo desconocido." 
        },
        { 
            nombre: "Desarrollo Personal", 
            imagen: "/path/to/desarrollo.png", 
            descripcion: "El desarrollo personal es un género enfocado en el crecimiento emocional y la auto-mejora." 
        },
        { 
            nombre: "Comedia", 
            imagen: "/path/to/comedia.png", 
            descripcion: "La comedia busca entretener y provocar risa a través de situaciones humorísticas y personajes cómicos." 
        },
        { 
            nombre: "Negocios", 
            imagen: "/path/to/negocios.png", 
            descripcion: "El género de negocios incluye temas como liderazgo, emprendimiento y economía." 
        },
        { 
            nombre: "Fantasía", 
            imagen: "/path/to/fantasia.png", 
            descripcion: "La fantasía utiliza elementos mágicos y sobrenaturales como parte de la narrativa." 
        },
        { 
            nombre: "Ciencia Ficción", 
            imagen: "/path/to/ciencia-ficcion.png", 
            descripcion: "La ciencia ficción explora futuros imaginarios y avances tecnológicos." 
        }
    ];

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
                    {generos.map((genero) => (
                        <div key={genero.nombre} className='flex items-center mb-4'>
                            <img src={genero.imagen} alt={genero.nombre} className='w-16 h-16 mr-4' />
                            <div>
                                <h3 className='font-semibold'>{genero.nombre}</h3>
                                <p className='text-gray-700'>{genero.descripcion}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button className='mt-6 bg-primary text-white px-4 py-2 rounded hover:bg-blue-950' onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default GenerosModal;
