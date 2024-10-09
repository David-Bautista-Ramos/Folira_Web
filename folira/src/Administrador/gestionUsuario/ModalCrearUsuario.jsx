import { useState, useRef } from "react";
import useCreateUser from "../../hooks/useCreateUser"; // Hook para crear usuario

const ModalCrearUsuario = ({ isOpen, onClose }) => {
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
        <dialog id="create_profile_modal" className="modal" open>
          <div className="modal-box border rounded-md border-blue-950 h-[500px] shadow-md modal-scrollbar">
            <h3 className="text-primary font-bold text-lg my-3">
              Crear Usuario
            </h3>
            <form
              className="text-primary flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={fotoPerfilBan || "/cover.png"}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                <div
                  className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
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
              </div>

              {/* USER AVATAR */}
              <div className="avatar absolute -bottom-16 left-4">
                <div className="w-32 rounded-full relative group/avatar bottom-44 left-8">
                  <img
                    src={fotoPerfil || "/avatar-placeholder.png"}
                    alt="profile avatar"
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

              <input
                type="text"
                placeholder="Pais"
                className="input border border-blue-950 rounded p-2 input-md"
                value={formData.pais}
                name="pais"
                onChange={handleInputChange}
              />

              <input
                type="text"
                placeholder="Rol"
                className="input border border-blue-950 rounded p-2 input-md"
                value={formData.roles}
                name="roles"
                onChange={handleInputChange}
              />

              <div className="modal-action">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isCreatingUser}
                >
                  {isCreatingUser ? "Creando..." : "Crear"}
                </button>
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={onClose}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
};

export default ModalCrearUsuario;
