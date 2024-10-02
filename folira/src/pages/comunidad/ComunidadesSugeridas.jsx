import { Link } from "react-router-dom";

const AutorSugerido = () => {
  // Datos de autores "quemados"
  const autores = [
    {
      id: 1,
      nombre: 'Lectores de El Principito',
      imagen: 'https://via.placeholder.com/125', // URL de imagen de autor de ejemplo
    },
    {
      id: 2,
      nombre: 'Cien años de soledad',
      imagen: 'https://via.placeholder.com/125',
    },
    {
      id: 3,
      nombre: '1984',
      imagen: 'https://via.placeholder.com/125',
    },
    {
      id: 4,
      nombre: 'El Alquimista',
      imagen: 'https://via.placeholder.com/125',
    },
    {
      id: 5,
      nombre: 'Orgullo y prejuicio',
      imagen: 'https://via.placeholder.com/125',
    },
    {
      id: 6,
      nombre: 'Don Quijote de la Mancha',
      imagen: 'https://via.placeholder.com/125',
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {autores.map((autor) => (
          <div
            key={autor.id}
            className="bg-white  rounded-lg shadow-lg p-4 flex flex-col items-center h-full"
            style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
          >
            {/* Enlace solo en la imagen */}
            <Link to="/DetalleComunidad" className="no-underline">
              <img
                src={autor.imagen}
                alt={autor.nombre}
                className="w-32 h-32 object-cover rounded-full mb-2" // Imagen circular centrada
              />
            </Link>

            {/* Enlace solo en el nombre de la comunidad */}
            <Link className="no-underline text-inherit w-full max-w-xs">
              <h2 className="text-lg font-semibold text-center flex-grow truncate w-full max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                {autor.nombre}
              </h2>
            </Link>

            <button className="bg-primary text-white rounded-full px-4 py-2 hover:bg-blue-950 mt-2 mb-4">
              Unirme
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AutorSugerido;
