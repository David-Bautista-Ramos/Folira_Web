import { useState, useRef } from "react";
import useCreateUser from "../../hooks/useCreateUser"; // Hook para crear usuario
import Select from "react-select"; // Importa react-select


const ModalCrearUsuario = ({ isOpen, onClose }) => {

  const paises = [
		{ value: 'Argentina', label: 'Argentina' },
		{ value: 'Australia', label: 'Australia' },
		{ value: 'Austria', label: 'Austria' },
		{ value: 'Bélgica', label: 'Bélgica' },
		{ value: 'Brasil', label: 'Brasil' },
		{ value: 'Canadá', label: 'Canadá' },
		{ value: 'Chile', label: 'Chile' },
		{ value: 'Colombia', label: 'Colombia' },
		{ value: 'España', label: 'España' },
		{ value: 'Estados Unidos', label: 'Estados Unidos' },
		{ value: 'Francia', label: 'Francia' },
		{ value: 'Italia', label: 'Italia' },
		{ value: 'México', label: 'México' },
		{ value: 'Perú', label: 'Perú' },
		{ value: 'Reino Unido', label: 'Reino Unido' },
		{ value: 'Venezuela', label: 'Venezuela' },
	];


  const [formData, setFormData] = useState({
    nombre: "",
    nombreCompleto: "",
    correo: "",
    pais: "",
    roles: "",
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
    await createUser({
      ...formData,
      fotoPerfil,
      fotoPerfilBan,
    });
  };

  return (
<>
  {isOpen && (
    <>
      {/* Fondo negro transparente */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />

      <dialog id="create_profile_modal" className="modal z-50" open>
        <div className="modal-box border rounded-md border-blue-950 max-h-[800px] h-[700px] flex flex-col overflow-hidden">
          <h3 className="text-primary font-bold text-lg my-3">
            Crear Usuario
          </h3>

          {/* Contenedor del formulario con desplazamiento */}
          <form
            className="text-primary flex flex-col gap-4 flex-grow overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#111829 transparent",
            }}
            onSubmit={handleSubmit}
          >
            {/* Estilos para WebKit */}
            <style>
              {`
                .modal-box::-webkit-scrollbar {
                  width: 8px;
                }
                .modal-box::-webkit-scrollbar-track {
                  background: transparent;
                }
                .modal-box::-webkit-scrollbar-thumb {
                  background-color: #111827;
                  border-radius: 10px;
                }
                .modal-box::-webkit-scrollbar-thumb:hover {
                  background: darkred;
                }
              `}
            </style>

            {/* COVER IMG */}
            <div className="relative group/cover">
              <img
                src={fotoPerfilBan || "/cover.png"}
                className="h-52 w-full object-cover"
                alt="cover image"
              />
              <div
                className="absolute top-5 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
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
              <input
                type="file"
                hidden
                accept="image/*"
                ref={fotoPerfilRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />

              {/* USER AVATAR */}
              <div className="absolute top-[10px] left-[10px] mt-[65px] z-10"> {/* Ajusta el top si es necesario */}
                <div className="w-32 rounded-full relative">
                  <img
                    src={fotoPerfil || "/avatar-placeholder.png"}
                    alt="profile avatar"
                    className="border-4 border-white rounded-full"
                  />
                  <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                    <span
                      className="w-4 h-4 text-white"
                      onClick={() => fotoPerfilRef.current.click()}
                    >
                      Editar
                    </span>
                  </div>
                </div>
              </div>
            </div>

            

            {/* FORMULARIO */}
            <input
              type="text"
              placeholder="Nombre Usuario"
              className="input border border-blue-950 rounded p-2 input-md"
              value={formData.nombre}
              name="nombre"
              onChange={handleInputChange}
            />

            <input
              type="text"
              placeholder="Nombre Completo"
              className="input border border-blue-950 rounded p-2 input-md"
              value={formData.nombreCompleto}
              name="nombreCompleto"
              onChange={handleInputChange}
            />

            <input
              type="email"
              placeholder="Correo"
              className="input border border-blue-950 rounded p-2 input-md"
              value={formData.correo}
              name="correo"
              onChange={handleInputChange}
            />

            <Select
                  id='pais'
                  options={paises}
                  value={paises.find(option => option.value === formData.pais) || null}
                  onChange={(selectedOption) => {
                    handleInputChange({ target: { name: 'pais', value: selectedOption.value } });
                  }}
                  className='flex-1'
                  placeholder='Selecciona un país'
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      border: '1px solid #111829', // Color del borde
                      borderRadius: '0.375rem', // Bordes redondeados
                      padding: '0.5rem', // Añade padding
                      boxShadow: 'none', // Sin sombra
                      '&:hover': {
                        border: '1px solid #111829', // Color al hacer hover
                      },
                    }),
                    placeholder: (provided) => ({
                      ...provided,
                      color: '#6B7280', // Color del texto del placeholder
                    }),
                    singleValue: (provided) => ({
                      ...provided,
                      color: '#111829', // Color del texto seleccionado
                    }),
                  }}
              />

            <input
              type="text"
              placeholder="Rol"
              className="input border border-blue-950 rounded p-2 input-md"
              value={formData.roles}
              name="roles"
              onChange={handleInputChange}
            />
          </form>

          {/* Botones fijos en la parte inferior */}
          <div className="modal-action flex justify-between">
            <button
              className="bg-primary text-white px-4 py-2 rounded-md ml-[62%] hover:bg-blue-950"
              type="submit"
              disabled={isCreatingUser}
              onClick={handleSubmit}
            >
              {isCreatingUser ? "Creando..." : "Crear"}
            </button>
            <button
              className="mr-2 border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-400"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </dialog>
    </>
  )}
</>


  );
};

export default ModalCrearUsuario;