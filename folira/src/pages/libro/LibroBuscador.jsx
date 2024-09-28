import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

const BuscadorLibro = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null); // Referencia para el contenedor del menú desplegable

  // Datos de tipos de comunidades
  const tiposDeComunidades = [
    'Literatura',
    'Ciencia',
    'Arte',
    'Tecnología',
    'Historia',
    'Filosofía',
    'Psicología',
    'Biografía',
    'Novela',
  ];

  // Maneja el clic fuera del dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    // Agrega el evento de clic
    document.addEventListener('mousedown', handleClickOutside);

    // Limpia el evento al desmontar
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-end p-4 relative"> {/* Contenedor relativo */}
      <div className="buscador flex items-center">
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="input-busqueda border border-primary rounded-full py-2 px-7 w-[500px] mr-2 h-10" 
        />

        <button 
          className="bg-gray-200 text-gray-600 rounded-l-md rounded-r-md px-3 py-2 flex items-center"
          onClick={() => setDropdownVisible(!isDropdownVisible)} // Alterna la visibilidad del menú
        >
          <FaFilter />
        </button>

        <button className="boton-buscar bg-blue-500 text-white rounded-r-md rounded-l-md px-3 py-2 ml-2 mr-2">
          <FaSearch />
        </button>

        {isDropdownVisible && (
          <div 
            ref={dropdownRef} // Asocia la referencia al contenedor del dropdown
            className="absolute right-0 top-[calc(90%+0.1rem)] mr-[60px] bg-white border rounded-md shadow-lg z-10 w-48 max-h-48 overflow-y-auto scrollbar-custom" // Cambiado a modal-content-gustar
          >
            <ul className="p-2">
              {tiposDeComunidades.map((tipo, index) => (
                <li key={index} className="py-1 px-4 hover:bg-gray-200 cursor-pointer">
                  {tipo}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuscadorLibro;
