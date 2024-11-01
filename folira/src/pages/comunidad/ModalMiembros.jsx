import { Link } from 'react-router-dom';
import { useState } from 'react';

const ModalMiembrosComunidad = ({ miembros }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Botón para abrir el modal */}
      <button className='btn-sm p-0 text-lg' onClick={toggleModal}>
      <strong>Número de miembros:</strong> {miembros?.length || 0}
      </button>

      {/* Modal de miembros de la comunidad */}
      {isOpen && (
        <dialog open className='modal'>
          <div className='modal-box border rounded-md border-blue-950 shadow-md'>
            <h3 className='text-primary font-bold text-lg my-3'>
              Lista de Miembros de la Comunidad
            </h3>

            {/* Lista de miembros */}
            <div className='flex flex-col gap-4'>
              {miembros && miembros.length > 0 ? (
                miembros.map((miembro) => (
                  <div key={miembro._id} className='flex items-center gap-2'>
                    {/* Avatar del miembro */}
                    <div className='avatar'>
                      <div className='w-10 rounded-full'>
                        <Link
                          to={`/profile/${miembro.nombre}`}
                          className="w-8 rounded-full overflow-hidden"
                          aria-label={`Ver perfil de ${miembro.nombreCompleto}`}
                        >
                          <img
                            src={miembro.fotoPerfil || "/avatar-placeholder.png"}
                            alt={`Foto de ${miembro.nombreCompleto}`}
                          />
                        </Link>
                      </div>
                    </div>

                    {/* Nombre completo y nombre de usuario del miembro */}
                    <div className='flex flex-col'>
                      <Link
                        to={`/profile/${miembro.nombre}`}
                        className="text-lg text-primary hover:text-blue-950"
                        aria-label={`Ver perfil de ${miembro.nombreCompleto}`}
                      >
                        {miembro.nombreCompleto}
                      </Link>
                      <span className='text-sm text-gray-500'>
                        @{miembro.nombre}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-center text-gray-500'>No hay miembros en la comunidad aún.</p>
              )}
            </div>
          </div>

          {/* Cerrar el modal */}
          <form method='dialog' className='modal-backdrop'>
            <button type='button' className='outline-none' onClick={toggleModal}>
              Cerrar
            </button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default ModalMiembrosComunidad;
