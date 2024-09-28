import { useState } from "react";
import TusComunidades from "./TusComunidades";
import ComunidadesSugeridas from "./ComunidadesSugeridas";
import BuscadorComunidad from "./ComunidadBusqueda";


const Comunidad = () => {

    const [feedType, setFeedType] = useState("forYouComuni");

    return (
        <>
           <div className='flex-[4_4_0] border-r border-primary min-h-screen '>
            {/* Header */}

				<div className='flex w-full border-b border-blue-950'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYouComuni")}
					>
						Comunidades  Sugeridas
						{feedType === "forYouComuni" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")}
					>
						Tus comunidades
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
                    
				</div>
                <BuscadorComunidad/>


                {/*  CREATE POST INPUT */}
				<TusComunidades />

                {/* POSTS */}
                <ComunidadesSugeridas />
				
                
            </div>
        </>
    );
};

export default Comunidad;