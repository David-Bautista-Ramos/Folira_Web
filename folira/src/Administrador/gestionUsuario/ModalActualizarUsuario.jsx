import { useEffect, useState, useRef } from "react";
import useUpdateUsers from "../../hooks/useUpdateUsers";
import Select from "react-select"; // Importa react-select
import { BsEye, BsEyeSlash } from "react-icons/bs";


const ModalActualizarUsuario = ({ isOpen, onClose, userId, token }) => {

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

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);

    const [showNewPassword, setShowNewPassword] = useState(false);

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleCurrentPasswordVisibility = () => {
        setShowCurrentPassword(!showCurrentPassword);
    };

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

                            <form className="text-primary grid grid-cols-2 gap-x-8 gap-y-4 items-start" onSubmit={handleSubmit}>
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

                                {/* Primera columna - Información básica */}
                                
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
                                    <label className="col-span-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="Correo"
                                        className="input border border-blue-950 rounded p-2 w-full h-10"
                                        value={formData.correo}
                                        name="correo"
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="col-span-1 -mt-1">
                                    <label className="block mb-1">País</label>
                                    <Select
                                        type="text"
                                        placeholder="Selecciona un país"
                                        options={paises}
                                        className="border border-blue-950 rounded"
                                        value={paises.find((pais) => pais.value === formData.pais)}
                                        name="pais"
                                        onChange={handleInputChange}
                                    />
                                </div>
                                    

                                {/* Segunda columna - Contraseñas, País y Rol */}
                                
                                <div>
                                    <label className="block mb-1">Contraseña Actual</label>
                                    <div className="relative">
                                        <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        placeholder="Contraseña Actual"
                                        className="input border border-blue-950 rounded p-2 w-full h-10 pr-10"
                                        value={formData.currentcontrasena}
                                        name="currentcontrasena"
                                        onChange={handleInputChange}
                                        />
                                        {/* Mostrar el icono según el estado de visibilidad */}
                                        {showCurrentPassword ? (
                                        <BsEye
                                            onClick={toggleCurrentPasswordVisibility}
                                            className="absolute right-3 top-3 cursor-pointer text-blue-950"
                                        />
                                        ) : (
                                        <BsEyeSlash
                                            onClick={toggleCurrentPasswordVisibility}
                                            className="absolute right-3 top-3 cursor-pointer text-blue-950"
                                        />
                                        )}
                                    </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1">Contraseña Nueva</label>
                                        <div className="relative">
                                            <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            placeholder="Contraseña Nueva"
                                            className="input border border-blue-950 rounded p-2 w-full h-10 pr-10"
                                            value={formData.newcontrasena}
                                            name="newcontrasena"
                                            onChange={handleInputChange}
                                            />
                                            {/* Mostrar el icono según el estado de visibilidad */}
                                            {showNewPassword ? (
                                            <BsEye
                                                onClick={toggleNewPasswordVisibility}
                                                className="absolute right-3 top-3 cursor-pointer  text-blue-950"
                                            />
                                            ) : (
                                            <BsEyeSlash
                                                onClick={toggleNewPasswordVisibility}
                                                className="absolute right-3 top-3 cursor-pointer text-blue-950"
                                            />
                                            )}
                                        </div>
                                    </div>
                                    

                                <div className="col-span-1">
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
                                    <label className="col-span-1">Biografía</label>
                                    <textarea
                                        placeholder="Biografía"
                                        className="border border-blue-950 rounded p-2 w-full"
                                        value={formData.biografia}
                                        name="biografia"
                                        onChange={handleInputChange}
                                        maxLength={200}
                                        rows={4}
                                        style={{ resize: 'none', overflowWrap: 'break-word' }}
                                    />
                                    <div className="text-right text-sm text-gray-500 mt-1">
                                        {formData.biografia.length} / 200 caracteres 
                                    </div>
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
                                  {isUpdatingUsers ? "Actualizando..." : "Actualizar"}
                                </button>
                                    {isError && <p className="text-red-500">{error.message}</p>}
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

export default ModalActualizarUsuario;
