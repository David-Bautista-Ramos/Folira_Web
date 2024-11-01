import { useEffect, useState, useRef } from "react";
import useUpdateUsers from "../../hooks/useUpdateUsers";

const ModalActualizarUsuario = ({ isOpen, onClose, userId, token }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        nombreCompleto: "",
        correo: "",
        pais: "",
        biografia: "",
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
                state === "coverImg" && setFotoPerfilBan(reader.result);
                state === "profileImg" && setFotoPerfil(reader.result);
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

    return (
        <>
    {isOpen && (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />
            <dialog id="edit_profile_modal" className="modal z-50" open>
                <div className="modal-box border rounded-md border-blue-950 max-h-[800px] h-[750px] shadow-md flex flex-col justify-between modal-scrollbar-usuario">
                    <h3 className="text-primary font-bold text-lg my-3">Actualizar Usuario</h3>

                    {/* Contenedor con scroll para el formulario */}
                    <div className="p-4 ">
                        <form
                            className="text-primary flex flex-col gap-4 flex-grow overflow-y-auto"
                            onSubmit={(e) => {
                                e.preventDefault();
                                updateUsers(formData);
                            }}
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
                                {/* USER AVATAR */}
                                <div className="avatar absolute -left-[1px] mr-[1px] mt-[45px] z-10">
                                    <div className="w-32 rounded-full relative group/avatar bottom-44 left-8">
                                        <img src={fotoPerfil || "/avatar-placeholder.png"} alt="profile avatar" className="border-4 border-white rounded-full"/>
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
                            <textarea
                                placeholder="Biografía"
                                className="w-full border border-blue-950 rounded p-2 input-md"
                                value={formData.biografia}
                                name="biografia"
                                onChange={handleInputChange}
                                maxLength={200}
                                rows={4}
                                style={{ resize: "none", overflowWrap: "break-word" }}
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
                                type="password"
                                placeholder="Contraseña Actual"
                                className="input border border-blue-950 rounded p-2 input-md"
                                value={formData.currentcontrasena}
                                name="currentcontrasena"
                                onChange={handleInputChange}
                            />
                            <input
                                type="password"
                                placeholder="Contraseña Nueva"
                                className="input border border-blue-950 rounded p-2 input-md"
                                value={formData.newcontrasena}
                                name="newcontrasena"
                                onChange={handleInputChange}
                            />
                            <input
                                type="text"
                                placeholder="País"
                                className="input border border-blue-950 rounded p-2 input-md"
                                value={formData.pais}
                                name="pais"
                                onChange={handleInputChange}
                            />
                        </form>
                    </div>

                    {/* Botones fijos en la parte inferior */}
                    <div className="modal-action fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-300 flex justify-between">
                        <button
                            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-950"
                            type="submit"
                            disabled={isUpdatingUsers}
                            onClick={async () => {
                                await updateUsers({ fotoPerfil, fotoPerfilBan });
                            }}
                        >
                            {isUpdatingUsers ? "Actualizando..." : "Guardar"}
                        </button>
                        {isError && <p className="text-red-500">{error.message}</p>}
                        <button className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-400" type="button" onClick={onClose}>
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

export default ModalActualizarUsuario;