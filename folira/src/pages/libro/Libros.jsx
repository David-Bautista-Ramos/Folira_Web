import { useState } from "react";
import LibrosTuyos from "./LibrosTuyos";  // Componente que muestra los libros guardados
import LibroSugerido from "./LibroSugerido"; // Componente que muestra libros sugeridos

const Libros = ({ authUser }) => {
    const [feedType, setFeedType] = useState("libros"); // Estado para controlar cuál componente se muestra

    return (
        <>
            <div className='flex-[4_4_0] border-r border-primary min-h-screen'>
                {/* Header */}
                <div className='flex w-full border-b border-blue-950'>
                    {/* Pestaña de Libros Sugeridos */}
                    <div
                        className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
                        onClick={() => setFeedType("libros")} // Cambia el estado a "libros"
                    >
                        Libros Sugeridas
                        {/* Indicador activo */}
                        {feedType === "libros" && (
                            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
                        )}
                    </div>
                    {/* Pestaña de Libros Guardados */}
                    <div
                        className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
                        onClick={() => setFeedType("librosGuardados")} // Cambia el estado a "librosGuardados"
                    >
                        Libros Guardados
                        {/* Indicador activo */}
                        {feedType === "librosGuardados" && (
                            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
                        )}
                    </div>
                </div>


                {/* Renderiza el componente correspondiente basado en el estado */}
                {feedType === "librosGuardados" ? (
                    <LibrosTuyos authUser={authUser} /> // Muestra LibrosTuyos si está seleccionado "librosGuardados"
                ) : (
                    <LibroSugerido authUser={authUser} /> // Muestra LibroSugerido en caso contrario
                )}
            </div>
        </>
    );
};

export default Libros;
