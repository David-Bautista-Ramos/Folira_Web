import { useState } from "react";
import useCreateDenuncia from "../../hooks/useCreateDenuncia"; // Hook to create denuncia

const ModalCrearDenuncia = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    motivo: "",
    solucion: "",
    idUsuario: "",
    idPublicacion: "",
    idComunidad: "",
    idResena: "",
  });

  const { createDenuncia, isCreatingDenuncia } = useCreateDenuncia(); // Function to create denuncia

  // Function to handle changes in form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!formData.motivo || !formData.solucion || !formData.idUsuario) {
      alert("Please fill in all required fields.");
      return;
    }

    // Send form data
    await createDenuncia(formData);
  };

  return (
    <>
      {isOpen && (
        <dialog id="create_denuncia_modal" className="modal" open>
          <div className="modal-box border rounded-md border-blue-950 h-[500px] shadow-md modal-scrollbar">
            <h3 className="text-primary font-bold text-lg my-3">
              Crear Denuncia
            </h3>
            <form
              className="text-primary flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Motivo de la Denuncia"
                className="input border border-blue-950 rounded p-2 input-md"
                value={formData.motivo}
                name="motivo"
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                placeholder="Solución Propuesta"
                className="input border border-blue-950 rounded p-2 input-md"
                value={formData.solucion}
                name="solucion"
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                placeholder="ID de Usuario"
                className="input border border-blue-950 rounded p-2 input-md"
                value={formData.idUsuario}
                name="idUsuario"
                onChange={handleInputChange}
                required
              />

              <input
                type="text"
                placeholder="ID de Publicación"
                className="input border border-blue-950 rounded p-2 input-md"
                value={formData.idPublicacion}
                name="idPublicacion"
                onChange={handleInputChange}
              />

              <input
                type="text"
                placeholder="ID de Comunidad"
                className="input border border-blue-950 rounded p-2 input-md"
                value={formData.idComunidad}
                name="idComunidad"
                onChange={handleInputChange}
              />

              <input
                type="text"
                placeholder="ID de Reseña"
                className="input border border-blue-950 rounded p-2 input-md"
                value={formData.idResena}
                name="idResena"
                onChange={handleInputChange}
              />

              <div className="modal-action">
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={isCreatingDenuncia}
                >
                  {isCreatingDenuncia ? "Creando..." : "Crear"}
                </button>
                <button
                  className="btn btn-outline"
                  type="button"
                  onClick={onClose}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </>
  );
};

export default ModalCrearDenuncia;
