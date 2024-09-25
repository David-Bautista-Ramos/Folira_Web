import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({authUser}) => {
	const [formData, setFormData] = useState({
		nombre: "",
		nombreCompleto: "",
		correo: "",
		pais: "",
		newcontrasena: "",
		currentcontrasena: "",
	});

	
	const {updateProfile,isUpdatingProfile}=useUpdateUserProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(()=>{
		if(authUser){
			setFormData({
				nombre:authUser.nombre,
				nombreCompleto:authUser.nombreCompleto,
				correo:authUser.correo,
				pais:authUser.pais,
				newcontrasena: "",
				currentcontrasena: "",
			})
		}
	},[authUser])

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Editar Perfil
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Nombre Usuario'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.nombre}
								name='nombre'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Nombre Completo'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.nombreCompleto}
								name='nombreCompleto'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Correo'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.correo}
								name='correo'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Contraseña Actual'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentcontrasena}
								name='currentcontrasena'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='Contraseña Nueva'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newcontrasena}
								name='newcontrasena'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='País'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.pais}
							name='pais'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white'>
							{isUpdatingProfile ?  "Updating..." : "Update" }
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>Cerrar</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;