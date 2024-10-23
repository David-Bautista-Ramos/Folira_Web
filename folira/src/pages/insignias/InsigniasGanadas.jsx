const InsigniasGanadas = () => {
    // Datos quemados de las insignias ganadas
    const insigniasGanadas = [
        {
            id: 1,
            nombre: "Maestro de la Lectura",
            descripcion: "Obtenida al completar la lectura de 50 libros.",
            imgUrl: "https://via.placeholder.com/100", // imagen temporal
            fecha: "10 de Octubre, 2024",
        },
        {
            id: 2,
            nombre: "Crítico Literario",
            descripcion: "Ganada al escribir 100 reseñas de libros.",
            imgUrl: "https://via.placeholder.com/100", // imagen temporal
            fecha: "15 de Septiembre, 2024",
        },
        {
            id: 3,
            nombre: "Comunidad Literaria",
            descripcion: "Otorgada por unirse a 10 clubes de lectura.",
            imgUrl: "https://via.placeholder.com/100", // imagen temporal
            fecha: "1 de Agosto, 2024",
        }
    ];

    return (
        <div className='p-4'>
            {insigniasGanadas.map((insignia) => (
                <div key={insignia.id} className='flex items-center mb-6 p-4 bg-green-100 rounded-lg shadow-lg'>
                    {/* Imagen de la insignia */}
                    <img
                        src={insignia.imgUrl}
                        alt={`Insignia ${insignia.nombre}`}
                        className='w-20 h-20 object-cover rounded-full mr-4'
                    />
                    {/* Información de la insignia */}
                    <div>
                        <h3 className='text-xl font-semibold'>{insignia.nombre}</h3>
                        <p className='text-gray-600'>{insignia.descripcion}</p>
                        <p className='text-sm text-gray-500 mt-1'>Fecha de obtención: {insignia.fecha}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InsigniasGanadas;
