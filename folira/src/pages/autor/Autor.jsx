import { useState } from "react";
import AutorSugerido from './AutorSugerido'

const Autor = ({authUser}) => {

  const [feedType, setFeedType] = useState("autorSuger");

  return (
      <>
        <div className='flex-[4_4_0] border-r border-primary min-h-screen '>
          {/* Header */}

      <div className='flex w-full border-b border-blue-950'>
        <div
          className={
            "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
          }
          onClick={() => setFeedType("autorSuger")}
        >
          Autores Sugeridos
          {feedType === "autorSuger" && (
            <div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
          )}
        </div>
                  
      </div>
      {/* Insignias según el tipo seleccionado */}
      {feedType === "autorSuger" && <AutorSugerido authUser={authUser}/>}      
              
          </div>
      </>
  );
};

export default Autor;