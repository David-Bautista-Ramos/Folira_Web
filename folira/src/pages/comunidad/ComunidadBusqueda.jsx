import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaFilter, FaPlus } from 'react-icons/fa';
import ModalCrearComunidad from './ModalCrearNuevaComunidad';

const BuscadorComunidad = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const tiposDeComunidades = [
    'Literatura', 'Ciencia', 'Arte', 'Tecnología', 'Historia', 'Filosofía', 'Psicología', 'Biografía', 'Novela',
  ];

  const usuarios = [
    { _id: '1', nombre: 'Usuario 1' },
    { _id: '2', nombre: 'Usuario 2' },
  ];

  const generos = [
    { _id: '1', nombre: 'Ficción' },
    { _id: '2', nombre: 'No Ficción' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="flex justify-end p-4 relative">
      <div className="buscador flex items-center">
        <button 
          className="mr-3 p-2 bg-primary text-white rounded-full hover:bg-blue-950"
          onClick={handleOpenModal}
        >
          <FaPlus />
        </button>

        <input 
          type="text" 
          placeholder="Buscar..." 
          className="input-busqueda border border-primary rounded-full py-2 px-7 w-[500px] mr-2 h-10" 
        />

        <button 
          className="bg-gray-200 text-primary hover:bg-gray-400 rounded-l-md rounded-r-md px-3 py-2 flex items-center"
          onClick={() => setDropdownVisible(!isDropdownVisible)}
        >
          <FaFilter />
        </button>

        <button className="boton-buscar bg-primary hover:bg-blue-950 text-white rounded-r-md rounded-l-md px-3 py-2 ml-2 mr-2">
          <FaSearch />
        </button>

        {isDropdownVisible && (
          <div 
            ref={dropdownRef}
            className="absolute right-0 top-[calc(90%+0.1rem)] mr-[60px] bg-white border rounded-md shadow-lg z-10 w-48 max-h-48 overflow-y-auto"
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

      {/* Renderiza el modal aquí y pasa las props */}
      <ModalCrearComunidad
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        usuarios={usuarios}
        generos={generos}
      />
    </div>
  );
};

export default BuscadorComunidad;
