import { useState } from "react";
import ModalActivarInsignia from "./ModalActivarInsignia";
import ModalActualizarInsignia from "./ModalActualizarInsignia";
import ModalEliminarInsignia from "./ModalEliminarInsignia";
import ModalInactivarInsignia from "./ModalInactivarInsignia";



function GestionInsignias () {

    // Constantes
    const [insignia, setInsignia] = useState([]); // Lista completa de libros
    const [selectedInsigniaId, setSelectedInsigniaId] = useState(null); // ID del libro seleccionado

    // Contantes para los modelos 
    const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
    const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
    const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
    const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
    const [isEliminarModalOpen, setIsEliminarModalOpen] = useState(false);

    // Filtrado
    const [isFiltroModalOpen, setIsFiltroModalOpen] = useState(false);
    const [filteredInsignia, setFilteredInsignia] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    // Paginado
    const [visibleCount, setVisibleCount] = useState(10); // Estado para el select de cantidad de usuarios visibles
    const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [totalPages, setTotalPages] = useState(1); // Número total de páginas

    // Listar las insignias











  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <main className="bg-white w-[100%] max-w-[1600px] mx-4 mt-20 rounded-t-2xl border border-gray-500 shadow-lg">
          <div>
            <img
              className="w-full h-[350px] rounded-t-2xl border-b-2 border-primary"
              src={banner_libro}
              alt="banner"
            />
          </div>

          <div className="flex justify-between items-center mt-4 mx-[70px]">
            {/* Contenedor para el select y la barra de búsqueda alineados a la izquierda */}
            <div className="flex gap-4">
              {/* Select para elegir cuántos usuarios ver */}
              <select
                value={visibleCount}
                onChange={handleVisibleCountChange}
                className="bg-white border border-gray-400 p-2 rounded"
              >
                <option value={5}> 5 libros</option>
                <option value={10}> 10 libros</option>
                <option value={20}> 20 libros</option>
              </select>

              {/* Barra de búsqueda */}
              <input
                type="text"
                placeholder="Buscar libro..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="p-2 border border-gray-400 rounded w-[340px]"
              />
            </div>

            {/* Contenedor para el icono de "más" y el botón "Estado" alineados a la derecha */}
            <div className="flex items-center gap-4">
              <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
                <BiPlus className="text-xl" />
              </button>
              <button
                onClick={() => setIsFiltroModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-950"
              >
                Estado
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 p-6">
            {isLoading ? (
              <GestionSkeleton /> // Muestra el skeleton mientras se cargan los datos
            ) : filteredLibros.length > 0 ? (
              librosPaginados.map((libro, index) => (
                <div
                  key={index}
                  className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-24 h-36 bg-gray-300 rounded border border-primary overflow-hidden mr-4">
                      <img
                        className="object-cover w-full h-full"
                        src={libro.portada || "url_de_la_imagen_libro"}
                        alt="Libro"
                      />
                    </div>
                    <div className="relative">
                      <h2 className="font-semibold">Título: {libro.titulo}</h2>
                      <p>ISBN: {libro.isbn}</p>
                      <p>Calificación: {libro.calificacion}</p>
                      <p>
                        Autor:{" "}
                        {libro.autores.map((autor) => autor.nombre).join(", ")}
                      </p>
                      <p>Estado: {obtenerEstadoTexto(libro.estado)}</p>
                    </div>
                  </div>
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleOpenActivarModal(libro._id)}
                      title="Activar"
                    >
                      <BiPowerOff className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenDesactiveModal(libro._id)}
                      title="Inactivar"
                    >
                      <BiReset className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenActualizarModal(libro._id)}
                      title="Actualizar"
                    >
                      <BiEdit className="text-xl" />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(libro._id)}
                      title="Eliminar"
                    >
                      <BiTrash className="text-xl" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay libros disponibles.</p>
            )}

            {/* Paginación */}
            <div className="flex justify-between mb-3  items-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-2 py-2 bg-gray-300 ml-[430px] rounded hover:bg-gray-400 disabled:bg-gray-200"
              >
                <BiLeftArrow />
              </button>

              <span className="mx-2">
                Página {currentPage} de {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-2 py-2 bg-gray-300 mr-[430px] rounded hover:bg-gray-400 disabled:bg-gray-200"
              >
                <BiRightArrow />
              </button>
            </div>
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
            onClose={() => {
              setIsCrearModalOpen(false);
              obtenerLibros();
            }}
            obetnerLibros={obtenerLibros}
          />
          <ModalActualizarLibro
            isOpen={isActualizarModalOpen}
            onClose={() => {
              setIsActualizarModalOpen(false);
              obtenerLibros();
            }} // Cambia a setIsActualizarModalOpen
            libroId={selectedLibrosId}
            obtenerLibros={obtenerLibros}
          />
          <ModalEliminarLibro
            isOpen={isEliminarModalOpen}
            onClose={() => {
              setIsEliminarModalOpen(false);
              obtenerLibros();
            }} // Cambia a setIsActualizarModalOpen
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
            onRestore={handleRestore}
          />
        </main>
      </div>
    </div>
  )
}

export default GestionInsignias