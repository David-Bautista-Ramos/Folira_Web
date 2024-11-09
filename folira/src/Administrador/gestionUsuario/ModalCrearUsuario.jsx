import { useState, useRef } from "react";
import useCreateUser from "../../hooks/useCreateUser"; // Hook para crear usuario
import Select from "react-select"; // Importa react-select

const ModalCrearUsuario = ({ isOpen, onClose }) => {

  const paises = [
    { value: 'Afganistán', label: 'Afganistán' },
    { value: 'Alemania', label: 'Alemania' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Austria', label: 'Austria' },
    { value: 'Bélgica', label: 'Bélgica' },
    { value: 'Bolivia', label: 'Bolivia' },
    { value: 'Brasil', label: 'Brasil' },
    { value: 'Canadá', label: 'Canadá' },
    { value: 'Chile', label: 'Chile' },
    { value: 'China', label: 'China' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Corea del Sur', label: 'Corea del Sur' },
    { value: 'Costa Rica', label: 'Costa Rica' },
    { value: 'Cuba', label: 'Cuba' },
    { value: 'Dinamarca', label: 'Dinamarca' },
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'Egipto', label: 'Egipto' },
    { value: 'El Salvador', label: 'El Salvador' },
    { value: 'Emiratos Árabes Unidos', label: 'Emiratos Árabes Unidos' },
    { value: 'España', label: 'España' },
    { value: 'Estados Unidos', label: 'Estados Unidos' },
    { value: 'Filipinas', label: 'Filipinas' },
    { value: 'Francia', label: 'Francia' },
    { value: 'Grecia', label: 'Grecia' },
    { value: 'Guatemala', label: 'Guatemala' },
    { value: 'Honduras', label: 'Honduras' },
    { value: 'India', label: 'India' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Irlanda', label: 'Irlanda' },
    { value: 'Israel', label: 'Israel' },
    { value: 'Italia', label: 'Italia' },
    { value: 'Japón', label: 'Japón' },
    { value: 'México', label: 'México' },
    { value: 'Nicaragua', label: 'Nicaragua' },
    { value: 'Noruega', label: 'Noruega' },
    { value: 'Nueva Zelanda', label: 'Nueva Zelanda' },
    { value: 'Países Bajos', label: 'Países Bajos' },
    { value: 'Panamá', label: 'Panamá' },
    { value: 'Paraguay', label: 'Paraguay' },
    { value: 'Perú', label: 'Perú' },
    { value: 'Polonia', label: 'Polonia' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Reino Unido', label: 'Reino Unido' },
    { value: 'República Checa', label: 'República Checa' },
    { value: 'República Dominicana', label: 'República Dominicana' },
    { value: 'Rusia', label: 'Rusia' },
    { value: 'Sudáfrica', label: 'Sudáfrica' },
    { value: 'Suecia', label: 'Suecia' },
    { value: 'Suiza', label: 'Suiza' },
    { value: 'Tailandia', label: 'Tailandia' },
    { value: 'Turquía', label: 'Turquía' },
    { value: 'Ucrania', label: 'Ucrania' },
    { value: 'Uruguay', label: 'Uruguay' },
    { value: 'Venezuela', label: 'Venezuela' },
    { value: 'Vietnam', label: 'Vietnam' },
];


  const [formData, setFormData] = useState({
    nombre: "",
    nombreCompleto: "",
    correo: "",
    pais: "",
    roles: "",
    biografia: '',
  });
  const [fotoPerfilBan, setFotoPerfilBan] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);

  const fotoPerfilBanRef = useRef(null);
  const fotoPerfilRef = useRef(null);

  // Función para manejar el cambio en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para manejar el cambio en las imágenes
  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setFotoPerfilBan(reader.result);
        state === "profileImg" && setFotoPerfil(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { createUser, isCreatingUser } = useCreateUser(); // Función de creación de usuario

 // Función para manejar el submit del formulario
const handleSubmit = async (e) => {
  e.preventDefault();
  // Enviar datos del formulario y las imágenes
  const success = await createUser({
    ...formData,
    fotoPerfil,
    fotoPerfilBan,
  });
  
  // Cerrar el modal si la creación fue exitosa
  if (success) {
    onClose();
  }
};

  const handleCountryChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      pais: selectedOption ? selectedOption.value : "",
    }));
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Fondo negro transparente */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />

          <dialog id="create_profile_modal" className="modal z-50" open>
            <div className="modal-box border rounded-md border-blue-950 shadow-md p-6 relative max-h-[85vh] max-w-[120vh] overflow-y-auto">
              <h3 className="text-primary font-bold text-lg my-3">
                Crear Usuario
              </h3>

              {/* Contenedor del formulario con desplazamiento */}
              <form
                className="text-primary grid grid-cols-2 gap-x-8 gap-y-4 items-start"
                onSubmit={handleSubmit}
              >
                {/* COVER IMG */}
                <div className="col-span-2 relative">
                  <img
                    src={fotoPerfilBan || "/cover.png"}
                    className="h-40 w-full object-cover rounded-md"
                    alt="cover image"
                  />
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer"
                    onClick={() => fotoPerfilBanRef.current.click()}
                  >
                    <span className="w-5 h-5 text-white">Editar</span>
                  </div>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={fotoPerfilBanRef}
                    onChange={(e) => handleImgChange(e, "coverImg")}
                  />
                </div>

                {/* USER AVATAR */}
                <div className="absolute top-[30%] left-[15%] transform -translate-x-1/2 w-32">
                  <div className="avatar relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
                      <img src={fotoPerfil || "/avatar-placeholder.png"} alt="profile avatar" />
                      <div
                        className="absolute top-[15%] right-3 p-1 bg-primary rounded-full cursor-pointer"
                        onClick={() => fotoPerfilRef.current.click()}
                      >
                        <span className="w-4 h-4 text-white">Editar</span>
                      </div>
                    </div>
                  </div>
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={fotoPerfilRef}
                    onChange={(e) => handleImgChange(e, "profileImg")}
                  />
                </div>

                {/* FORMULARIO */}
                <div>
                  <label className="block mb-1 mt-[50px]">Nombre Usuario</label>
                  <input
                    type="text"
                    placeholder="Nombre Usuario"
                    className="input border border-blue-950 rounded p-2 w-full h-10"
                    value={formData.nombre}
                    name="nombre"
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block mb-1 mt-[50px]">Nombre Completo</label>
                  <input
                    type="text"
                    placeholder="Nombre Completo"
                    className="input border border-blue-950 rounded p-2 w-full h-10"
                    value={formData.nombreCompleto}
                    name="nombreCompleto"
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="Correo"
                    className="input border border-blue-950 rounded p-2 w-full h-10"
                    value={formData.correo}
                    name="correo"
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label className="block mb-1">País</label>
                  <Select
                    className="border border-blue-950 rounded"
                    options={paises}
                    onChange={handleCountryChange}
                    value={paises.find((pais) => pais.value === formData.pais)}
                    placeholder="Selecciona un país"
                  />
                </div>

                <div>
                  <label className="block mb-1">Rol</label>
                  <input
                    type="text"
                    placeholder="Rol"
                    className="input border border-blue-950 rounded p-2 w-full h-10"
                    value={formData.roles}
                    name="roles"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="col-span-1">
                  <label className="block mb-1">Biografía</label>
                  <textarea
                    placeholder="Biografía"
                    className="border border-blue-950 rounded p-2 w-full"
                    value={formData.biografia}
                    name="biografia"
                    onChange={handleInputChange}
                    maxLength={200}
                    rows={4}
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {formData.biografia.length} / 200 caracteres 
                  </div>
                </div>


                <div className="modal-action col-span-2">
                  <button
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-950"
                    type="submit"
                  >
                    {isCreatingUser ? "Creando..." : "Crear"}
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400"
                    type="button"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </dialog>
        </>
      )}
    </>
  );
};

export default ModalCrearUsuario;
