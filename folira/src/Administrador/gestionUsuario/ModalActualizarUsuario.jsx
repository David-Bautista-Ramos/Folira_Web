import { useState } from 'react';
import { BsEye } from 'react-icons/bs';
import { IoEyeOff } from 'react-icons/io5';
 // Importa los iconos de Bicon

function ModalActualizarUsuario({ isOpen, onClose }) {
    const [image, setImage] = useState("");
    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");
    const [bio, setBio] = useState("");
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña

    if (!isOpen) return null;

    const handleImageChange = (e) => {
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const validateFields = () => {
        const newErrors = {};
        
        // Validar correo electrónico
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            newErrors.email = "Por favor, ingrese un correo electrónico válido.";
        }
        
        // Validar contraseña
        if (password.length < 6) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Devuelve verdadero si no hay errores
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateFields()) {
            // Aquí puedes enviar los datos al servidor o realizar otra acción
            console.log("Datos validados correctamente");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div
                className="bg-white p-5 rounded-lg w-90 md:w-106 relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
               
                <div className="border-b-2 border-primary pb-2 mb-5">
                    <h2 className="text-lg text-center text-primary">ACTUALIZAR USUARIO</h2>
                </div>
                <div className="overflow-y-auto max-h-80 mb-5 text-primary text-lg modal-scrollbar">
                    {/* Campo de imagen de perfil */}
                    <label className="block mb-1  text-primary">Foto de perfil</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
                    />
                    {image && (
                        <img src={image} alt="Preview" className="max-w-full h-auto mb-3" />
                    )}

                    {/* Campo de nombre de usuario */}
                    <label className="block mb-1  text-primary">Nombre usuario</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Nombre usuario"
                        className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
                    />

                    {/* Campo de nombre completo */}
                    <label className="block mb-1  text-primary">Nombre completo</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Nombre completo"
                        className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
                    />

                    {/* Campo de correo electrónico */}
                    <label className="block mb-1  text-primary">Correo electrónico</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    {/* Campo de contraseña */}
                    <label className="block mb-1  text-primary">Contraseña</label>
                    <div className="relative mb-3">
                        <input
                            type={showPassword ? 'text' : 'password'} // Cambia el tipo según el estado
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 px-3 focus:outline-none"
                            onClick={() => setShowPassword(!showPassword)} // Alterna el estado de mostrar/ocultar
                        >
                            {showPassword ? (
                                <BsEye className="w-5 h-5 text-gray-500" /> // Icono para mostrar contraseña
                            ) : (
                                <IoEyeOff className="w-5 h-5 text-gray-500" /> // Icono para ocultar contraseña
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                    {/* Campo de fecha de nacimiento */}
                    <label className="block mb-1  text-primary">Fecha de nacimiento</label>
                    <input
                        type="text"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        placeholder="Fecha de nacimiento"
                        className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
                    />

                    {/* Campo de biografía */}
                    <label className="block mb-1  text-primary">Biografía</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Biografía"
                        className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400" onClick={onClose}>
                        Cancelar
                    </button>
                    <button className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950" onClick={handleSubmit}>
                        Actualizar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalActualizarUsuario;
