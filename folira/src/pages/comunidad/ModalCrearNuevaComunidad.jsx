import { useState, useRef, useEffect } from 'react';
import useCreateComunidad from '../../hooks/useCreateComunidad';

const ModalCrearNuevaComunidad = ({ isOpen, onClose, token, userId ,obtenerComunidades}) => {
  const [formData, setFormData] = useState({
    nombre: "", 
    descripcion: "", 
    fotoComunidad: "", 
    fotoBanner: "", 
    generoLiterarios: [],
    admin: userId ,
    link: "",
  });

  const { createComuniad, isCreatingComunidad } = useCreateComunidad();
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
        const response = await fetch('/api/geneLiter/getgeneros', {
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
      <div className="relative bg-white p-6 rounded-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="border-b-2 border-primary pb-2 mb-4">
          <h2 className="text-xl text-primary text-center">Crear Comunidad</h2>
        </div>

        <div className="relative mb-8">
          {/* COVER IMG */}
          <img
            src={fotoBanner || "/cover.png"}
            className="h-40 w-full object-cover rounded-lg"
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

          {/* USER AVATAR */}
          <div className="absolute bottom-[-30px] left-4 w-24 h-24">
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
        <label className="block mb-1">Nombre</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={handleInputChange}
          name="nombre"
          placeholder="Nombre de la comunidad"
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none text-sm"
        />

        <label className="block mb-1">Descripción</label>
        <textarea
          value={formData.descripcion}
          onChange={handleInputChange}
          name="descripcion"
          placeholder="Descripción de la comunidad"
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none text-sm"
        />
         <label className="block mb-1">Link</label>
        <input
          type="text"
          value={formData.link}
          onChange={handleInputChange}
          name="link"
          placeholder="Link de reuniones para la comunidad"
          className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none text-sm"
        />

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

        <button
          onClick={handleSubmit}
          disabled={isCreatingComunidad}
          className={`w-full py-2 rounded bg-primary text-white hover:bg-blue-600 transition-opacity ${isCreatingComunidad ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isCreatingComunidad ? "Creando..." : "Crear Comunidad"}
        </button>
      </div>
    </div>
  );
};

export default ModalCrearNuevaComunidad;
