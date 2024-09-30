import { useState } from "react";
import ModalInactivarAutor from "../gestionAutor/ModalInactivarAutor";
import Nav from "../../components/common/Nav";
import ModalActivarAutor from "../gestionAutor/ModalActivarAutor";
import ModalCrearAutor from "../gestionAutor/ModalCrearAutor";
import ModalActualizarAutor from "../gestionAutor/ModalActualizarAutor";
import { BiEdit, BiPlus, BiPowerOff, BiReset } from "react-icons/bi";
import banner_usua from "../../assets/img/admi_banners_usua.jpeg";

const usuarios = [
  { nombre: "Alex Rodríguez",  estado: "Activo" },
  { nombre: "Maria Pérez",  estado: "Inactivo" },
  { nombre: "Carlos García",  estado: "Activo" },
  { nombre: "Lucía Fernández",  estado: "Inactivo" },
  { nombre: "Catalina Lucía Fernández",  estado: "Inactivo" },
  { nombre: "Catalina Lucía Fernández",  estado: "Inactivo" },

];


function GestionAutor() {
  const [isInactivarModalOpen, setIsInactivarModalOpen] = useState(false);
  const [isActivarModalOpen, setIsActivarModalOpen] = useState(false);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isActualizarModalOpen, setIsActualizarModalOpen] = useState(false);

  return (
    <div>
      <Nav />
      <div className="flex justify-center items-center mt-10">
      <main className="bg-white w-[100%] max-w-[1600px] mx-4 mt-20 rounded-t-2xl border border-gray-500 shadow-lg"> {/* Ajusta el margen lateral aquí */}
          <div>
            <img
              className="w-full h-[269px] rounded-t-2xl"
              src={banner_usua}
              alt="banner"
            />
          </div>

          {/* Contenedor para las tarjetas */}
          <div className="flex flex-wrap justify-center gap-6 p-6">
            {usuarios.map((usuario, index) => (
              <div key={index} className="flex flex-col w-[45%] bg-white border border-primary p-4 rounded-md"> {/* Cambia el ancho a 45% */}
                <div className="flex items-center mb-4">
                  <div className="w-24 h-24 bg-gray-300 rounded-full border border-primary  overflow-hidden mr-4">
                    <img
                      className="object-cover w-full h-full"
                      src={"url_de_la_imagen_usuario"}
                      alt="Usuario"
                    />
                  </div>
                  <div className="relative">
                    <div className="mb-1">
                      <h2 className="font-semibold">
                        Nombre: {usuario.nombre}
                      </h2>
                    </div>
                    <p>Estado: {usuario.estado}</p>
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

          {/* Modal para Inactivar Usuario */}
          <ModalInactivarAutor
            isOpen={isInactivarModalOpen}
            onClose={() => setIsInactivarModalOpen(false)}
          />

          {/* Modal para Activar Usuario */}
          <ModalActivarAutor
            isOpen={isActivarModalOpen}
            onClose={() => setIsActivarModalOpen(false)}
          />

          {/* Modal para Crear Usuario */}
          <ModalCrearAutor
            isOpen={isCrearModalOpen}
            onClose={() => setIsCrearModalOpen(false)}
          />

          {/* Modal para Actualizar Usuario */}
          <ModalActualizarAutor
            isOpen={isActualizarModalOpen}
            onClose={() => setIsActualizarModalOpen(false)}
          />
        </main>
      </div>
    </div>
  );
}

export default GestionAutor;
