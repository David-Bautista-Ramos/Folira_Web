import { useState, useRef } from 'react';
import Select from 'react-select';

const ModalCrearComunidad = ({ isOpen, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotoComunidad, setFotoComunidad] = useState(null);
  const [fotoBanner, setFotoBanner] = useState(null);
  const [generoLiterarios, setGeneroLiterarios] = useState([]);
  const [enlaceConexion, setEnlaceConexion] = useState(''); // Nuevo estado para el enlace de conexión
  
  const fotoBannerRef = useRef(null);
  const fotoComunidadRef = useRef(null);

  const handleImgChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'coverImg') {
          setFotoBanner(reader.result);
        } else if (type === 'profileImg') {
          setFotoComunidad(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrearComunidad = (e) => {
    e.preventDefault();
    console.log({
      nombre,
      descripcion,
      fotoComunidad,
      fotoBanner,
      generoLiterarios,
      enlaceConexion, // Agrega el enlace de conexión al log
    });
    onClose(); // Cierra el modal después de crear la comunidad
  };

  if (!isOpen) return null; // No renderiza el modal si no está abierto

  // Lista de géneros literarios
  const generos = [
    { _id: '1', nombre: 'Ficción' },
    { _id: '2', nombre: 'No ficción' },
    { _id: '3', nombre: 'Fantasía' },
    { _id: '4', nombre: 'Ciencia ficción' },
    { _id: '5', nombre: 'Misterio' },
    { _id: '6', nombre: 'Romance' },
    { _id: '7', nombre: 'Terror' },
    { _id: '8', nombre: 'Biografía' },
    { _id: '9', nombre: 'Autobiografía' },
    { _id: '10', nombre: 'Ensayo' },
    { _id: '11', nombre: 'Drama' },
    { _id: '12', nombre: 'Poesía' },
    { _id: '13', nombre: 'Literatura infantil' },
    { _id: '14', nombre: 'Literatura juvenil' },
    { _id: '15', nombre: 'Clásicos' },
    { _id: '16', nombre: 'Thriller' },
    { _id: '17', nombre: 'Novela histórica' },
    { _id: '18', nombre: 'Cuento' },
    { _id: '19', nombre: 'Literatura contemporánea' },
    { _id: '20', nombre: 'Ciencia y tecnología' },
  ];

  // Convertir los géneros a formato para react-select
  const options = generos.map(genero => ({
    value: genero._id,
    label: genero.nombre,
  }));

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="relative bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-custom" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-semibold text-primary text-center mb-4">Crear Nueva Comunidad</h2>

        {/* Foto del Banner con la Foto de la Comunidad */}
        <div className="relative mb-6">
          <img
            src={fotoBanner || "/cover.png"}
            className="h-32 w-full object-cover rounded-lg"
            alt="cover image"
          />
          <button
            className="absolute top-2 right-2 bg-gray-700 text-white p-1 rounded-full opacity-75 hover:opacity-100"
            onClick={() => fotoBannerRef.current.click()}
          >
            Editar
          </button>
          <input
            type="file"
            hidden
            accept="image/*"
            ref={fotoBannerRef}
            onChange={(e) => handleImgChange(e, "coverImg")}
          />
          <div className="absolute bottom-[-25px] left-4 w-20 h-20">
            <img
              src={fotoComunidad || "/avatar-placeholder.png"}
              className="w-full h-full rounded-full border-2 border-white object-cover"
              alt="profile avatar"
              onClick={() => fotoComunidadRef.current.click()}
            />
            <input
              type="file"
              hidden
              accept="image/*"
              ref={fotoComunidadRef}
              onChange={(e) => handleImgChange(e, "profileImg")}
            />
          </div>
        </div>

        {/* Contenedor de dos columnas */}
        <div className="grid grid-cols-2 gap-x-4">
          {/* Primera columna */}
          <div>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre de la Comunidad</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Descripción</label>
              <textarea
                value={descripcion}
                onChange={(e) => {
                  if (e.target.value.length <= 150) {
                    setDescripcion(e.target.value);
                  }
                }}
                required
                className="w-full border border-gray-300 p-2 rounded-md"
                rows="4"
              />
              <p className="text-sm text-gray-500">{descripcion.length}/150</p> {/* Muestra la cantidad de caracteres */}
            </div>
          </div>

          {/* Segunda columna */}
          <div>
            <h4 className="font-bold mb-2">Selecciona Géneros Literarios</h4>
            <Select
              isMulti
              options={options}
              value={options.filter(option => generoLiterarios.includes(option.value))}
              onChange={(selected) => setGeneroLiterarios(selected.map(item => item.value))}
              className="mb-4"
            />
            
            <div className="mb-4">
              <label className="block text-gray-700">Enlace de Conexión</label>
              <input
                type="url" // Tipo url para el campo de enlace
                value={enlaceConexion}
                onChange={(e) => setEnlaceConexion(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded-md"
                placeholder="https://ejemplo.com" // Placeholder para el campo
              />
            </div>
          </div>
        </div>

        {/* Botones de Crear y Cancelar */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-5 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="bg-primary hover:bg-blue-950 text-white p-2 rounded" 
            onClick={handleCrearComunidad} // Añadir la función de crear comunidad al botón
          >
            Crear 
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCrearComunidad;
