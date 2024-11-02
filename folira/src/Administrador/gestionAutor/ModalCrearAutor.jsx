import { useState } from "react";
import useCreateAutor from "../../hooks/useCreateAutor";
import Select from "react-select"; // Importa react-select


function ModalCrearAutor({ isOpen, onClose,obtenerAutores }) {
  const paises = [
    { value: "Argentina", label: "Argentina" },
    { value: "Australia", label: "Australia" },
    { value: "Brazil", label: "Brazil" },
    { value: "Canada", label: "Canada" },
    { value: "Chile", label: "Chile" },
    { value: "China", label: "China" },
    { value: "Colombia", label: "Colombia" },
    { value: "France", label: "France" },
    { value: "Germany", label: "Germany" },
    { value: "India", label: "India" },
    { value: "Japan", label: "Japan" },
    { value: "Mexico", label: "Mexico" },
    { value: "Spain", label: "Spain" },
    { value: "United States", label: "United States" },
    // Agrega más países según sea necesario
  ];

  const [isCountrySelected, setIsCountrySelected] = useState(false); // Estado para controlar la selección del país


  const [formData, setFormData] = useState({
    nombre: "",
    seudonimo: "",
    fechaNacimiento: "",
    pais: "",
    biografia: "",
  });

  const { createAutor, isCreatingAutor } = useCreateAutor();
  const [fotoAutor, setFotoAutor] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFotoAutor(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    // Enviar datos del formulario y las imágenes
    await createAutor({
      ...formData,
      fotoAutor,
    });
    onClose(); // Close the modal after creation
    obtenerAutores();
  };

  return (
    <div
  className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  onClick={onClose}
>
  <form
    className="bg-white p-5 rounded-lg w-90 md:w-106 relative overflow-hidden"
    onClick={(e) => e.stopPropagation()} // Prevent click on modal content from closing the modal
    onSubmit={handleSubmit} // Form submission handling
  >
    <div className="border-b-2 border-primary pb-2 mb-5">
      <h2 className="text-lg text-center text-primary">CREAR AUTOR</h2>
    </div>

    <div className="overflow-y-auto max-h-80 mb-5 text-primary text-lg modal-scrollbar">
      {/* Flex container for two columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Adjusted for mobile and larger screens */}
        
        {/* Left Column */}
        <div>
          <label className="block mb-1 text-primary">Foto del autor</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImgChange}
            className="w-full p-2 mb-3 rounded focus:border-primary border"
          />
          {fotoAutor && ( // Use local state for image preview
            <img
              src={fotoAutor}
              alt="Preview"
              className="max-w-full h-auto mb-3"
            />
          )}

          <label className="block mb-1 text-primary">Nombre autor</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Nombre autor"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1 text-primary">Seudónimo</label>
          <input
            type="text"
            name="seudonimo"
            value={formData.seudonimo}
            onChange={handleInputChange}
            placeholder="Seudónimo"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />
        </div>

        {/* Right Column */}
        <div>
          <label className="block mb-1 text-primary">Fecha de nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleInputChange}
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1 text-blue-950 font-semibold">País</label>
          <Select
            id='pais'
            options={paises}
            value={paises.find(option => option.value === formData.pais) || null}
            onChange={(selectedOption) => {
              handleInputChange({ target: { name: 'pais', value: selectedOption.value } });
              setIsCountrySelected(true); // Cambia el estado a seleccionado
            }}
            className='flex-1 mb-3'
            placeholder='Selecciona un país'
            styles={{
              control: (provided) => ({
                ...provided,
                border: isCountrySelected ? '1px solid #A0AEC0' : '1px solid #111829', // Borde gris si se selecciona
                borderRadius: '0.375rem',
                padding: '0.5rem',
                boxShadow: 'none',
                '&:hover': {
                  border: '1px solid #A0AEC0', // Borde gris al hacer hover
                },
              }),
              placeholder: (provided) => ({
                ...provided,
                color: '#6B7280',
              }),
              singleValue: (provided) => ({
                ...provided,
                color: '#111829',
              }),
            }}
          />

          <label className="block mb-1 text-primary">Biografía</label>
          <textarea
            name="biografia"
            value={formData.biografia}
            onChange={handleInputChange}
            placeholder="Biografía"
            className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none"
          />
        </div>
      </div>
    </div>

    <div className="flex justify-end gap-2">
      <button
        className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950"
        type="submit" // Ensure this triggers form submission
        disabled={isCreatingAutor}
      >
        {isCreatingAutor ? "Creando..." : "Crear"}
      </button>

      <button
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
        onClick={onClose}
        type="button" // Make sure this is a button to prevent form submission
      >
        Cancelar
      </button>
    </div>
  </form>
</div>

  );
}

export default ModalCrearAutor;
