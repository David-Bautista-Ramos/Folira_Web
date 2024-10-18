import { useState } from 'react';

const TerminosConditionsModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
    {/* Botón para abrir el modal */}
    <button
        onClick={toggleModal}
        className="rounded-full text-primary border border-transparent hover:bg-gray-200 px-4 py-2"
    >
        Términos y Condiciones
    </button>

    {/* Modal */}
    {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-11/12 md:w-2/3 lg:w-1/2">
                <h2 className="text-2xl font-bold mb-4">Términos y Condiciones</h2>
                <div className="max-h-96 overflow-y-auto mb-4 scrollbar-custom"> {/* Contenedor con scroll */}
                    <p className="mb-4">
                        Bienvenido a Folira. Estos Términos y Condiciones regulan tu acceso y uso de nuestra plataforma, 
                        diseñada para fomentar la comunicación y la comunidad entre personas que comparten un interés por 
                        los libros. Al utilizar nuestros servicios, aceptas cumplir con estos términos. Si no estás de 
                        acuerdo con alguno de ellos, no utilices nuestra plataforma.
                    </p>

                    <p className="mb-4">
                        Al registrarte en Folira, confirmas que tienes al menos 13 años y que tienes la capacidad legal para 
                        aceptar estos términos. Si representas a una entidad, afirmas que tienes la autoridad para vincular 
                        a dicha entidad a estos términos.
                    </p>

                    <p className="mb-4">
                        Folira permite a los usuarios crear perfiles, unirse a comunidades literarias, compartir reseñas de libros, 
                        interactuar con otros lectores y crear conexiones significativas. Nos comprometemos a proporcionar una 
                        plataforma segura y agradable para todos los usuarios.
                    </p>

                    <p className="mb-4">
                        Para acceder a ciertas funcionalidades de la plataforma, es posible que debas crear una cuenta. Al hacerlo, 
                        te comprometes a proporcionar información precisa y actualizada y a mantener la confidencialidad de tu 
                        contraseña y otra información de la cuenta. Eres responsable de todas las actividades que ocurran bajo tu cuenta.
                    </p>

                    <p className="mb-4">
                        Te comprometes a utilizar Folira de manera responsable y a no participar en actividades que incluyan, 
                        pero no se limiten a:
                    </p>

                    <ol className="list-disc pl-8 mb-4">
                        <li className="mb-2"> - Publicar contenido que sea ilegal, ofensivo, difamatorio, obsceno o que infrinja los derechos de propiedad intelectual de terceros.</li>
                        <li className="mb-2">- Realizar acoso, amenazas o intimidación hacia otros usuarios.</li>
                        <li className="mb-2">- Crear múltiples cuentas con la intención de manipular la plataforma o sus funcionalidades.</li>
                    </ol>


                    <p className="mb-4">
                        Todo el contenido, incluyendo texto, gráficos, logotipos, imágenes y software, disponible en Folira es propiedad de Folira o de sus 
                        licenciantes. Está prohibida la reproducción, distribución o modificación del contenido sin el consentimiento expreso de los propietarios.
                    </p>

                    <p className="mb-4">
                        Folira no promueve ni organiza encuentros presenciales entre los usuarios. Cualquier interacción o encuentro que se realice fuera de la 
                        plataforma es bajo la responsabilidad de los usuarios. Folira no se hace responsable de las consecuencias que puedan derivarse de tales interacciones.
                    </p>

                    <p className="mb-4">
                        Si tienes preguntas sobre estos Términos y Condiciones, puedes contactarnos a través de 
                        <span className="ml-2 text-blue-500 hover:text-blue-700 cursor-pointer" onClick={() => window.location.href = 'mailto:foliraweb@gmail.com'}>
                            foliraweb@gmail.com
                        </span>.
                    </p>

                </div>
                <div className="flex justify-end"> {/* Alinear el botón a la derecha */}
                    <button
                        onClick={toggleModal}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mr-5 hover:bg-gray-400"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )}
</>

    );
};

export default TerminosConditionsModal;
