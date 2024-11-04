import { useEffect, useState, useRef } from "react";
import useUpdateUsers from "../../hooks/useUpdateUsers";

const ModalActualizarUsuario = ({ isOpen, onClose, userId, token }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        nombreCompleto: "",
        correo: "",
        pais: "",
        biografia: "",
        roles: "",
        newcontrasena: "",
        currentcontrasena: "",
        generoLiterarioPreferido: [],
    });
    const [fotoPerfilBan, setFotoPerfilBan] = useState(null);
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [generoLiterarioPreferido, setGeneroLiterarioPreferido] = useState([]);

    const fotoPerfilBanRef = useRef(null);
    const fotoPerfilRef = useRef(null);

    const handleImgChange = (e, state) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (state === "coverImg") setFotoPerfilBan(reader.result);
                if (state === "profileImg") setFotoPerfil(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const { updateUsers, isUpdatingUsers, isError, error } = useUpdateUsers(userId);

    useEffect(() => {
        if (isOpen && userId) {
            const fetchUserData = async () => {
                try {
                    const response = await fetch(`/api/users/user/${userId}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    if (data) {
                        setFormData({
                            nombre: data.nombre || "",
                            nombreCompleto: data.nombreCompleto || "",
                            correo: data.correo || "",
                            pais: data.pais || "",
                            biografia: data.biografia || "",
                            roles: data.roles || "",
                            newcontrasena: "",
                            currentcontrasena: "",
                            generoLiterarioPreferido: data.generoLiterarioPreferido || [],
                        });
                        setFotoPerfilBan(data.fotoPerfilBan || "");
                        setFotoPerfil(data.fotoPerfil || "");
                    }
                } catch (error) {
                    console.error("Error al obtener los datos del usuario:", error);
                }
            };
            fetchUserData();
        }
    }, [isOpen, userId, token]);

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
                    setGeneroLiterarioPreferido(generos);
                }
            } catch (error) {
                console.error("Error al obtener los géneros literarios:", error);
            }
        };
        fetchGeneros();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === "generos") {
            if (checked && formData.generoLiterarioPreferido.length < 5) {
                setFormData((prevData) => ({
                    ...prevData,
                    generoLiterarioPreferido: [...prevData.generoLiterarioPreferido, value],
                }));
            } else if (!checked) {
                setFormData((prevData) => ({
                    ...prevData,
                    generoLiterarioPreferido: prevData.generoLiterarioPreferido.filter((genero) => genero !== value),
                }));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = {
            ...formData,
            fotoPerfil,
            fotoPerfilBan,
        };
        await updateUsers(updatedData);
        onClose(); // Cierra el modal
    };

    return (
        < >
            {isOpen && (
                <>
                    {/* Fondo negro transparente */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />

                    <dialog id="edit_profile_modal" className="modal" open>
                        <div className="modal-box border rounded-md border-blue-950 shadow-md p-6 relative max-h-[85vh] max-w-[120vh] overflow-y-auto">
                            <h3 className="text-primary font-bold text-lg my-3">Actualizar Usuario</h3>

                            <form className="text-primary grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
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
                                <div className="absolute top-[20%] left-[19%] transform -translate-x-1/2 w-32">
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

                                {/* Primera columna - Información básica */}
                                <div className="grid grid-cols-1 gap-6 pt-16">
                                    <input
                                        type="text"
                                        placeholder="Nombre Usuario"
                                        className="input border border-blue-950 rounded p-2  h-10"
                                        value={formData.nombre}
                                        name="nombre"
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Nombre Completo"
                                        className="input border border-blue-950 rounded p-2  h-10"
                                        value={formData.nombreCompleto}
                                        name="nombreCompleto"
                                        onChange={handleInputChange}
                                    />
                                    <textarea
                                        placeholder="Biografía"
                                        className="border border-blue-950 rounded p-2"
                                        value={formData.biografia}
                                        name="biografia"
                                        onChange={handleInputChange}
                                        maxLength={200}
                                        rows={4}
                                        style={{ resize: 'none', overflowWrap: 'break-word' }}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Correo"
                                        className="input border border-blue-950 rounded p-2  h-10"
                                        value={formData.correo}
                                        name="correo"
                                        onChange={handleInputChange}
                                    />
                                </div>

                                {/* Segunda columna - Contraseñas, País y Rol */}
                                <div className="grid grid-cols-1 -mt-[10px] gap-2 pt-16">
                                    <input
                                        type="password"
                                        placeholder="Contraseña Actual"
                                        className="input border border-blue-950 rounded p-2  h-10"
                                        value={formData.currentcontrasena}
                                        name="currentcontrasena"
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="password"
                                        placeholder="Contraseña Nueva"
                                        className="input border border-blue-950 rounded p-2  h-10"
                                        value={formData.newcontrasena}
                                        name="newcontrasena"
                                        onChange={handleInputChange}
                                    />
                                    <input
                                        type="text"
                                        placeholder="País"
                                        className="input border border-blue-950 rounded p-2 h-10"
                                        value={formData.pais}
                                        name="pais"
                                        onChange={handleInputChange}
                                    />
                                    <input
                                       type="text"
                                       placeholder="Rol"
                                       className="input border border-blue-950 rounded p-2  h-10"
                                       value={formData.roles}
                                       name="roles"
                                       onChange={handleInputChange}
                                    />
                                </div>

                                {/* Selección de géneros literarios */}
                                <div className="col-span-2">
                                <h4 className="font-bold">Selecciona hasta 5 géneros literarios:</h4>
                                <div className="grid grid-cols-2 gap-2">
                                  {generoLiterarioPreferido.map((genero) => (
                                    <label key={genero.nombre} className="flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        name="generos"
                                        value={genero._id}
                                        checked={formData.generoLiterarioPreferido.includes(genero._id)}
                                        onChange={handleInputChange}
                                        className="hidden"
                                      />
                                      <div
                                        className={`flex items-center border rounded-full p-2 ${
                                          formData.generoLiterarioPreferido.includes(genero._id)
                                            ? "bg-primary text-white"
                                            : "border-primary text-primary"
                                        }`}
                                      >
                                        <span>{genero.nombre}</span>
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              </div>

                                {/* Botón de actualización */}
                                  <div className="modal-action col-span-2">
                                <button
                                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-950"
                                    type="submit"
                                  >
                                  {isUpdatingUsers ? "Actualizando..." : "Guardar"}
                                </button>
                                    {isError && <p className="text-red-500">{error.message}</p>}
                                    <button
                                  className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-400"
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

export default ModalActualizarUsuario;
