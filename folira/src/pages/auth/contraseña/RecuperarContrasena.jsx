import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/img/Folira_logo.png'

const RecuperarContrasena = () => {
    const [correo_usuario, setCorreo_Usuario] = useState('');
    const navigate = useNavigate();

    const validarCorreo = (correo) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(correo);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarCorreo(correo_usuario)) {
            alert('Correo inválido. Por favor ingresa un correo válido.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/olvido/recuperar-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo_usuario })
            });

            if (response.ok) {
                alert('¡Correo enviado! Se ha enviado una nueva contraseña a tu correo.');
                navigate('/Login');
            } else {
                alert('Error al enviar la nueva contraseña. Inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ha ocurrido un error inesperado. Por favor, inténtalo más tarde.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
                <div className="w-48 h-48">
                    <img
                        className="rounded-lg object-cover h-[190px] w-[150px]  border-gray-300"
                        src={logo}
                        alt="logo folira"
                    />
                </div>
            </div>

                <h2 className="text-center text-2xl font-bold">Recuperar contraseña</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <p className="text-center text-gray-600">
                        Por favor ingresa el correo asociado a tu cuenta
                    </p>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            placeholder="Ingrese su correo"
                            value={correo_usuario}
                            onChange={(e) => setCorreo_Usuario(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-primary hover:bg-blue-950 text-white font-semibold rounded-md"
                        >
                            Enviar
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <Link to="/Login" className="text-primary hover:underline">
                        Volver
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RecuperarContrasena;
