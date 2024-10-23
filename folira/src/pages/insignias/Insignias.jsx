import { useState } from "react";
import InsigniasGanadas from "./InsigniasGanadas";
import InsigniasDisponibles from "./InsigniasDisponibles";
import BuscadorInsignias from "./InsigniaBuscador";

const Insignias = () => {
    const [feedType, setFeedType] = useState("forYouInsignias");

    return (
        <>
            <div className='flex-[4_4_0] border-r border-primary min-h-screen'>
                {/* Header */}
                <div className='flex w-full border-b border-blue-950'>
                    <div
                        className={
                            "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                        }
                        onClick={() => setFeedType("forYouInsignias")}
                    >
                        Insignias Disponibles
                        {feedType === "forYouInsignias" && (
                            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
                        )}
                    </div>
                    <div
                        className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
                        onClick={() => setFeedType("earnedInsignias")}
                    >
                        Insignias Ganadas
                        {feedType === "earnedInsignias" && (
                            <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
                        )}
                    </div>
                </div>

                {/* Buscador de Insignias */}
                <BuscadorInsignias />

                {/* Insignias según el tipo seleccionado */}
                {feedType === "forYouInsignias" && <InsigniasDisponibles />}
                {feedType === "earnedInsignias" && <InsigniasGanadas />}
            </div>
        </>
    );
};

export default Insignias;
