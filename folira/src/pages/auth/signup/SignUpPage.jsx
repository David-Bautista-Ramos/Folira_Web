import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import Folira_logo from "../../../assets/img/Folira_logo (1).svg";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Select from 'react-select';

const SignUpPage = () => {
	
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

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar la confirmación de contraseña
	const [selectedCountry, setSelectedCountry] = useState(null);
	const [redirectToHome, setRedirectToHome] = useState(false);
	const [formData, setFormData] = useState({
		correo: "",
		nombre: "",
		nombreCompleto: "",
		pais: "",
		contrasena: "",
		confirmarContrasena: "", // Nuevo campo para la confirmación de contraseña
	});

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ correo, nombre, nombreCompleto, pais, contrasena }) => {
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ correo, nombre, nombreCompleto, pais, contrasena }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed to create account");
			return data;
		},
		onSuccess: () => {
			toast.success("Cuenta creada exitosamente");
			setRedirectToHome(true); // Configura la redirección al inicio
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		// Agrega el país seleccionado al formData
		if (selectedCountry) {
			setFormData((prev) => ({ ...prev, pais: selectedCountry.value }));
		}

		// Verifica si las contraseñas coinciden
		if (formData.contrasena !== formData.confirmarContrasena) {
			toast.error("Las contraseñas no coinciden");
			return;
		}

		mutate(formData);
	};

	if (redirectToHome) {
		return <Navigate to="/" />; // Redirecciona al inicio
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
	  
		// Validar que el nombre completo solo contenga letras y espacios
		if (name === 'nombreCompleto') {
		  const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Expresión regular para letras y espacios
		  if (!soloLetras.test(value)) {
			return; // Si contiene algo diferente a letras/espacios, no actualizar el estado
		  }
		}
	  
		setFormData({ ...formData, [name]: value });
	  };
	  

	const handleChange = (selectedOption) => {
		setSelectedCountry(selectedOption);
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10 '>
			<div className='flex-1 hidden lg:flex items-center justify-center'>
				<img className="w-50 h-50 cursor-pointer" src={Folira_logo} alt="logo_nav" />
			</div>

			<div className='flex-1 flex flex-col justify-center items-center '>
				<div className='lg:w-2/3 mx-auto md:mx-20 flex flex-col'>
					<h1 className='text-4xl font-extrabold text-primary mb-4'>Únete hoy.</h1>

					{/* Contenedor scrollable */}
					<div className='overflow-y-auto max-h-[70vh] scrollable-container'>
						<form className='flex gap-4 flex-col' onSubmit={handleSubmit} >
							<img className="w-50 h-40 mt-[20px] -mb-[50px] cursor-pointer lg:hidden" src={Folira_logo} alt="logo_nav" />

							{/* Campo de Correo */}
							<label className='flex flex-col'>
								<span className='font-bold'>Correo:</span>
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
							</label>

							{/* Campo de Nombre de Usuario */}
							<label className='flex flex-col'>
								<span className='font-bold'>Nombre de Usuario:</span>
								<label className='input input-bordered rounded flex items-center gap-2'>
									<FaUser />
									<input
										type='text'
										className='grow'
										placeholder='Nombre de Usuario'
										name='nombre'
										onChange={handleInputChange}
										value={formData.nombre}
									/>
								</label>
							</label>

							{/* Campo de Nombre Completo */}
							<label className='flex flex-col'>
								<span className='font-bold'>Nombre Completo:</span>
								<label className='input input-bordered rounded flex items-center gap-2'>
									<FaUser />
									<input
									type='text'
									className='grow'
									placeholder='Nombre Completo'
									name='nombreCompleto'
									onChange={handleInputChange}
									value={formData.nombreCompleto}
									/>
								</label>
							</label>


							{/* Selección de País */}
							<label className='flex flex-col'>
								<span className='font-bold'>País:</span>
								<Select
									value={selectedCountry}
									onChange={handleChange}
									options={paises}
									placeholder="Elige un país..."
									className="basic-single"
									classNamePrefix="select"
								/>
							</label>

							{/* Campo de Contraseña */}
							<label className='flex flex-col'>
								<span className='font-bold'>Contraseña:</span>
								<label className='input input-bordered rounded flex items-center gap-2'>
									<MdPassword />
									<input
										type={showPassword ? 'text' : 'password'} // Alterna tipo de campo
										className='grow'
										placeholder='Contraseña'
										name='contrasena'
										onChange={handleInputChange}
										value={formData.contrasena}
									/>
									{/* Icono de visibilidad */}
									{showPassword ? (
										<FaEyeSlash onClick={() => setShowPassword(false)} className="cursor-pointer" />
									) : (
										<FaEye onClick={() => setShowPassword(true)} className="cursor-pointer" />
									)}
								</label>
							</label>

							{/* Campo de Confirmar Contraseña */}
							<label className='flex flex-col'>
								<span className='font-bold'>Confirmar Contraseña:</span>
								<label className='input input-bordered rounded flex items-center gap-2'>
									<MdPassword />
									<input
										type={showConfirmPassword ? 'text' : 'password'}
										className='grow'
										placeholder='Confirmar Contraseña'
										name='confirmarContrasena'
										onChange={handleInputChange}
										value={formData.confirmarContrasena}
									/>
									{/* Icono de visibilidad */}
									{showConfirmPassword ? (
										<FaEyeSlash onClick={() => setShowConfirmPassword(false)} className="cursor-pointer" />
									) : (
										<FaEye onClick={() => setShowConfirmPassword(true)} className="cursor-pointer" />
									)}
								</label>
							</label>

							<button className='btn rounded-full btn-primary text-white'>
								{isPending ? "cargando..." : "Registrarse"}
							</button>
						</form>
						{isError && <p className="text-red-500">{error.message}</p>}
						<p className='text-center mt-4'>
							¿Ya tienes una cuenta? <Link to="/login" className='font-bold text-primary'>Inicia sesión</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
