import dramaImg from '../../assets/icons/drama.png';
import terrorImg from '../../assets/icons/terror.png';
import romanceImg from '../../assets/icons/romance.png';
import comediaImg from '../../assets/icons/comedia.png';
import negocioImg from '../../assets/icons/negocios.png';
import historiaImg from '../../assets/icons/historia.png';
import cienciaFiccionImg from '../../assets/icons/ciencia_ficcion.png';
import economiaImg from '../../assets/icons/economia.png';
import psicologiaImg from '../../assets/icons/psicologia.png';
import desarrolloPersonalImg from '../../assets/icons/desarrollo_personal.png';

const GenerosModal = ({ isOpen, onClose }) => {
    const generos = [
        {
            nombre: "Drama",
            imagen: dramaImg,
            descripcion: "El drama es un género literario que se enfoca en conflictos emocionales y situaciones humanas intensas."
        },
        {
            nombre: "Terror",
            imagen: terrorImg,
            descripcion: "El terror es un género que busca provocar miedo y ansiedad a través de situaciones sobrenaturales o inquietantes."
        },
        {
            nombre: "Romance",
            imagen: romanceImg,
            descripcion: "El romance es un género centrado en las relaciones amorosas, explorando la intimidad, la pasión y los desafíos de las relaciones."
        },
        {
            nombre: "Comedia",
            imagen: comediaImg,
            descripcion: "La comedia es un género que busca entretener y hacer reír, a menudo a través de situaciones humorísticas y personajes extravagantes."
        },
        {
            nombre: "Negocios",
            imagen: negocioImg,
            descripcion: "El género de negocios se centra en el mundo empresarial, explorando temas como el liderazgo, la estrategia y el éxito en el entorno corporativo."
        },
        {
            nombre: "Historia",
            imagen: historiaImg,
            descripcion: "La historia es un género que narra eventos del pasado, explorando la vida de personas y sociedades a través del tiempo."
        },
        {
            nombre: "Ciencia Ficción",
            imagen: cienciaFiccionImg,
            descripcion: "La ciencia ficción es un género que imagina futuros alternativos y avances tecnológicos, a menudo explorando temas de ciencia y ética."
        },
        {
            nombre: "Economía",
            imagen: economiaImg,
            descripcion: "El género de economía se enfoca en el estudio de la producción, distribución y consumo de bienes y servicios en una sociedad."
        },
        {
            nombre: "Psicología",
            imagen: psicologiaImg,
            descripcion: "La psicología es un género que explora la mente y el comportamiento humano, analizando las emociones, pensamientos y relaciones."
        },
        {
            nombre: "Desarrollo Personal",
            imagen: desarrolloPersonalImg,
            descripcion: "El desarrollo personal se centra en el crecimiento y la autoayuda, ofreciendo herramientas y estrategias para mejorar la calidad de vida."
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
