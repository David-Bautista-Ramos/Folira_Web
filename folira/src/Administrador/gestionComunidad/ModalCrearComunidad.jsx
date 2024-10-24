import { useState, useRef, useEffect } from 'react';
import useCreateComunidad from '../../hooks/useCreateComunidad';

const ModalCrearComunidad = ({ isOpen, onClose, token, obtenerComunidades }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fotoComunidad: "",
    fotoBanner: "",
    generoLiterarios: [],
    admin: "",
    miembros: [], // Agregar campo para miembros
  });

  const { createComuniad, isCreatingComunidad } = useCreateComunidad(obtenerComunidades);
  const [fotoComunidad, setFotoComunidad] = useState(null);
  const [fotoBanner, setFotoBanner] = useState(null);
  const fotoBannerRef = useRef(null);
  const fotoComunidadRef = useRef(null);
  const [generoLiterarios, setGeneroLiterarios] = useState([]);
  const [usuarioAdminOpciones, setUsuarioAdminOpciones] = useState([]);
  const [todosUsuarios, setTodosUsuarios] = useState([]); // Agregar estado para todos los usuarios

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
          setGeneroLiterarios(generos);
        }
      } catch (error) {
        console.error("Error al obtener los géneros literarios:", error);
      }
    };
    fetchGeneros();
  }, [token]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('/api/users/allUsers', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const usuarios = await response.json();
        setUsuarioAdminOpciones(usuarios || []);
        setTodosUsuarios(usuarios || []); // Almacenar todos los usuarios para el selector
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
      }
    };
    fetchUsuarios();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createComuniad({
      ...formData,
      fotoComunidad,
      fotoBanner,
    });
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
    } else if (name === "miembros") {
      if (checked) {
        setFormData((prevData) => ({
          ...prevData,
          miembros: [...prevData.miembros, value],
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          miembros: prevData.miembros.filter((miembro) => miembro !== value),
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAdminChange = (e) => {
    setFormData({ ...formData, admin: e.target.value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="relative bg-white p-4 rounded-lg w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <div className="border-b-2 border-primary pb-2 mb-4">
          <h2 className="text-xl text-primary text-center">Crear Comunidad</h2>
        </div>

        {/* Sección de imágenes */}
        <div className="flex flex-col mb-4">
          <div className="relative mb-4 w-full">
            {/* COVER IMG */}
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
          <div className="relative mb-4 w-full">
            <div className="absolute bottom-[-20px] left-4 w-20 h-20">
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
        </div>

        {/* Resto de los campos */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            {/* Nombre */}
            <label className="block mb-1">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={handleInputChange}
              name="nombre"
              placeholder="Nombre de la comunidad"
              className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none text-sm"
            />

            {/* Descripción */}
            <label className="block mb-1">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={handleInputChange}
              name="descripcion"
              placeholder="Descripción de la comunidad"
              className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none text-sm"
            />

            {/* Admin Selector */}
            <h4 className="text-sm font-bold mb-2">Selecciona 1 Usuario como Administrador:</h4>
            <div className="grid grid-cols-2 gap-2 mb-4 h-28 overflow-y-auto border rounded p-2">
              {usuarioAdminOpciones.map((usuario) => (
                <label key={usuario._id} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="admin"
                    value={usuario._id}
                    checked={formData.admin === usuario._id}
                    onChange={handleAdminChange}
                    className="hidden"
                  />
                  <div
                    className={`flex items-center border rounded-full p-1 px-2 text-xs ${formData.admin === usuario._id ? "bg-primary text-white" : "border-primary text-primary"}`}
                  >
                    {usuario.nombre}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="flex flex-col">
            {/* Géneros Literarios Selector */}
            <h4 className="text-sm font-bold mb-2">Selecciona hasta 5 géneros literarios:</h4>
            <div className="grid grid-cols-2 gap-2 mb-4 h-28 overflow-y-auto border rounded p-2">
              {generoLiterarios.map((genero) => (
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

            {/* Miembros Selector */}
            <h4 className="text-sm font-bold mb-2">Selecciona Miembros:</h4>
            <div className="grid grid-cols-2 gap-2 h-28 overflow-y-auto border rounded p-2">
              {todosUsuarios.map((usuario) => (
                <label key={usuario._id} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="miembros"
                    value={usuario._id}
                    checked={formData.miembros.includes(usuario._id)}
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <div
                    className={`flex items-center border rounded-full p-1 px-2 text-xs ${formData.miembros.includes(usuario._id) ? "bg-primary text-white" : "border-primary text-primary"}`}
                  >
                    {usuario.nombre}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 p-2 rounded mr-2 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isCreatingComunidad}
            className={`p-2 rounded ${isCreatingComunidad ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} transition text-white`}
          >
            {isCreatingComunidad ? "Creando..." : "Crear Comunidad"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCrearComunidad;
