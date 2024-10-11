import { useEffect, useState } from "react";
import ModalInactivarLibro from "./ModalInactivarLibro";
import ModalActivarLibro from "./ModalActivarLibro";
import ModalCrearLibro from "./ModalCrearLibro";
import ModalActualizarLibro from "./ModalActualizarLibro";
import ModalGeneros from "./ModalGenerosLibros";
import ModalFiltroLibros from "../../components/common/ModalFiltroLibros"; // Import the new modal
import Nav from "../../components/common/Nav";
import { BiEdit, BiPlus, BiPowerOff, BiReset, BiTrash } from "react-icons/bi";
import banner_libro from "../../assets/img/gestionLibro.jpeg";
import GestionSkeleton from "../../components/skeletons/GestionSkeleton";
import ModalEliminarLibro from './ModalEliminarLibro';

function GestionLibro() {

  const [libro, setLibros] = useState([]); // Lista completa de libros
  const [selectedLibrosId, setSelectedLibrosId] = useState(null); // ID del libro seleccionado
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);
  const [isGenerosModalOpen, setIsGenerosModalOpen] = useState(false);
  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false); // Estado del modal de filtro
  const [filteredLibros, setFilteredLibros] = useState([]); // Libros filtrados
  const [isLoading, setIsLoading] = useState(true);

  // Método para obtener todos los libros
  const obtenerLibros = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/libro/getlibros', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los libros');
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setLibros(data); // Almacena todos los libros
        setFilteredLibros(data); // Inicialmente muestra todos los libros
      } else {
        console.error('La respuesta no es un array:', data);
      }
    } catch (error) {
      console.error('Error', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    obtenerLibros();
  }, []);

  // Método para manejar el filtrado
  const handleFilter = async (filter) => {
    console.log(`Filter selected: ${filter}`);
    setIsLoading(true); // Inicia la carga al filtrar

    try {
      let response;
  
      if (filter === "Activo") {
        response = await fetch('/api/libro/getlibrosact', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (filter === "Inactivo") {
        response = await fetch('/api/libro/getlibrosdes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (filter === "Restaurar") {
        setFilteredLibros(libro); // Restaurar la lista completa de usuarios
        setIsFiltroModalOpen(false); // Cerrar el modal
        setIsLoading(false); 
        return;
      }
  
      if (!response.ok) {
        throw new Error('Error al filtrar los libros');
      }
  
      const data = await response.json();
      
      if (data && Array.isArray(data.libros)) {
        setFilteredLibros(data.libros); // Asignar el array de usuarios filtrados
      } else {
        console.error('La respuesta no contiene un array de Libros:', data);
      }
    } catch (error) {
      console.error('Error al filtrar libros:', error);
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  
    setIsFiltroModalOpen(false); // Cerrar el modal después de aplicar el filtro
  };

  // Restaurar la lista completa de libros
  const handleRestore = () => {
    setFilteredLibros(libro);
    setIsFiltroModalOpen(false); // Cerrar el modal
  };

  // Función para abrir diferentes modales
  const handleOpenActivarModal = (libroId) => {
    setSelectedLibrosId(libroId); 
    setIsActivarModalOpen(true);
  };
  const handleOpenDesactiveModal = (libroId) =>{
    setSelectedLibrosId(libroId);
    setIsInactivarModalOpen(true);
  };
  const handleOpenActualizarModal = (libroId) => {
    setSelectedLibrosId(libroId); 
    setIsActualizarModalOpen(true);
  };

  const handleOpenDeleteModal = (libroId) => {
    setSelectedLibrosId(libroId); // Guardar el ID del usuario seleccionado
    setIsEliminarModalOpen(true); // Abrir el modal
  }

  // Función para convertir estado booleano a texto
  const obtenerEstadoTexto = (estado) => estado ? "Activo" : "Inactivo";

  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <main className="bg-white w-[100%] max-w-[1600px] mx-4 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
          <div>
            <img className="w-full h-[269px] rounded-t-2xl" src={banner_libro} alt="banner" />
          </div>

          <div className="flex justify-end mt-4 mr-[70px]">
          <button onClick={() => setIsCrearModalOpen(true)}  title="Crear">
              <BiPlus className="text-xl mr-3" />
            </button>
            <button onClick={() => setIsFiltroModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded mr-3 hover:bg-blue-950">
              Estado
            </button>
            <button onClick={() => setIsGenerosModalOpen(true)} className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-950">
              Ver Géneros
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 p-6">
            {isLoading ? (
              <GestionSkeleton /> // Muestra el skeleton mientras se cargan los datos
            ) : (
              filteredLibros.length > 0 ? (
                filteredLibros.map((libro, index) => (
                  <div key={index} className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md">
                    <div className="flex items-center mb-4">
                      <div className="w-24 h-36 bg-gray-300 rounded border border-primary overflow-hidden mr-4">
                        <img className="object-cover w-full h-full" src={libro.portada || "url_de_la_imagen_libro"} alt="Libro" />
                      </div>
                      <div className="relative">
                        <h2 className="font-semibold">Título: {libro.titulo}</h2>
                        <p>ISBN: {libro.isbn}</p>
                        <p>Calificación: {libro.calificacion}</p>
                        <p>Autor: {libro.autores.map(autor => autor.nombre).join(', ')}</p>
                        <p>Estado: {obtenerEstadoTexto(libro.estado)}</p>
                      </div>
                    </div>
                    <div className="flex justify-center gap-3">
                      <button onClick={() => handleOpenActivarModal(libro._id)} title="Activar"><BiPowerOff className="text-xl" /></button>
                      <button onClick={() => handleOpenDesactiveModal(libro._id)} title="Inactivar"><BiReset className="text-xl" /></button>
                      <button onClick={() => handleOpenActualizarModal(libro._id)} title="Actualizar"><BiEdit className="text-xl" /></button>
                      <button onClick={() => handleOpenDeleteModal(libro._id)} title="Eliminar"><BiTrash className="text-xl" /></button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay libros disponibles.</p>
              )
            )}
          </div>

          {/* Modales */}
            <ModalInactivarLibro
              isOpen={isInactivarModalOpen}
              onClose={() => setIsInactivarModalOpen(false)}
              libroId={selectedLibrosId}
              obetnerLibros={obtenerLibros}
            />
            <ModalActivarLibro
              isOpen={isActivarModalOpen}
              onClose={() => setIsActivarModalOpen(false)}
              libroId={selectedLibrosId}
              obetnerLibros={obtenerLibros}
            />
            <ModalCrearLibro
              isOpen={isCrearModalOpen}
              onClose={() => {setIsCrearModalOpen(false); obtenerLibros () }}
              obetnerLibros= {obtenerLibros}
            />
            <ModalActualizarLibro
              isOpen={isActualizarModalOpen}
              onClose={() => { setIsActualizarModalOpen(false); obtenerLibros(); }} // Cambia a setIsActualizarModalOpen
              libroId={selectedLibrosId}
              obtenerLibros={obtenerLibros}
            />
             <ModalEliminarLibro
              isOpen={isEliminarModalOpen}
              onClose={() => { setIsEliminarModalOpen(false); obtenerLibros(); }} // Cambia a setIsActualizarModalOpen
              libroId={selectedLibrosId}
              obtenerLibros={obtenerLibros}
            />
            <ModalGeneros
              isOpen={isGenerosModalOpen}
              onClose={() => setIsGenerosModalOpen(false)}

            />
            <ModalFiltroLibros
              isOpen={isFiltroModalOpen}
              onClose={() => setIsFiltroModalOpen(false)}
              onFilter={handleFilter} // Pass the filter handler
              onRestore = {handleRestore}
            />
        </main>
      </div>
    </div>
  );
}

export default GestionLibro;


