import { useState } from "react";
import AmigoSugeridos from "./AmigoSugeridos";

const Amigos = ({ authUser }) => {

  const [feedType, setFeedType] = useState("amigos");

  return (
    <>
      <div className='flex-[4_4_0] border-r border-primary min-h-screen'>
        {/* Header */}
        <div className='flex w-full border-b border-blue-950'>
          <div
            className={
              "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            }
            onClick={() => setFeedType("amigos")}
          >
            Sugerencias de Amigos 
            {feedType === "amigos" && (
              <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
            )}
          </div>
        </div>
        {/* Contenido según el tipo seleccionado */}
        {feedType === "amigos" && <AmigoSugeridos authUser={authUser} />}
      </div>
    </>
  );
};

export default Amigos;
