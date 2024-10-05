import { Link } from "react-router-dom";
import { useState } from "react";

import Folira_logo from "../../../assets/img/Folira_logo (1).svg"; 


import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";


const SignUpPage = () => {
	const [formData, setFormData] = useState({
		correo: "",
		nombre: "",
		nombreCompleto:"",
		pais: "",
		contrasena: "",
	});

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ correo, nombre, nombreCompleto, pais, contrasena }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ correo,  nombre, nombreCompleto, pais, contrasena}),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Failed to create account");
				console.log(data);
				return data;
			} catch (error) {
				console.error(error);
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");

			// {
			// 	/* Added this line below, after recording the video. I forgot to add this while recording, sorry, thx. */
			// }
			// queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		mutate(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center  justify-center'>
				<img className="w-50 h-50 cursor-pointer" src={Folira_logo} alt="logo_nav" />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<img className="w-50 h-40 mt-[200px] -mb-[50px] cursor-pointer lg:hidden" src={Folira_logo} alt="logo_nav" />
					<h1 className='text-4xl font-extrabold text-primary'>Únete hoy.</h1>
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
					<div className='flex gap-4 flex-wrap'>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Nombre de Usuario'
								name='nombre'
								onChange={handleInputChange}
								value={formData.nombre}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<FaUser />
							<input
								type='text'
								className='grow '
								placeholder='Nombre Completo'
								name='nombreCompleto'
								onChange={handleInputChange}
								value={formData.nombreCompleto}
							/>
						</label>
						<label className='input input-bordered rounded flex items-center gap-2 flex-1'>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='País'
								name='pais'
								onChange={handleInputChange}
								value={formData.pais}
							/>
						</label>
					</div>
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
						{isPending ? "cargando..." : "Registrarse"}
					</button>
					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>
				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-primary text-lg'>Ya tienes una cuenta?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-primary btn-outline w-full'>Iniciar Sesión</button>
					</Link>
				</div>
			</div>
		</div>
	);
};
export default SignUpPage;