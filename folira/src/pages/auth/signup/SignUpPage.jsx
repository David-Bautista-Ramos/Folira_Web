import { Link, Navigate, useNavigate } from "react-router-dom";
import {  useEffect, useState } from "react";
import Folira_logo from "../../../assets/img/Folira_logo (1).svg";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { FaEye, FaEyeSlash, FaUser } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Select from 'react-select';

const SignUpPage = () => {
	
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
    

    const[correoExists, setCorreoExists] = useState(false);
    const[nombreExists, setNombreExists] = useState(false);
    const[nombreCompletoExists, setNombreCompletoExists] = useState(false);

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

    const [formErrors, setFormErrors] = useState({
        correo: "",
        nombre: "",
        contrasena: "",
        confirmarContrasena: "",
    });

      // Función para redirigir

      // Debounced check user existence
   
      useEffect(() => {
        // Llama a la función de validación solo cuando el correo cambie
        if (formData.correo.length > 0) {
          validacionCorreo(formData.correo);
        }
      }, [formData.correo]); // Solo depende de formData.correo

      useEffect(() => {
        // Llama a la función de validación solo cuando el correo cambie
        if (formData.nombre.length > 0) {
          validacionNombre(formData.nombre);
        }
      }, [formData.nombre]); // Solo depende de formData.correo

      useEffect(() => {
        // Llama a la función de validación solo cuando el correo cambie
        if (formData.nombreCompleto.length > 0) {
          validacionNombreCompleto(formData.nombreCompleto);
        }
      }, [formData.nombreCompleto]); // Solo depende de formData.correo

    const navigate = useNavigate(); // Declara navigate fuera del hook de mutación

	const { mutate, isError, isPending, error } = useMutation({
        
		mutationFn: async ({ correo, nombre, nombreCompleto, pais, contrasena }) => {
            const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ correo, nombre, nombreCompleto, pais, contrasena }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "No se pudo crear la cuenta");
			return data;
		},
		onSuccess: () => {
			toast.success("Cuenta creada exitosamente");
            navigate("/"); // Redirige directamente
			setRedirectToHome(true); // Configura la redirección al inicio
		},

	});

	 const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedCountry) {
      setFormData((prev) => ({ ...prev, pais: selectedCountry.value }));
    }

    // Verifica si las contraseñas coinciden
    if (formData.contrasena !== formData.confirmarContrasena) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (correoExists) {
        toast.error("Este correo ya está registrado.");
        return;
      }
      if (nombreExists) {
        toast.error("Este nombre de usuario ya está registrado.");
        return;
      }

      if (nombreCompletoExists) {
        toast.error("Este nombre completo de usuario ya está registrado.");
        return;
      }
  
      mutate(formData);

  };

  if (redirectToHome) {
    return <Navigate to="/" />;
  }
  const validacionCorreo = async (correo) => {
    if (correo.length > 0) {
      const response = await fetch(`/api/users/VerifiCOR?correo=${correo}`);
      const result = await response.json();
      setCorreoExists(result.exists);
    } else {
      setCorreoExists(false);
    }
  };

  const validacionNombre = async (nombre) => {
    if (nombre.length > 0) {
      const response = await fetch(`/api/users/VerifiNOM?nombre=${nombre}`);
      const result = await response.json();
      setNombreExists(result.exists);
    } else {
      setNombreExists(false);
    }
  };

  const validacionNombreCompleto = async (nombreCompleto) => {
    if (nombreCompleto.length > 0) {
      const response = await fetch(`/api/users/VerifiNOMCOMPL?nombreCompleto=${nombreCompleto}`);
      const result = await response.json();
      setNombreCompletoExists(result.exists);
    } else {
      setNombreCompletoExists(false);
    }
  };

    
	const handleInputChange = (e) => {
        const { name, value } = e.target;
        let errorMessage = "";
    
        if (name === 'nombre') {
            const validUsername = /^[a-zA-Z0-9]*$/; // Eliminamos \s para no permitir espacios
            if (!validUsername.test(value)) {
                errorMessage = "El nombre de usuario solo puede contener letras y números, sin espacios.";
            }
        }
        
    
        if (name === 'correo') {
            const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !validEmail.test(value)) {
                errorMessage = "Por favor, ingresa un correo electrónico válido.";
            }
        }
    
        if (name === 'contrasena') {
          const validPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d+!@#$%^&*(),.?":{}|<>]{8,}$/;
            if (value && !validPassword.test(value)) {
              errorMessage = "La contraseña debe tener al menos 8 caracteres, incluir al menos una letra, un número y un carácter especial.";
            }
  
        }
    
        if (name === 'confirmarContrasena') {
            if (value && value !== formData.contrasena) {
                errorMessage = "Las contraseñas no coinciden.";
            }
        }
    
        setFormErrors({ ...formErrors, [name]: errorMessage });
        setFormData({ ...formData, [name]: value });
    };
  
	  

	const handleChange = (selectedOption) => {
		setSelectedCountry(selectedOption);
	};

	return (
<div className='max-w-screen-xl mx-auto flex h-screen px-10 '>
    <div className='flex-1 hidden lg:flex items-center justify-center'>
        <img className="w-50 h-50 -ml-[75%] cursor-pointer" src={Folira_logo} alt="logo_nav" />
    </div>

    <div className='flex-1 flex flex-col -ml-[100px] justify-center items-center '>
        <div className='lg:w-[140%] mx-auto md:mx-20 ml-10 flex flex-col'>
            <h1 className='text-4xl font-extrabold text-primary mb-4'>Únete hoy.</h1>
            {/* Contenedor scrollable */}
            <div className='overflow-y-auto max-h-[70vh] scrollable-container'>
                <form className='grid grid-cols-1 md:grid-cols-2 gap-4' onSubmit={handleSubmit}>
                    <img className="w-50 h-40 mt-[20px] -mb-[50px] cursor-pointer lg:hidden" src={Folira_logo} alt="logo_nav" />

                    {/* Campo de Correo */}
                    <label className='flex flex-col w-full'>
                        <span className='font-bold'>Correo:</span>
                        <label className='input input-bordered rounded flex items-center gap-2 w-full'>
                            <MdOutlineMail />
                            <input
                                type='email'
                                className='grow w-full'
                                placeholder='Correo'
                                name='correo'
                                onChange={handleInputChange}
                                value={formData.correo}
                            />
                        </label>
                        {formErrors.correo && <span className="text-red-500 text-sm">{formErrors.correo}</span>}
                        {correoExists && <span className="text-red-500 text-sm">Este correo ya está registrado.</span>}
                        </label>

                    {/* Campo de Nombre de Usuario */}
                    <label className='flex flex-col w-full'>
                        <span className='font-bold'>Nombre de Usuario:</span>
                        <label className='input input-bordered rounded flex items-center gap-2 w-full'>
                            <FaUser />
                            <input
                                type='text'
                                className='grow w-full'
                                placeholder='Nombre de Usuario'
                                name='nombre'
                                onChange={handleInputChange}
                                value={formData.nombre}
                            />
                        </label>
                        {formErrors.nombre && <span className="text-red-500 text-sm">{formErrors.nombre}</span>}
                        {nombreExists && <span className="text-red-500 text-sm">Este nombre de usuario ya está registrado.</span>}
                        </label>

                    {/* Campo de Nombre Completo */}
                    <label className='flex flex-col w-full'>
                        <span className='font-bold'>Nombre Completo:</span>
                        <label className='input input-bordered rounded flex items-center gap-2 w-full'>
                            <FaUser />
                            <input
                                type='text'
                                className='grow w-full'
                                placeholder='Nombre Completo'
                                name='nombreCompleto'
                                onChange={handleInputChange}
                                value={formData.nombreCompleto}
                            />
                        </label>
                        {nombreCompletoExists && <span className="text-red-500 text-sm">Este nombre completo de usuario ya está registrado.</span>}
                    </label>

                    {/* Selección de País */}
                    <label className='flex flex-col w-full'>
                        <span className='font-bold'>País:</span>
                        <Select
                            value={selectedCountry}
                            onChange={handleChange}
                            options={paises}
                            placeholder="Elige un país..."
                            className="basic-single w-full"
                            classNamePrefix="select"
                        />
                    </label>

                    {/* Campo de Contraseña */}
                    <label className='flex flex-col w-full'>
                        <span className='font-bold'>Contraseña:</span>
                        <label className='input input-bordered rounded flex items-center gap-2 w-full'>
                            <MdPassword />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className='grow w-full'
                                placeholder='Contraseña'
                                name='contrasena'
                                onChange={handleInputChange}
                                value={formData.contrasena}
                            />
                            {showPassword ? (
                                <FaEyeSlash onClick={() => setShowPassword(false)} className="cursor-pointer" />
                            ) : (
                                <FaEye onClick={() => setShowPassword(true)} className="cursor-pointer" />
                            )}
                        </label>
                        {formErrors.contrasena && <span className="text-red-500 text-sm">{formErrors.contrasena}</span>}
                    </label>

                    {/* Campo de Confirmar Contraseña */}
                    {/* Campo de Confirmar Contraseña */}
                    <label className='flex flex-col w-full'>
                        <span className='font-bold'>Confirmar Contraseña:</span>
                        <label className='input input-bordered rounded flex items-center gap-2 w-full'>
                            <MdPassword />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className='grow w-full'
                                placeholder='Confirmar Contraseña'
                                name='confirmarContrasena'
                                onChange={handleInputChange}
                                value={formData.confirmarContrasena}
                            />
                            {showConfirmPassword ? (
                                <FaEyeSlash onClick={() => setShowConfirmPassword(false)} className="cursor-pointer" />
                            ) : (
                                <FaEye onClick={() => setShowConfirmPassword(true)} className="cursor-pointer" />
                            )}
                        </label>
                        {formErrors.confirmarContrasena && <span className="text-red-500 text-sm">{formErrors.confirmarContrasena}</span>}
                    </label>


                    <div className='col-span-1 md:col-span-2 flex justify-center'>
                        <button className='btn rounded-full btn-primary text-white'>
                            {isPending ? "cargando..." : "Registrarse"}
                        </button>
                    </div>
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
