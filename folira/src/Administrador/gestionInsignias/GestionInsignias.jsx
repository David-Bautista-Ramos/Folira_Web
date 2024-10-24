import React, { useState, useEffect } from 'react';
import { BiPlus, BiPowerOff, BiEdit, BiTrash, BiReset } from 'react-icons/bi';
import ModalActivarInsignia from './ModalActivarInsignia';
import ModalCrearInsignia from './ModalCrearInsignia';
import ModalEliminarInsignia from './ModalEliminarInsignia';
import ModalActualizarInsignia from './ModalActualizarInsignia';
import ModalInactivarInsignia from './ModalInactivarInsignia';
import banner_insignia from '../../assets/img/banner_gestion_insignia.png'; 
import Nav from '../../components/common/Nav';
import ModalFiltroInsignias from '../../components/common/FiltroInsignias';

const GestionInsignias = () => {
  const [insigniasData, setInsigniasData] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [selectedInsignia, setSelectedInsignia] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null); // Estado para el filtro
  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false); // Estado para el modal de filtro
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
  const [filteredInsignias, setFilteredInsignias] = useState([]); // Estado para las insignias filtradas

  // Datos de insignias de ejemplo
  const insigniasEjemplo = [
    { _id: '1', nombre: 'Publicador Prolífico', descripcion: 'Por publicar un número determinado de publicaciones.', fotoInsignia: { fotoInsigniaURL: 'url_imagen1' }, estado: true },
    { _id: '2', nombre: 'Comentarista Activo', descripcion: 'Por dejar comentarios en un número específico de publicaciones.', fotoInsignia: { fotoInsigniaURL: 'url_imagen2' }, estado: true },
    { _id: '3', nombre: 'Conector Social', descripcion: 'Por seguir a varios usuarios o recibir seguidores.', fotoInsignia: { fotoInsigniaURL: 'url_imagen3' }, estado: true },
    { _id: '4', nombre: 'Lector Voraz', descripcion: 'Por guardar una cierta cantidad de libros.', fotoInsignia: { fotoInsigniaURL: 'url_imagen4' }, estado: true },
    { _id: '5', nombre: 'Crítico Literario', descripcion: 'Por escribir reseñas de libros guardados.', fotoInsignia: { fotoInsigniaURL: 'url_imagen5' }, estado: true },
    { _id: '6', nombre: 'Amigo de los Libros', descripcion: 'Por conectar a otros usuarios con intereses similares.', fotoInsignia: { fotoInsigniaURL: 'url_imagen6' }, estado: true },
    { _id: '7', nombre: 'Interacción Social', descripcion: 'Por interactuar con publicaciones de otros usuarios (me gusta, compartir, comentar).', fotoInsignia: { fotoInsigniaURL: 'url_imagen7' }, estado: true },
    { _id: '8', nombre: 'Influencer', descripcion: 'Por recibir un número específico de reacciones a tus publicaciones.', fotoInsignia: { fotoInsigniaURL: 'url_imagen8' }, estado: true },
    { _id: '9', nombre: 'Aniversario', descripcion: 'Por estar en la plataforma durante un año o más.', fotoInsignia: { fotoInsigniaURL: 'url_imagen9' }, estado: true },
    { _id: '10', nombre: 'Creador de Tendencias', descripcion: 'Por iniciar un tema de conversación popular.', fotoInsignia: { fotoInsigniaURL: 'url_imagen10' }, estado: true },
  ];

  useEffect(() => {
    setInsigniasData(insigniasEjemplo);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const insigniasFiltradas = insigniasData.filter(insignia => {
      const matchesSearchTerm =
        insignia.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insignia.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = filterStatus === null || insignia.estado === filterStatus;

      return matchesSearchTerm && matchesFilter;
    });
    setFilteredInsignias(insigniasFiltradas);
  }, [searchTerm, insigniasData, filterStatus]);

  const handleFilter = (status) => {
    setFilterStatus(status); // Establece el estado del filtro (activo o inactivo)
    setIsFiltroModalOpen(false); // Cierra el modal de filtro
  };

  const handleRestore = () => {
    setFilterStatus(null); // Restaura el filtro a su estado original
    setIsFiltroModalOpen(false); // Cierra el modal de filtro
  };

  const handleOpenActivarModal = (id) => {
    const insignia = insigniasData.find(i => i._id === id);
    setSelectedInsignia(insignia);
    setIsActivarModalOpen(true);
  };

  const handleOpenInactivarModal = (id) => {
    const insignia = insigniasData.find(i => i._id === id);
    setSelectedInsignia(insignia);
    setIsInactivarModalOpen(true);
  };

  const handleOpenActualizarModal = (id) => {
    const insignia = insigniasData.find(i => i._id === id);
    setSelectedInsignia(insignia);
    setIsActualizarModalOpen(true);
  };

  const handleCreateInsignia = (newInsignia) => {
    setInsigniasData(prev => [...prev, newInsignia]);
    obtenerInsignias();
  };

  const handleActivateInsignia = async (insigniaId) => {
    console.log(`Activando insignia con ID: ${insigniaId}`);
    obtenerInsignias();
  };

  const handleInactivateInsignia = async (insigniaId) => {
    console.log(`Inactivando insignia con ID: ${insigniaId}`);
    obtenerInsignias();
  };

  const handleUpdateInsignia = (updatedInsignia) => {
    setInsigniasData(prev => 
      prev.map(insignia => (insignia._id === updatedInsignia._id ? updatedInsignia : insignia))
    );
    obtenerInsignias();
  };

  const obtenerInsignias = () => {
    setInsigniasData(insigniasEjemplo);
  };

  return (
    <div>
  <Nav />
  <div>
    <main className="bg-white w-[100%] max-w-[1600px] mx-4 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
      <div>
        <img
          className="w-full h-[350px] rounded-t-2xl border-b-2 border-primary"
          src={banner_insignia}
          alt="banner"
        />
      </div>

      <div className="flex justify-between items-center mt-4 mx-[70px]">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar insignia..."
            className="p-2 border border-gray-400 rounded w-[320px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
        </div>

        <div className="flex items-center">
        <button onClick={() => setIsFiltroModalOpen(true)} className="bg-primary mr-5 text-white px-4 py-2 rounded hover:bg-blue-950">
            Estado
          </button>

          <button onClick={() => setIsCrearModalOpen(true)} title="Crear" className="flex items-center">
            <BiPlus className="text-xl" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-6 p-6">
        {isLoading ? (
          <p>Cargando...</p>
        ) : filteredInsignias.length > 0 ? (
          filteredInsignias.map((insignia) => (
            <div
              key={insignia._id} // Cambiar a usar el id único
              className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md"
            >
              <div className="flex items-center mb-4">
                <div className="w-24 h-24 bg-gray-300 rounded-full border border-primary overflow-hidden mr-4">
                  <img
                    className="object-cover w-full h-full"
                    src={insignia.fotoInsignia.fotoInsigniaURL || "url_de_la_imagen_usuario"}
                    alt="Insignia"
                  />
                </div>
                <div className="relative">
                  <h2 className="font-semibold">Nombre: {insignia.nombre}</h2>
                  <p>Descripción: {insignia.descripcion}</p>
                  <p>Estado: {insignia.estado ? 'Activa' : 'Inactiva'}</p>
                </div>
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleOpenActivarModal(insignia._id)}
                  title="Activar"
                >
                  <BiPowerOff className="text-xl" />
                </button>
                <button
                  onClick={() => handleOpenInactivarModal(insignia._id)}
                  title="Inactivar"
                >
                  <BiReset className="text-xl" />
                </button>
                <button
                  onClick={() => handleOpenActualizarModal(insignia._id)}
                  title="Actualizar"
                >
                  <BiEdit className="text-xl" />
                </button>
                <button
                  onClick={() => {
                    setSelectedInsignia(insignia);
                    setIsEliminarModalOpen(true);
                  }}
                  title="Eliminar"
                >
                  <BiTrash className="text-xl" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay insignias disponibles.</p>
        )}
      </div>



          {/* Modales */}
          <ModalActivarInsignia
            isOpen={isActivarModalOpen}
            onClose={() => setIsActivarModalOpen(false)}
            insignia={selectedInsignia}
            onActivate={handleActivateInsignia}
          />
          <ModalCrearInsignia
            isOpen={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
            obtenerInsignias={obtenerInsignias}
            onCreate={handleCreateInsignia}
          />
          <ModalEliminarInsignia
            isOpen={isEliminarModalOpen}
            onClose={() => setIsEliminarModalOpen(false)}
            insignia={selectedInsignia}
            onDelete={() => {
              console.log(`Eliminar insignia ${selectedInsignia._id}`);
              obtenerInsignias();
            }}
          />
          <ModalActualizarInsignia
            isOpen={isActualizarModalOpen}
            onClose={() => setIsActualizarModalOpen(false)}
            insignia={selectedInsignia}
            onUpdate={handleUpdateInsignia}
          />

          <ModalInactivarInsignia
            isOpen={isInactivarModalOpen}
            onClose={() => setIsInactivarModalOpen(false)}
            insignia={selectedInsignia}
            onInactivate={handleInactivateInsignia}
          />

          <ModalFiltroInsignias
              isOpen={isFiltroModalOpen}
              onClose={() => setIsFiltroModalOpen(false)}
              onFilter={handleFilter}
              onRestore={handleRestore}
          />
        </main>
      </div>
    </div>
  );
};

export default GestionInsignias;
