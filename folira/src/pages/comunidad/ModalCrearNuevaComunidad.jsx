import { useState, useRef, useEffect } from 'react';
import useCreateComunidad from '../../hooks/useCreateComunidad';

const ModalCrearNuevaComunidad = ({ isOpen, onClose, token, userId, obtenerComunidades }) => {
  const [formData, setFormData] = useState({
    nombre: "", 
    descripcion: "", 
    fotoComunidad: "", 
    fotoBanner: "", 
    generoLiterarios: [], 
    admin: userId, 
    link: "", 
  });

  const { createComuniad, isCreatingComunidad } = useCreateComunidad(obtenerComunidades);
  const [fotoComunidad, setFotoComunidad] = useState(null);
  const [fotoBanner, setFotoBanner] = useState(null);
  const fotoBannerRef = useRef(null);
  const fotoComunidadRef = useRef(null);
  const [generoLiterarioOpciones, setGeneroLiterarioOpciones] = useState([]);

  const handleImgChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === "coverImg") {
          setFotoBanner(reader.result);
        } else if (type === "profileImg") {
          setFotoComunidad(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const response = await fetch('/api/geneLiter/generosactuser', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const generos = await response.json();
        if (generos) {
          setGeneroLiterarioOpciones(generos);
        }
      } catch (error) {
        console.error("Error al obtener los géneros literarios:", error);
      }
    };
    fetchGeneros();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createComuniad({
      ...formData,
      fotoComunidad,
      fotoBanner,
    });
    obtenerComunidades();
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "generoLiterarios") {
      if (checked && formData.generoLiterarios.length < 5) {
        setFormData((prevData) => ({
          ...prevData,
          generoLiterarios: [...prevData.generoLiterarios, value],
        }));
      } else if (!checked) {
        setFormData((prevData) => ({
          ...prevData,
          generoLiterarios: prevData.generoLiterarios.filter((genero) => genero !== value),
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="relative bg-white p-6 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-custom" onClick={(e) => e.stopPropagation()}>
        <div className="border-b-2 border-primary pb-2 mb-4">
          <h2 className="text-xl text-primary text-center">Crear Comunidad</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 relative mb-6">
          {/* COVER IMG */}
          <div className="col-span-2">
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
          </div>

          {/* USER AVATAR */}
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

        {/* Input fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Primera columna: Nombre, Descripción y Link */}
          <div className="space-y-4">
            <div>
              <label className="block mb-1">Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={handleInputChange}
                name="nombre"
                placeholder="Nombre de la comunidad"
                className="w-full p-2 border rounded focus:border-primary focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block mb-1">Descripción</label>
              <textarea
                value={formData.descripcion}
                onChange={handleInputChange}
                name="descripcion"
                placeholder="Descripción de la comunidad"
                maxLength={200} // Limita a 200 caracteres
                className="w-full p-2 border rounded focus:border-primary focus:outline-none text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.descripcion.length}/200 caracteres
              </p>
            </div>


            <div>
              <label className="block mb-1">Link</label>
              <input
                type="text"
                value={formData.link}
                onChange={handleInputChange}
                name="link"
                placeholder="Link de reuniones para la comunidad"
                className="w-full p-2 border rounded focus:border-primary focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Segunda columna: Géneros literarios */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold mb-2">Selecciona hasta 5 géneros literarios:</h4>
            <div className="grid grid-cols-2 gap-2 mb-4 h-32 overflow-y-auto border rounded p-2">
              {generoLiterarioOpciones.map((genero) => (
                <label key={genero._id} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="generoLiterarios"
                    value={genero._id}
                    checked={formData.generoLiterarios.includes(genero._id)}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <div
                    className={`flex items-center border rounded-full p-1 px-2 text-xs ${formData.generoLiterarios.includes(genero._id) ? "bg-primary text-white" : "border-primary text-primary"}`}
                  >
                    {genero.nombre}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>


        <div className="flex justify-end mt-4"> 
            <button
            onClick={handleSubmit}
            disabled={isCreatingComunidad}
            className={`bg-primary text-white p-2 rounded ${isCreatingComunidad ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isCreatingComunidad ? "Creando..." : "Crear Comunidad"}
          </button>

          {/* Agregue esto */}
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md ml-4 hover:bg-gray-400" onClick={onClose}>
                Cancelar
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default ModalCrearNuevaComunidad;
