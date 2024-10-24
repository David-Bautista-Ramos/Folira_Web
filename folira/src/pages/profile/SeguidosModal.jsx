import { Link } from "react-router-dom";


const ModalSeguidos = ({ seguidos }) => {

  return (
    <>
      {/* Botón para abrir el modal */}
      <button
        className='btn-sm p-0 '
        onClick={() => document.getElementById("followed_modal").showModal()}
      >
        Seguidos 
      </button>

      {/* Modal de seguidores */}
      <dialog id='followed_modal' className='modal'>
        <div className='modal-box border rounded-md border-blue-950 shadow-md'>
          <h3 className='text-primary font-bold text-lg my-3'>
            Lista de Seguidores
          </h3>

          {/* Lista de Seguidores */}
          <div className='flex flex-col gap-4'>
            {seguidos && seguidos.length > 0 ? (
              seguidos.map((seguidor, index) => (
                <div key={index} className='flex items-center gap-2'>
                  {/* Avatar del seguidor */}
                  <div className='avatar'>
                    <div className='w-10 rounded-full'>
                      <Link  to={`/profile/${seguidor.nombre}`}
                            className="w-8 rounded-full overflow-hidden">
                      <img
                        src={seguidor.fotoPerfil || "/avatar-placeholder.png"}
                        alt='Avatar'
                      />
                  </Link>
                      
                    </div>
                  </div>

                  {/* Nombre completo y nombre de usuario del seguidor */}
                  <div className='flex flex-col'>
                  <Link  to={`/profile/${seguidor.nombre}`}
                            className="text-lg text-primary hover:text-blue-950">
                      {seguidor.nombreCompleto}
                  </Link>
                    <span className='text-sm text-blue-950'>
                      @{seguidor.nombre}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-center text-gray-500'>No tienes seguidores aún.</p>
            )}
          </div>
        </div>

        {/* Cerrar el modal */}
        <form method='dialog' className='modal-backdrop'>
          <button className='outline-none'>Cerrar</button>
        </form>
      </dialog>
    </>
  );
};

export default ModalSeguidos;
