import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		nombre: "",
		nombreCompleto: "",
		correo: "",
		pais: "",
		biografia: "",
		newcontrasena: "",
		currentcontrasena: "",
		generos: [],
	});

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	const handleInputChange = (e) => {
		const { name, value, checked } = e.target;
		if (name === "generos") {
			if (checked) {
				if (formData.generos.length < 5) {
					setFormData((prevData) => ({
						...prevData,
						generos: [...prevData.generos, value],
					}));
				}
			} else {
				setFormData((prevData) => ({
					...prevData,
					generos: prevData.generos.filter((genero) => genero !== value),
				}));
			}
		} else {
			setFormData({ ...formData, [name]: value });
		}
	};

	useEffect(() => {
		if (authUser) {
			setFormData({
				nombre: authUser.nombre,
				nombreCompleto: authUser.nombreCompleto,
				correo: authUser.correo,
				pais: authUser.pais,
				biografia: authUser.biografia,
				newcontrasena: "",
				currentcontrasena: "",
				generos: authUser.generos || [],
			});
		}
	}, [authUser]);

	

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm mr-2'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Editar Perfil
			</button>

			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("confir_cuenta_modal").showModal()}
			>
				Inactivar
			</button>

			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-blue-950 h-[500px]  shadow-md modal-scrollbar'>
					<h3 className='text-primary font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='text-primary flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Nombre Usuario'
								className='flex-1 input border border-blue-950 rounded p-2 input-md'
								value={formData.nombre}
								name='nombre'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Nombre Completo'
								className='flex-1 input border border-blue-950 rounded p-2 input-md'
								value={formData.nombreCompleto}
								name='nombreCompleto'
								onChange={handleInputChange}
							/>

							<textarea
								placeholder='Biografía'
								className='w-full border border-blue-950 rounded p-2 input-md'
								value={formData.biografia}
								name='biografia'
								onChange={handleInputChange}
								maxLength={200}
								rows={4}
								style={{ resize: 'none', overflowWrap: 'break-word' }}
							/>
							<p>{formData.biografia.length}/200 caracteres</p>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Correo'
								className='flex-1 input border border-blue-950 rounded p-2 input-md'
								value={formData.correo}
								name='correo'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Contraseña Actual'
								className='flex-1 input border border-blue-950 rounded p-2 input-md'
								value={formData.currentcontrasena}
								name='currentcontrasena'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='Contraseña Nueva'
								className='flex-1 input border border-blue-950 rounded p-2 input-md'
								value={formData.newcontrasena}
								name='newcontrasena'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='País'
							className='flex-1 input border border-blue-950 rounded p-2 input-md'
							value={formData.pais}
							name='pais'
							onChange={handleInputChange}
						/>

						{/* Sección para seleccionar géneros literarios */}
						<div className='flex flex-col'>
							<h4 className='font-bold'>Selecciona hasta 5 géneros literarios:</h4>
							<div className='grid grid-cols-2 gap-2'>
								{[
									{ nombre: "Drama", imagen: "/path/to/drama.png" },
									{ nombre: "Terror", imagen: "/path/to/terror.png" },
									{ nombre: "Romance", imagen: "/path/to/romance.png" },
									{ nombre: "Comedia", imagen: "/path/to/comedia.png" },
									{ nombre: "Negocios", imagen: "/path/to/negocios.png" },
									{ nombre: "Historia", imagen: "/path/to/historia.png" },
									{ nombre: "Ciencia Ficción", imagen: "/path/to/Ciencia Ficción.png" },
									{ nombre: "Economia", imagen: "/path/to/economia.png" },
									{ nombre: "Psicología", imagen: "/path/to/psicología.png" },
									{ nombre: "Desarrollo Personal", imagen: "/path/to/desarrollo.png" },
								].map((genero) => (
									<label key={genero.nombre} className='flex items-center cursor-pointer '>
										<input
											type='checkbox'
											name='generos'
											value={genero.nombre}
											checked={formData.generos.includes(genero.nombre)}
											onChange={handleInputChange}
											className='hidden'
										/>
										<div className={`flex items-center border rounded-full p-2 ${formData.generos.includes(genero.nombre) ? 'bg-blue-200' : 'bg-white'}`}>
											<img src={genero.imagen} alt={genero.nombre} className='w-8 h-8 mr-2' />
											<span>{genero.nombre}</span>
										</div>
									</label>
								))}
							</div>
						</div>

						<button className='btn btn-primary rounded-full btn-sm text-white hover:bg-blue-950'>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>Cerrar</button>
				</form>
			</dialog>

			{/* Confirmas inactivación */}
			<dialog id='confir_cuenta_modal' className='modal'>
				<div className='modal-box border rounded-md border-blue-950 shadow-md'>
					<h3 className='text-primary text-center font-bold text-lg my-3'>
						¿Estás seguro de inactivar tu cuenta?
					</h3>

					{/* Contenedor para los botones en fila */}
					<div className="flex space-x-2 justify-center">
						

						<button className='px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400'>
							{"Cancelar"}
						</button>

						<button className='px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950'>
							{"Inactivar"}
						</button>
					</div>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>Cerrar</button>
				</form>
			</dialog>
		</>
	);
};

export default EditProfileModal;
