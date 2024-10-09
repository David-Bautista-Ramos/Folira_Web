import { useEffect, useState,  } from "react";
import ModalInactivarLibro from "./ModalInactivarLibro";
import ModalActivarLibro from "./ModalActivarLibro";
import ModalCrearLibro from "./ModalCrearLibro";
import ModalActualizarLibro from "./ModalActualizarLibro";
import ModalGeneros from "./ModalGenerosLibros";
import ModalFiltroLibros from "../../components/common/ModalFiltroLibros"; // Import the new modal
import Nav from "../../components/common/Nav";
import { BiEdit, BiPlus, BiPowerOff, BiReset } from "react-icons/bi";
import banner_libro from "../../assets/img/gestionLibro.jpeg";
import GestionSkeleton from "../../components/skeletons/GestionSkeleton";



function GestionLibro() {

  const [libros, setLibros]  = useState([]); //para obtener el arrays
  const [selectedLibrosId, setSelectedLibrosId] = useState(null); //guardara el ID de loq ue queramos actualiza , eliminar

  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isGenerosModalOpen, setIsGenerosModalOpen] = useState(false);
  const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false); // New state for filter modal
  const [filteredBooks, setFilteredBooks] = useState(libros); // New state for filtered books
  const [isLoading, setIsLoading] = useState(true);



  // Metodo para llamar a todo lo que necesitamos
  const obetnerLibros = async() => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/libro/getlibros' , {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener  los libros');
      }

      const data = await response.json();

      // Asegúrate de que data sea un array
      if (Array.isArray(data)) {
        setLibros(data); // Asigna los usuarios obtenidos al estado
        setFilteredBooks(data); // También asigna a usuarios filtrados
      } else {
        console.error('La respuesta de lod libros no es un array:', data);
      }
    } catch (error) {
      console.error('Error', error);
    }finally{
      setIsLoading(false);
    }
  }


  // Crear un efecto
  useEffect(()=> {
    obetnerLibros();
  }, []);


  //filtrado por estado
  const handleFilter = async (filter) => {
    console.log(`Filter selected: ${filter}`);
    setIsLoading(true);

    try {
      let response;
    
      if (filter === "Activar") {
        // Obtener libros activos
        response = await fetch('/api/users/getlibrosact', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (filter === "Inactivar") {
        // Obtener libros inactivos
        response = await fetch('/api/users/getlibrosdes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else if (filter === "Restaurar") {
        setFilteredBooks(libros); // Restaurar la lista completa de libros
        setIsFiltroModalOpen(false); // Cerrar el modal
        setIsLoading(false); // Finalizar la carga
        return;
      }
    
      if (!response.ok) {
        throw new Error('Error al filtrar los libros');
      }
    
      const data = await response.json();
    
      // Ajusta el código para acceder al array de libros
      if (data && Array.isArray(data.books)) {
        setFilteredBooks(data.books); // Asignar el array de libros filtrados
      } else {
        console.error('La respuesta no contiene un array de libros:', data);
      }
    } catch (error) {
      console.error('Error al filtrar', error);
    }
    
    
    if (filter === "Restaurar") {
      setFilteredBooks(libros); // Show all books
    } else {
      setFilteredBooks(libros.filter(libro => libro.estado === filter)); // Filter by state
    }
    
    setIsFiltroModalOpen(false); // Close the modal after selection
  };

  const handleRestore = () => {
    setFilteredBooks(libros); // Restaurar todos los usuarios
    setIsFiltroModalOpen(false); // Cerrar el modal después de restaurar
  };
  const handleOpenActivarModal = (libroId) => {
    setSelectedLibrosId(libroId); // Guardar el ID del usuario seleccionado
    setIsActivarModalOpen(true); // Abrir el modal
  };
  const handleOpenDesactiveModal = (libroId) => {
    setSelectedLibrosId(libroId); // Guardar el ID del usuario seleccionado
    setIsInactivarModalOpen(true); // Abrir el modal
  };
  const handleOpenActualizarModal = (libroId) => {
    setSelectedLibrosId(libroId);
    setIsActualizarModalOpen(true); 
  };
  const handleOpenCrearModal = (libroId) => {
    setSelectedLibrosId(libroId);
    setIsCrearModalOpen(true); 
  };


  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <main className="bg-white w-[100%] max-w-[1600px] mx-4 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
          <div>
            <img
              className="w-full h-[269px] rounded-t-2xl"
              src={banner_libro}
              alt="banner"
            />
          </div>

          <div className="flex justify-end mt-4 mr-[70px]">
            <button 
              onClick={() => setIsFiltroModalOpen(true)} // Open filter modal
              className="bg-primary text-white px-4 py-2 rounded mr-3 hover:bg-blue-950"
            >
              Estado
            </button>
            <button 
              onClick={() => setIsGenerosModalOpen(true)} 
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-950"
            >
              Ver Géneros
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 p-6">
              {isLoading ? (
                <GestionSkeleton /> // Muestra el skeleton mientras se cargan los datos
              ) : (
                filteredBooks.length > 0 ? (
                  filteredBooks.map((libro, index) => (
                    <div key={index} className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md">
                      <div className="flex items-center mb-4">
                        <div className="w-24 h-36 bg-gray-300 rounded border border-primary overflow-hidden mr-4">
                          <img
                            className="object-cover w-full h-full"
                            src={"url_de_la_imagen_libro"}
                            alt="Libro"
                          />
                        </div>
                        <div className="relative">
                          <div className="mb-1">
                            <h2 className="font-semibold">Título: {libro.titulo}</h2>
                          </div>
                          <div className="mb-1">
                            <h2 className="font-semibold">ISBN: {libro.ISBN}</h2>
                          </div>
                          <div className="mb-1">
                            <p>Autor: {libro.autores}</p>
                          </div>
                          <p>Estado: {libro.estado}</p>
                        </div>
                      </div>
                      <div className="flex justify-center gap-3">
                        <button onClick={() => handleOpenActivarModal(libro._id)} title="Activar">
                          <BiPowerOff className="text-xl" />
                        </button>
                        <button onClick={() => handleOpenDesactiveModal(libro._id)} title="Inactivar">
                          <BiReset className="text-xl" />
                        </button>
                        <button onClick={() => handleOpenCrearModal(libro._id)} title="Crear">
                          <BiPlus className="text-xl" />
                        </button>
                        <button onClick={() => handleOpenActualizarModal(libro._id)} title="Actualizar">
                          <BiEdit className="text-xl" />
                        </button>
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
            obetnerLibros={obetnerLibros}
          />
          <ModalActivarLibro
            isOpen={isActivarModalOpen}
            onClose={() => setIsActivarModalOpen(false)}
            libroId={selectedLibrosId}
            obetnerLibros={obetnerLibros}
          />
          <ModalCrearLibro
            isOpen={isCrearModalOpen}
            onClose={() => {setIsCrearModalOpen(false); obetnerLibros () }}
            obetnerLibros= {obetnerLibros}
          />
          <ModalActualizarLibro
            isOpen={isActualizarModalOpen}
            onClose={() => {setIsCrearModalOpen(false); obetnerLibros () }}
            libroId={selectedLibrosId}
            obetnerLibros={obetnerLibros}
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
