import { useState } from "react";
import { Link } from "react-router-dom";
import Folira_logo from "../../../assets/img/Folira_logo (1).svg"; 
import { MdOutlineMail, MdPassword, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        correo: "",
        contrasena: "",
    });
    const [showPassword, setShowPassword] = useState(false); // Estado para la visibilidad de la contraseña
    const queryClient = useQueryClient();

    const { 
        mutate: loginMutation,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ correo , contrasena }) => {
            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ correo, contrasena }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            toast.success("Inición de sesión exitosa");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation(formData);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen'>
            <div className='flex-1 hidden lg:flex items-center justify-center'>
                <img className="w-45 h-50 cursor-pointer" src={Folira_logo} alt="logo_nav" />
            </div>
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <img className="w-50 h-40 mt-[100px] cursor-pointer lg:hidden" src={Folira_logo} alt="logo_nav" />
                    <h1 className='text-4xl text-primary font-extrabold'>{"Vamos"} a Iniciar.</h1>
                    <label className='flex flex-col mb-2'> {/* Contenedor para el label y el input */}
                        <span className="font-semibold">Correo:</span> {/* Label agregado */}
                        <div className='input input-bordered rounded flex items-center gap-2'>
                            <MdOutlineMail />
                            <input
                                type='email'
                                className='grow'
                                placeholder='Correo'
                                name='correo'
                                onChange={handleInputChange}
                                value={formData.correo}
                            />
                        </div>
                    </label>

                    <label className='flex flex-col mb-2'> {/* Contenedor para el label y el input */}
                        <span className="font-semibold">Contraseña:</span> {/* Label agregado */}
                        <div className='input input-bordered rounded flex items-center gap-2'>
                            <MdPassword />
                            <input
                                type={showPassword ? 'text' : 'password'} // Cambia entre texto y contraseña
                                className='grow'
                                placeholder='Contraseña'
                                name='contrasena'
                                onChange={handleInputChange}
                                value={formData.contrasena}
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)} // Cambia el estado al hacer clic
                                className='text-gray-600'
                            >
                                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                            </button>
                        </div>
                    </label>

                    {/* Enlace para recuperar contraseña */}
                    <div className="text-center">
                        <Link to='/recuperarContrasena' className='text-blue-950 hover:underline'>
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>

                    <button className='btn rounded-full btn-primary text-white'>
                        {isPending  ? "Cargando..." : "Iniciar Sesión"}
                    </button>
                    {isError && <p className='text-blue-900'>{error.message}</p>}
                </form>
                <div className='flex flex-col gap-2 mt-4'>
                    <p className='text-blue-950 text-lg'>{"No"} tiene una cuenta?</p>
                    <Link to='/signup'>
                        <button className='btn rounded-full btn-primary text-blue-950 btn-outline w-full'>Registrarme</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
