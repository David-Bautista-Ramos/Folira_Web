const InsigniasDisponibles = () => {
    // Datos quemados de las insignias
    const insignias = [
        {
            id: 1,
            nombre: "Explorador Ávido",
            descripcion: "Otorgada a los usuarios que exploran 10 nuevos géneros literarios.",
            imgUrl: "https://via.placeholder.com/100", // imagen temporal
        },
        {
            id: 2,
            nombre: "Contribuidor Activo",
            descripcion: "Reconocimiento a los usuarios que han contribuido con 20 comentarios en publicaciones.",
            imgUrl: "https://via.placeholder.com/100", // imagen temporal
        },
        {
            id: 3,
            nombre: "Amigo Literario",
            descripcion: "Para los usuarios que han seguido a 5 nuevos autores.",
            imgUrl: "https://via.placeholder.com/100", // imagen temporal
        }
    ];

    return (
        <div className='p-4'>
            {insignias.map((insignia) => (
                <div key={insignia.id} className='flex items-center mb-6 p-4 bg-gray-100 rounded-lg shadow-lg'>
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
                    </div>
                </div>
            ))}
        </div>
    );
};

export default InsigniasDisponibles;
