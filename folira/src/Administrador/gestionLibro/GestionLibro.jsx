import { useState } from "react";
import ModalInactivarLibro from "./ModalInactivarLibro";
import ModalActivarLibro from "./ModalActivarLibro";
import ModalCrearLibro from "./ModalCrearLibro";
import ModalActualizarLibro from "./ModalActualizarLibro";
import ModalGeneros from "./ModalGenerosLibros";
import Nav from "../../components/common/Nav";
import { BiEdit, BiPlus, BiPowerOff, BiReset } from "react-icons/bi";
import banner_libro from "../../assets/img/admi_banner.jpeg"; 

const libros = [
    { 
      nombre: "Cien años de soledad", 
      autor: "Gabriel García Márquez", 
      estado: "Disponible", 
      ISBN: "978-3-16-148410-0" 
    },
    { 
      nombre: "Don Quijote de la Mancha", 
      autor: "Miguel de Cervantes", 
      estado: "No disponible", 
      ISBN: "978-84-376-0494-7" 
    },
    { 
      nombre: "El amor en los tiempos del cólera", 
      autor: "Gabriel García Márquez", 
      estado: "Disponible", 
      ISBN: "978-0-06-088328-7" 
    },
    { 
      nombre: "1984", 
      autor: "George Orwell", 
      estado: "No disponible", 
      ISBN: "978-0-452-28423-4" 
    },
    { 
      nombre: "La casa de los espíritus", 
      autor: "Isabel Allende", 
      estado: "No disponible", 
      ISBN: "978-84-204-7152-9" 
    },
    { 
      nombre: "La casa de los espíritus", 
      autor: "Isabel Allende", 
      estado: "No disponible", 
      ISBN: "978-84-204-7152-9" 
    },
  ];
  

function GestionLibro() {
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);
  const [isGenerosModalOpen, setIsGenerosModalOpen] = useState(false);

  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
        <main className="bg-white w-[100%] max-w-[1600px] mx-4 mt-20 rounded-t-2xl border border-gray-500 shadow-lg"> {/* Ajusta el margen lateral aquí */}
          <div>
            <img
              className="w-full h-[269px] rounded-t-2xl"
              src={banner_libro}
              alt="banner"
            />
          </div>

          {/* Botón para ver géneros */}
          <div className="flex justify-end  mt-4 mr-4">
            <button 
              onClick={() => setIsGenerosModalOpen(true)} 
              className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-950"
            >
              Ver Géneros
            </button>
          </div>

          {/* Contenedor para los libros */}
          <div className="flex flex-wrap justify-center gap-6 p-6">
            {libros.map((libro, index) => (
              <div key={index} className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md">
                <div className="flex items-center mb-4">
                  <div className="w-24 h-36 bg-gray-300 rounded border border-primary overflow-hidden mr-4">
                    <img
                      className="object-cover w-full h-full"
                      src={"url_de_la_imagen_libro"} // Cambia esto por la URL de la imagen del libro
                      alt="Libro"
                    />
                  </div>
                  <div className="relative">
                    <div className="mb-1">
                      <h2 className="font-semibold">Título: {libro.nombre}</h2>
                    </div>
                    <div className="mb-1">
                      <h2 className="font-semibold">ISBN: {libro.ISBN}</h2>
                    </div>
                    <div className="mb-1">
                      <p>Autor: {libro.autor}</p>
                    </div>
                    <p>Estado: {libro.estado}</p>
                  </div>
                </div>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setIsActivarModalOpen(true)} title="Activar">
                    <BiPowerOff className="text-xl" />
                  </button>
                  <button onClick={() => setIsInactivarModalOpen(true)} title="Inactivar">
                    <BiReset className="text-xl" />
                  </button>
                  <button onClick={() => setIsCrearModalOpen(true)} title="Crear">
                    <BiPlus className="text-xl" />
                  </button>
                  <button onClick={() => setIsActualizarModalOpen(true)} title="Actualizar">
                    <BiEdit className="text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modales */}
          <ModalInactivarLibro
            isOpen={isInactivarModalOpen}
            onClose={() => setIsInactivarModalOpen(false)}
          />
          <ModalActivarLibro
            isOpen={isActivarModalOpen}
            onClose={() => setIsActivarModalOpen(false)}
          />
          <ModalCrearLibro
            isOpen={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
          />
          <ModalActualizarLibro
            isOpen={isActualizarModalOpen}
            onClose={() => setIsActualizarModalOpen(false)}
          />
          <ModalGeneros
            isOpen={isGenerosModalOpen}
            onClose={() => setIsGenerosModalOpen(false)}
            generos={["Ficción", "No ficción", "Ciencia", "Fantasía"]}
          />
        </main>
      </div>
    </div>
  );
}

export default GestionLibro;
