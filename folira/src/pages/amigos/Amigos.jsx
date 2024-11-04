import { useState } from "react";
import AmigosSugeridos from './AmigoSugeridos';
import AmigosTuyos from './AmigosTuyos';

const Amigos = ({ authUser }) => {
  const [feedType, setFeedType] = useState("sugerenciaAmigos");

  return (
    <>
      <div className='flex-[4_4_0] border-r border-primary min-h-screen'>
        {/* Header */}
        <div className='flex w-full border-b border-blue-950'>
          <div
            className={
              "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            }
            onClick={() => setFeedType("sugerenciaAmigos")}
          >
            Sugerencia de Amigos
            {feedType === "sugerenciaAmigos" && (
              <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
            )}
          </div>
          <div
            className={
              "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
            }
            onClick={() => setFeedType("amigosTuyos")}
          >
            Amigos Tuyos
            {feedType === "amigosTuyos" && (
              <div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
            )}
          </div>
        </div>

        {/* Contenido según el tipo seleccionado */}
        {feedType === "sugerenciaAmigos" && <AmigosSugeridos authUser={authUser} />}
        {feedType === "amigosTuyos" && <AmigosTuyos authUser={authUser} />}
      </div>
    </>
  );
};

export default Amigos;
