import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import Select from 'react-select';
import toast from "react-hot-toast";

const EditProfileModal = ({ authUser }) => {

	// Lista de países
	const paises = [
		{ value: 'Argentina', label: 'Argentina' },
		{ value: 'Australia', label: 'Australia' },
		{ value: 'Austria', label: 'Austria' },
		{ value: 'Bélgica', label: 'Bélgica' },
		{ value: 'Brasil', label: 'Brasil' },
		{ value: 'Canadá', label: 'Canadá' },
		{ value: 'Chile', label: 'Chile' },
		{ value: 'China', label: 'China' },
		{ value: 'Colombia', label: 'Colombia' },
		{ value: 'Costa Rica', label: 'Costa Rica' },
		{ value: 'Croacia', label: 'Croacia' },
		{ value: 'Dinamarca', label: 'Dinamarca' },
		{ value: 'Egipto', label: 'Egipto' },
		{ value: 'El Salvador', label: 'El Salvador' },
		{ value: 'España', label: 'España' },
		{ value: 'Estados Unidos', label: 'Estados Unidos' },
		{ value: 'Finlandia', label: 'Finlandia' },
		{ value: 'Francia', label: 'Francia' },
		{ value: 'Alemania', label: 'Alemania' },
		{ value: 'Grecia', label: 'Grecia' },
		{ value: 'Guatemala', label: 'Guatemala' },
		{ value: 'Honduras', label: 'Honduras' },
		{ value: 'India', label: 'India' },
		{ value: 'Indonesia', label: 'Indonesia' },
		{ value: 'Irlanda', label: 'Irlanda' },
		{ value: 'Italia', label: 'Italia' },
		{ value: 'Japón', label: 'Japón' },
		{ value: 'México', label: 'México' },
		{ value: 'Nueva Zelanda', label: 'Nueva Zelanda' },
		{ value: 'Noruega', label: 'Noruega' },
		{ value: 'Panamá', label: 'Panamá' },
		{ value: 'Paraguay', label: 'Paraguay' },
		{ value: 'Perú', label: 'Perú' },
		{ value: 'Filipinas', label: 'Filipinas' },
		{ value: 'Portugal', label: 'Portugal' },
		{ value: 'República Checa', label: 'República Checa' },
		{ value: 'República Dominicana', label: 'República Dominicana' },
		{ value: 'Rumania', label: 'Rumania' },
		{ value: 'Rusia', label: 'Rusia' },
		{ value: 'Sudáfrica', label: 'Sudáfrica' },
		{ value: 'Suecia', label: 'Suecia' },
		{ value: 'Suiza', label: 'Suiza' },
		{ value: 'Taiwán', label: 'Taiwán' },
		{ value: 'Turquía', label: 'Turquía' },
		{ value: 'Ucrania', label: 'Ucrania' },
		{ value: 'Uruguay', label: 'Uruguay' },
		{ value: 'Venezuela', label: 'Venezuela' },
		{ value: 'Vietnam', label: 'Vietnam' },
		{ value: 'Reino Unido', label: 'Reino Unido' },
		{ value: 'Países Bajos', label: 'Países Bajos' },
	  ];


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

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();
	const [generosDisponibles, setGenerosDisponibles] = useState([]);
	const [isActive, setIsActive] = useState(authUser.activo); // Estado local para el usuario activo
	const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Estado para el modal de confirmación

	const handleInputChange = (e) => {
		const { name, value, checked } = e.target;
	
		if (name === "generoLiterarioPreferido") {
			if (checked && formData.generoLiterarioPreferido.length < 5) {
			  setFormData((prevData) => ({
				...prevData,
				generoLiterarioPreferido: [...prevData.generoLiterarioPreferido, value],
			  }));
			} else if (!checked) {
			  setFormData((prevData) => ({
				...prevData,
				generoLiterarioPreferido: prevData.generoLiterarioPreferido.filter(
				  (g) => g !== value
				),
			  }));
			}
		} else {
			// Validación para permitir solo letras y espacios en el campo 'nombreCompleto'
			if (name === "nombreCompleto") {
				const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
				if (!soloLetras.test(value)) {
					return; // Salir si el valor contiene caracteres no permitidos
				}
			}
			setFormData({ ...formData, [name]: value });
		}
	};

	  // Obtener lista de géneros literarios
	  const obtenerGeneros = async () => {
		try {
		  const response = await fetch("/api/geneLiter/getgeneros");
		  if (!response.ok) throw new Error("Error al obtener los géneros");
		  const data = await response.json();
		  setGenerosDisponibles(data);
		} catch (error) {
		  console.error("Error al obtener los géneros:", error);
		}
	  };
	
	  // Activar/Inactivar usuario
	  const toggleEstadoUsuario = async () => {
		try {
			const url = isActive
			? `/api/users/estadoDes/${authUser._id}` // Cambiado aquí para incluir el ID
			:  `/api/users/estadoAct/${authUser._id}`; // Cambiado aquí para incluir el ID
	  
		  const response = await fetch(url, {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({ id: authUser.id }),
		  });
	
		  if (!response.ok) throw new Error("Error al cambiar el estado");

		  setIsActive(!isActive);
		  toast.success(`Usuario ${isActive ? "inactivado" : "activado"} correctamente`);
		} catch (error) {
			toast.error("Error al inactivar cuenta")
		  console.error("Error al cambiar el estado:", error);
		}
	  };
	
	  const handleToggleClick = () => {
		setShowConfirmationModal(true); // Muestra el modal de confirmación
	};

	const handleConfirmToggle = () => {
		toggleEstadoUsuario();
		setShowConfirmationModal(false); // Cierra el modal de confirmación
	};

	const handleCancelToggle = () => {
		setShowConfirmationModal(false); // Cierra el modal de confirmación sin hacer cambios
	};

	  // Cargar datos iniciales y géneros disponibles
	  useEffect(() => {
		if (authUser) {
		  setFormData({
			nombre: authUser.nombre,
			nombreCompleto: authUser.nombreCompleto,
			correo: authUser.correo,
			pais: authUser.pais,
			biografia: authUser.biografia || "",
			newcontrasena: "",
			currentcontrasena: "",
			generoLiterarioPreferido: authUser.generoLiterarioPreferido || [],
		  });
		}
		obtenerGeneros();
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
				className="btn btn-outline rounded-full btn-sm"
				onClick={handleToggleClick}
			>
				{isActive ? "Activar" : "Inactivar"}
			</button>

			{/* Modal de confirmación */}
			{showConfirmationModal && (
				<dialog id='confirmation_modal' className='modal' open>
					<div className='modal-box'>
						<h3 className='font-bold'>Confirmación</h3>
						<p>¿Estás seguro de que deseas {isActive ? "activar" : "inactivar"} la cuenta?</p>
						<div className='modal-action'>
							<button className='btn' onClick={handleConfirmToggle}>Sí</button>
							<button className='btn' onClick={handleCancelToggle}>No</button>
						</div>
					</div>
				</dialog>
			)}

			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-blue-950 h-[500px]  shadow-md modal-scrollbar'>
					<h3 className='text-primary font-bold text-lg my-3'>Actualizar mi perfil</h3>
					<form
						className='text-primary flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap flex-col gap-y-2'>
						
							<label htmlFor='nombre' className='text-blue-950 font-semibold'>Nombre Usuario</label>
							<input
								type='text'
								id='nombre'
								placeholder='Nombre Usuario'
								className='flex-1 input border border-blue-950 rounded p-2 input-md'
								value={formData.nombre}
								name='nombre'
								onChange={handleInputChange}
							/>

							<label htmlFor='nombreCompleto' className='text-blue-950 font-semibold'>Nombre Completo</label>
							<input
								type='text'
								id='nombreCompleto'
								placeholder='Nombre Completo'
								className='flex-1 input border border-blue-950 rounded p-2 input-md'
								value={formData.nombreCompleto}
								name='nombreCompleto'
								onChange={handleInputChange}
							/>

							<label htmlFor='biografia' className='text-blue-950 font-semibold'>Biografía</label>
							<textarea
								id='biografia'
								placeholder='Biografía'
								className='w-full border border-blue-950 rounded p-2 input-md'
								value={formData.biografia}
								name='biografia'
								onChange={handleInputChange}
								maxLength={200}
								rows={4}
								style={{ resize: 'none', overflowWrap: 'break-word' }}
							/>
							
							<p>{(formData.biografia).length}/200 caracteres</p>

						</div>


						<div className='flex flex-wrap flex-col gap-y-2'>
							<label htmlFor='correo' className='text-blue-950 font-semibold'>Correo</label>
							<input
								type='email'
								placeholder='Correo'
								className='flex-1 input border border-blue-950 rounded p-2 input-md'
								value={formData.correo}
								name='correo'
								onChange={handleInputChange}
							/>
						</div>

						<div className='flex flex-wrap flex-col gap-y-2'>
							<label htmlFor='currentcontrasena' className='text-blue-950 font-semibold'>Contraseña actual</label>
							<input
								type='password'
								placeholder='Contraseña Actual'
								className='flex-1 input border border-blue-950 rounded p-2 input-md'
								value={formData.currentcontrasena}
								name='currentcontrasena'
								onChange={handleInputChange}
							/>

							<label htmlFor='currentcontrasena' className='text-blue-950 font-semibold'>Contraseña nueva</label>
							<input
								type='password'
								placeholder='Contraseña Nueva'
								className='flex-1 input border border-blue-950 rounded p-2 input-md'
								value={formData.newcontrasena}
								name='newcontrasena'
								onChange={handleInputChange}
							/>
						</div>

						<label htmlFor='pais' className='text-blue-950 font-semibold'>País</label>
						<Select
							id='pais'
							options={paises}
							value={paises.find(option => option.value === formData.pais) || null}
							onChange={(selectedOption) => {
							// Actualiza el estado cuando se selecciona un país
							handleInputChange({ target: { name: 'pais', value: selectedOption.value } });
							}}
							className='flex-1'
							placeholder='Selecciona un país'
						/>

						{/* Sección para seleccionar géneros literarios */}
						<div className="flex flex-wrap flex-col gap-y-2">
						<h4 className="font-bold">Selecciona hasta 5 géneros literarios:</h4>
						<div className="grid grid-cols-2 gap-2">
							{generosDisponibles.map((genero) => (
							<label key={genero.id} className="flex items-center cursor-pointer">
								<input
								type="checkbox"
								name="generoLiterarioPreferido"
								value={genero._id}
								checked={formData.generoLiterarioPreferido.includes(genero._id)}
								onChange={handleInputChange}
								className="hidden"
								/>
								<div
								className={`flex items-center border rounded-full p-2 ${
									formData.generoLiterarioPreferido.includes(genero._id)
									? "bg-blue-200"
									: "bg-white"
								}`}
								>
								{genero.nombre}
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
