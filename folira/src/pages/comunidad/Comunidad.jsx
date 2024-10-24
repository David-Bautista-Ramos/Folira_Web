import { useState } from "react";
import TusComunidades from "./TusComunidades";
import ComunidadesSugeridas from "./ComunidadesSugeridas";


const Comunidad = ({authUser}) => {

    const [feedType, setFeedType] = useState("sugerComunidad");

    return (
        <>
           <div className='flex-[4_4_0] border-r border-primary min-h-screen '>
            {/* Header */}

				<div className='flex w-full border-b border-blue-950'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("sugerComunidad")}
					>
						Comunidades  Sugeridas
						{feedType === "sugerComunidad" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("myComuni")}
					>
						Tus comunidades
						{feedType === "myComuni" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
                    
				</div>

				{/* Insignias según el tipo seleccionado */}
				{feedType === "sugerComunidad" && <ComunidadesSugeridas authUser={authUser}/>}
                {feedType === "myComuni" && <TusComunidades authUser={authUser} />}
				
                
            </div>
        </>
    );
};

export default Comunidad;