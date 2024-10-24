import { useState } from "react";
import { useLocation } from "react-router-dom";
import LibrosTuyos from "./LibrosTuyos";  
import LibroSugerido from "./LibroSugerido"; 

const Libros = ({ authUser }) => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const initialFeedType = query.get('section') || "libros"; // Obtén la sección de la URL o establece un valor predeterminado
    const [feedType, setFeedType] = useState(initialFeedType);

    return (
        <>
            <div className='flex-[4_4_0] border-r border-primary min-h-screen'>
                {/* Header */}
                <div className='flex w-full border-b border-blue-950'>
                    <div
                        className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
                        onClick={() => setFeedType("libros")} // Cambia el estado a "libros"
                    >
                        Libros Sugeridas
                        {feedType === "libros" && (
                            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
                        )}
                    </div>
                    <div
                        className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
                        onClick={() => setFeedType("librosGuardados")} // Cambia el estado a "librosGuardados"
                    >
                        Libros Guardados
                        {feedType === "librosGuardados" && (
                            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
                        )}
                    </div>
                </div>

                {feedType === "librosGuardados" ? (
                    <LibrosTuyos authUser={authUser} />
                ) : (
                    <LibroSugerido authUser={authUser} />
                )}
            </div>
        </>
    );
};

export default Libros;
