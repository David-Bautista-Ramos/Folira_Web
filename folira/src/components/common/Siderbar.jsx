import { MdHomeFilled, MdMessage } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import {  FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {  BiLogOut, BiSolidFolder } from "react-icons/bi";
import { GiFeather, GiOpenBook } from "react-icons/gi";
import Folira_general from "../../assets/img/Folira_general.svg";
import { useRef } from "react";


const Sidebar = () => {

    const queryClient = useQueryClient();
    const startTime = useRef(Date.now()); // Usamos useRef para mantener el tiempo inicial

    // Al hacer logout, calculamos el tiempo en pantalla
    const { mutate: logout } = useMutation({
        mutationFn: async () => {
            try {
                const endTime = Date.now(); // Tiempo al cerrar sesión
                const tiempoEnPantalla = Math.floor((endTime - startTime.current) / 1000); // Tiempo en segundos

                const userId = authUser._id;

                const res = await fetch("/api/auth/logout", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ tiempoEnPantalla, userId })  // Enviamos el tiempo y el ID
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Algo salió mal");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            toast.success("Sesión cerrada con éxito");
        },
        onError: () => {
            toast.error("Error al cerrar sesión");
        },
    });
    
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    return (
        <div className='md:flex-[2_2_0] w-18 max-w-52'>
            <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-primary w-20 md:w-full'>
                <Link to="/" className="flex items-center">
                    <img className="w-20 h-40 -mt-[40px] -mb-[50px] cursor-pointer" src={Folira_general} alt="logo_nav" />
                </Link>
                <ul className='flex flex-col gap-3 mt-4'>
                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/'
                            className='flex gap-3 items-center hover:bg-gray-200 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <MdHomeFilled className='text-blue-950 w-8 h-8' />
                            <span className='text-lg hidden md:block'>Inicio</span>
                        </Link>
                    </li>

                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/notifications'
                            className='flex gap-3 items-center hover:bg-gray-200 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <IoNotifications className='text-blue-950 w-6 h-6' />
                            <span className='text-lg hidden md:block'>Notificaciones</span>
                        </Link>
                    </li>

                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to={`/profile/${authUser?.nombre}`} // Cambié a authUser?.nombre
                            className='flex gap-3 items-center hover:bg-gray-200 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <FaUser className='text-blue-950 w-6 h-6' />
                            <span className='text-lg hidden md:block'>Perfil</span>
                        </Link>
                    </li>

                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/libro'
                            className='flex gap-3 items-center hover:bg-gray-200 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <GiOpenBook className='text-blue-950 w-6 h-6' />
                            <span className='text-lg hidden md:block'>Libros</span>
                        </Link>
                    </li>

                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/autor'
                            className='flex gap-3 items-center hover:bg-gray-200 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <GiFeather className='text-blue-950 w-6 h-6' />
                            <span className='text-lg hidden md:block'>Autores</span>
                        </Link>
                    </li>

                    <li className='flex justify-center md:justify-start'>
                        <Link
                            to='/comunidad'
                            className='flex gap-3 items-center hover:bg-gray-200 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                        >
                            <MdMessage className='text-blue-950 w-6 h-6' />
                            <span className='text-lg hidden md:block'>Comunidades</span>
                        </Link>
                    </li>

                    {/* Botón de gestiones solo para admin */}
                    {authUser && authUser.roles === 'admin' && (
                        <li className='flex justify-center md:justify-start'>
                            <Link
                                to='/gestionUsuario' // Asegúrate de que la ruta a gestiones sea correcta
                                className='flex gap-3 items-center hover:bg-gray-200 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
                            >
                                <BiSolidFolder  className='text-blue-950 w-6 h-6' />
                                <span className='text-lg hidden md:block'>Gestiones</span>
                            </Link>
                        </li>
                    )}
                </ul>
                {authUser && (
                    <Link
                        to={`/profile/${authUser.nombre}`} // Cambié a authUser?.nombre
                        className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-gray-200 py-2 px-4 rounded-full'
                    >
                        <div className='avatar hidden md:inline-flex'>
                            <div className='w-8 rounded-full'>
                                <img src={authUser?.fotoPerfil || "/avatar-placeholder.png"} alt="avatar" />
                            </div>
                        </div>
                        <div className='flex justify-between flex-1'>
                            <div className='hidden md:block'>
                                <p className='text-primary font-bold text-sm w-20 truncate'>{authUser?.nombreCompleto}</p>
                                <p className='text-primary text-sm'>@{authUser?.nombre}</p>
                            </div>
                            <BiLogOut className='w-5 h-5 cursor-pointer -ml-5'
                                onClick={(e) => {
                                    e.preventDefault();
                                    logout();
                                }}
                            />
                        </div>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Sidebar;
