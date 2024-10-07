import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate para redirecciones
import XSvg from "../../../components/svgs/X.jsx";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from 'react-hot-toast';

const LoginPage = () => {
	const [formData, setFormData] = useState({
		correo: "",
		contrasena: "",
	});

	const queryClient = useQueryClient();
	const navigate = useNavigate(); // Hook para redirección

	const { 
		mutate: loginMutation,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ correo, contrasena }) => {
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
					throw new Error(data.error || "Algo salió mal");
				}

				// Devuelve la información del usuario
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
		onSuccess: (data) => {
			toast.success("Inicio de sesión exitoso");

			// Guardar rol en el localStorage o en el estado
			const userRole = data.role || data.roles; // Asegura que el nombre del campo sea correcto
			localStorage.setItem("userRole", userRole);

			// Redirigir al usuario según su rol
			if (userRole === "admin") {
				navigate("/gestionUsuario"); // Ruta para administradores
			} else {
				navigate("/"); // Ruta para usuarios normales
			}

			// Refrescar la consulta del usuario autenticado
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
				<XSvg className='lg:w-2/3 fill-blue' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-27 lg:hidden text-blue-900' />
					<h1 className='text-blue-950 text-4xl font-extrabold'>{"Vamos"} a Iniciar.</h1>
					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Correo'
							name='correo'
							onChange={handleInputChange}
							value={formData.correo}
						/>
					</label>

					<label className='input input-bordered rounded flex items-center gap-2'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Contraseña'
							name='contrasena'
							onChange={handleInputChange}
							value={formData.contrasena}
						/>
					</label>
					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Cargando..." : "Iniciar Sesión"}
					</button>
					{isError && <p className='text-blue-900'>{error.message}</p>}
				</form>
				<div className='flex flex-col gap-2 mt-4'>
					<p className='text-blue-950 text-lg'>{"No"} tiene una cuenta?</p>
					<Link to='/signup'>
						<button className='btn rounded-full btn-primary text-blue-950 btn-outline w-full'>
							Registrarme
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
