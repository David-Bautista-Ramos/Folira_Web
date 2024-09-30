const LibroSugerido = () => {
    // Datos de libros "quemados"
    const libros = [
      {
        id: 1,
        titulo: 'El Principito',
        imagen: 'https://via.placeholder.com/150', // URL de imagen de ejemplo
      },
      {
        id: 2,
        titulo: 'Cien años de soledad',
        imagen: 'https://via.placeholder.com/150',
      },
      {
        id: 3,
        titulo: '1984',
        imagen: 'https://via.placeholder.com/150',
      },
      {
        id: 4,
        titulo: 'El Alquimista',
        imagen: 'https://via.placeholder.com/150',
      },
      {
        id: 5,
        titulo: 'Orgullo y prejuicio',
        imagen: 'https://via.placeholder.com/150',
      },
      {
        id: 6,
        titulo: 'Don Quijote de la Mancha',
        imagen: 'https://via.placeholder.com/150',
      },
    ];
  
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {libros.map((libro) => (
            <div
              key={libro.id}
              className="bg-white rounded-lg shadow-lg p-4 flex flex-col h-full"
              style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
            >
              <img
                src={libro.imagen}
                alt={libro.titulo}
                className="w-35 h-60 object-cover rounded"
              />
              <h2 className="text-lg font-semibold mt-4 text-center">{libro.titulo}</h2>
              <div className="flex-grow" /> {/* Esto empuja el botón hacia abajo */}
              <button className="mt-4 bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950 mb-4">
                Guardar
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default LibroSugerido;
  