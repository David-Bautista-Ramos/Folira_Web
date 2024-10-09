import { useEffect, useState } from 'react';
import ModalActualizarGenero from './ModalActualizarGeneroLibro';
import ModalCrearGenero from './ModalCrearGeneroLibro';
import ModalInactivarGenero from './ModalInactivarGenero';
import ModalActivarGenero from './ModalActivarGenero';
import ModalEliminarGenero from './ModalEliminarGenero'; // Importar el modal de eliminación
import GestionSkeleton from '../../components/skeletons/GestionSkeleton';
import { BiEdit, BiPowerOff, BiReset, BiTrash } from 'react-icons/bi';

function ModalGeneros({ isOpen, onClose }) {

  const [generos, setGeneros] = useState ([]);
  const [selectedGenerosId, setSelectedGenerosId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Corregido: useState en vez de useSatate


  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isInactivateModalOpen, setIsInactivateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Nuevo estado para el modal de eliminación
  
  const obtenerGenerosLiterarios = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/geneLiter/getgeneros", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los generos literarios");
      }

      const data = await response.json();

      // Asegúrate de que data sea un array
      if (Array.isArray(data)) {
        setGeneros(data); // Asigna los autores obtenidos al estado
      } else {
        console.error("La respuesta de los generos literarios no es un array:", data);
      }

    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerGenerosLiterarios();
  }, []);
 
  

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleUpdate = (generoId) => {
    setSelectedGenerosId(generoId);
    setIsUpdateModalOpen(true);
  };

  const handleInactivate = (generoId) => {
    setSelectedGenerosId(generoId);
    setIsInactivateModalOpen(true);
  };

  const handleActivate = (generoId) => {
    setSelectedGenerosId(generoId);
    setIsActivateModalOpen(true);
  };

  const handleDelete = (generoId) => {
    setSelectedGenerosId(generoId);
    setIsDeleteModalOpen(true); // Abrir el modal de eliminación
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedGenerosId(null);
  };

  const handleCloseInactivateModal = () => {
    setIsInactivateModalOpen(false);
    setSelectedGenerosId(null);
  };

  const handleCloseActivateModal = () => {
    setIsActivateModalOpen(false);
    setSelectedGenerosId(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedGenerosId(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-110 shadow-lg relative max-h-[120vh] overflow-y-auto">
          <div className="flex justify-between items-center sticky top-0 bg-white z-10 border-b border-primary pb-2">
            <h2 className="text-2xl text-primary">Géneros</h2>
            <button className="text-3xl text-primary" onClick={onClose}>×</button>
          </div>
          <div className="flex flex-col p-6 mt-4 max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <GestionSkeleton /> // Muestra el componente de carga mientras se obtienen los datos
            ) : generos.length > 0 ? (
              generos.map((genero) => (
                <div
                  key={genero.id}
                  className="flex flex-col bg-white border border-primary p-4 rounded-md mb-4"
                >
                  <div className="flex justify-between items-center mb-4 text-lg">
                    <span className="mr-4">{genero.nombre}</span>
                    <div className="flex gap-2">
                      <button
                        className="bg-primary text-secondary border border-[#503B31] rounded px-2 py-1 hover:bg-blue-950"
                        onClick={() => handleActivate(genero)}
                        title="Activar"
                      >
                        <BiPowerOff className="text-xl" />
                      </button>
                      <button
                        className="bg-primary text-secondary border border-[#503B31] rounded px-2 py-1 hover:bg-blue-950"
                        onClick={() => handleInactivate(genero)}
                        title="Inactivar"
                      >
                        <BiReset className="text-xl" />
                      </button>
                      <button
                        className="bg-primary text-secondary border border-primary rounded px-2 py-1 hover:bg-blue-950"
                        onClick={() => handleUpdate(genero)}
                        title="Actualizar"
                      >
                        <BiEdit className="text-xl" />
                      </button>
                      <button
                        className="bg-primary text-secondary border border-primary rounded px-2 py-1 hover:bg-blue-950"
                        onClick={() => handleDelete(genero)} // Llamar a la función de eliminación
                        title="Eliminar"
                      >
                        <BiTrash className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay géneros disponibles.</p> // Mensaje para cuando no hay datos
            )}
          </div>

          <div className="flex justify-end mt-4 border-t border-primary">
            <button
              className="bg-primary text-white rounded px-4 py-2 hover:bg-blue-950 mt-4"
              onClick={handleCreate}
            >
              Crear
            </button>
          </div>
        </div>
      </div>


      {/* Modales para Crear, Actualizar, Inactivar, Activar y Eliminar Género */}
      <ModalCrearGenero
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onCreate={(nuevoGenero) => {
          console.log('Género creado:', nuevoGenero);
          handleCloseCreateModal();
        }}
      />
      {selectedGenerosId && (
        <ModalActualizarGenero
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          onUpdate={(updatedGenero) => {
            console.log('Género actualizado:', updatedGenero);
            handleCloseUpdateModal();
          }}
          generoId={selectedGenerosId}
        />
      )}
      {selectedGenerosId && (
        <ModalInactivarGenero
          isOpen={isInactivateModalOpen}
          onClose={handleCloseInactivateModal}
          generoId={selectedGenerosId}
          onConfirm={() => {
            console.log(`Género ${selectedGenerosId.nombre} inactivado.`);
            handleCloseInactivateModal();
          }}
        />
      )}
      {selectedGenerosId && (
        <ModalActivarGenero
          isOpen={isActivateModalOpen}
          onClose={handleCloseActivateModal}
          generoId={selectedGenerosId}
          onConfirm={() => {
            console.log(`Género ${selectedGenerosId.nombre} activado.`);
            handleCloseActivateModal();
          }}
        />
      )}
      {selectedGenerosId && (
        <ModalEliminarGenero
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          generoId={selectedGenerosId}
          onConfirm={() => {
            console.log(`Género ${selectedGenerosId.nombre} eliminado.`);
            handleCloseDeleteModal();
          }}
        />
      )}
    </>
  );
}

export default ModalGeneros;
