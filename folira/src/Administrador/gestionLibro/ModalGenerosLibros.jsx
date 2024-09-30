import { useState } from 'react';
import ModalActualizarGenero from './ModalActualizarGeneroLibro';
import ModalCrearGenero from './ModalCrearGeneroLibro';
import ModalInactivarGenero from './ModalInactivarGenero';
import ModalActivarGenero from './ModalActivarGenero';
import ModalEliminarGenero from './ModalEliminarGenero'; // Importar el modal de eliminación

function ModalGeneros({ isOpen, onClose }) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isInactivateModalOpen, setIsInactivateModalOpen] = useState(false);
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Nuevo estado para el modal de eliminación
  const [selectedGenero, setSelectedGenero] = useState(null);

  const generos = [
    { id: 1, nombre: "Ficción" },
    { id: 2, nombre: "No Ficción" },
    { id: 3, nombre: "Ciencia Ficción" },
    { id: 4, nombre: "Fantasía" },
    { id: 5, nombre: "Misterio" },
  ];

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleUpdate = (genero) => {
    setSelectedGenero(genero);
    setIsUpdateModalOpen(true);
  };

  const handleInactivate = (genero) => {
    setSelectedGenero(genero);
    setIsInactivateModalOpen(true);
  };

  const handleActivate = (genero) => {
    setSelectedGenero(genero);
    setIsActivateModalOpen(true);
  };

  const handleDelete = (genero) => {
    setSelectedGenero(genero);
    setIsDeleteModalOpen(true); // Abrir el modal de eliminación
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedGenero(null);
  };

  const handleCloseInactivateModal = () => {
    setIsInactivateModalOpen(false);
    setSelectedGenero(null);
  };

  const handleCloseActivateModal = () => {
    setIsActivateModalOpen(false);
    setSelectedGenero(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedGenero(null);
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
          <div className="mt-4 max-h-[300px] overflow-y-auto">
            <ul className="list-none m-0 p-0">
              {generos.map((genero) => (
                <li key={genero.id} className="mb-4 flex justify-between items-center bg-white text-lg">
                  <span className="mr-4">{genero.nombre}</span>
                  <div className="flex gap-2">
                    <button
                      className="bg-primary text-secondary border border-[#503B31] rounded px-2 py-1 hover:bg-blue-950"
                      onClick={() => handleActivate(genero)}
                    >
                      Activar
                    </button>
                    <button
                      className="bg-primary text-secondary border border-[#503B31] rounded px-2 py-1 hover:bg-blue-950"
                      onClick={() => handleInactivate(genero)}
                    >
                      Inactivar
                    </button>
                    <button
                      className="bg-primary text-secondary border border-primary rounded px-2 py-1 hover:bg-blue-950"
                      onClick={() => handleUpdate(genero)}
                    >
                      Actualizar
                    </button>
                    <button
                      className="bg-primary text-secondary border border-primary rounded px-2 py-1 hover:bg-blue-950"
                      onClick={() => handleDelete(genero)} // Llamar a la función de eliminación
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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
      {selectedGenero && (
        <ModalActualizarGenero
          isOpen={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          onUpdate={(updatedGenero) => {
            console.log('Género actualizado:', updatedGenero);
            handleCloseUpdateModal();
          }}
          genero={selectedGenero}
        />
      )}
      {selectedGenero && (
        <ModalInactivarGenero
          isOpen={isInactivateModalOpen}
          onClose={handleCloseInactivateModal}
          genero={selectedGenero}
          onConfirm={() => {
            console.log(`Género ${selectedGenero.nombre} inactivado.`);
            handleCloseInactivateModal();
          }}
        />
      )}
      {selectedGenero && (
        <ModalActivarGenero
          isOpen={isActivateModalOpen}
          onClose={handleCloseActivateModal}
          genero={selectedGenero}
          onConfirm={() => {
            console.log(`Género ${selectedGenero.nombre} activado.`);
            handleCloseActivateModal();
          }}
        />
      )}
      {selectedGenero && (
        <ModalEliminarGenero
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          genero={selectedGenero}
          onConfirm={() => {
            console.log(`Género ${selectedGenero.nombre} eliminado.`);
            handleCloseDeleteModal();
          }}
        />
      )}
    </>
  );
}

export default ModalGeneros;
