import { useEffect, useState } from "react";
import useCreateAutor from "../../hooks/useCreateAutor";
import Select from "react-select";

function ModalCrearAutor({ isOpen, onClose, obtenerAutores, token }) {
  const paises = [
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Austria', label: 'Austria' },
    { value: 'Bélgica', label: 'Bélgica' },
    { value: 'Brasil', label: 'Brasil' },
    { value: 'Canadá', label: 'Canadá' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'España', label: 'España' },
    { value: 'Estados Unidos', label: 'Estados Unidos' },
    { value: 'Francia', label: 'Francia' },
    { value: 'Italia', label: 'Italia' },
    { value: 'México', label: 'México' },
    { value: 'Perú', label: 'Perú' },
    { value: 'Reino Unido', label: 'Reino Unido' },
    { value: 'Venezuela', label: 'Venezuela' },
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    seudonimo: "",
    fechaNacimiento: "",
    pais: "",
    biografia: "",
    distinciones: "",
    generos: [] // Asegúrate de inicializar esto
  });

  const { createAutor, isCreatingAutor } = useCreateAutor();
  const [fotoAutor, setFotoAutor] = useState(null);
  const [generosLiterarios, setGenerosLiterarios] = useState([]);

  // Fetch literary genres
  useEffect(() => {
    const fetchGenerosLiterarios = async () => {
      try {
        const response = await fetch('/api/geneLiter/getgeneros', {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data) {
          setGenerosLiterarios(data);
        } else {
          console.error("Error al obtener géneros literarios:", data.message);
        }
      } catch (error) {
        console.error("Error al obtener géneros literarios:", error);
      }
    };

    fetchGenerosLiterarios();
  }, [token]); // Solo se llama cuando 'token' cambia

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
    e.preventDefault();
    // Validar campos requeridos
    if (!formData.nombre || !formData.fechaNacimiento || !formData.pais) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }
    // Enviar datos del formulario y las imágenes
    await createAutor({
      ...formData,
      fotoAutor,
    });
    onClose();
    obtenerAutores();
  };

  const handleGeneroChange = (generoId) => {
    setFormData(prevData => {
      const { generos } = prevData;
      if (generos.includes(generoId)) {
        return { ...prevData, generos: generos.filter(id => id !== generoId) }; // Elimina el género si ya está seleccionado
      } else if (generos.length < 5) {
        return { ...prevData, generos: [...generos, generoId] }; // Agrega el género
      }
      return prevData; // No se permite más de 5 géneros
    });
  };

  // Esta condición permite que el modal se cierre sin interferir con los hooks
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <form className="bg-white p-5 rounded-lg w-90 md:w-106 relative overflow-hidden" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <div className="border-b-2 border-primary pb-2 mb-5">
          <h2 className="text-lg text-center text-primary">CREAR AUTOR</h2>
        </div>

        <div className="overflow-y-auto max-h-80 mb-5 text-primary text-lg modal-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-primary">Foto del autor</label>
              <input type="file" accept="image/*" onChange={handleImgChange} className="w-full p-2 mb-3 rounded focus:border-primary border" />
              {fotoAutor && <img src={fotoAutor} alt="Preview" className="w-32 h-32 mb-3 object-cover rounded-full" />}

              <label className="block mb-1 text-primary">Nombre autor</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre autor" className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none" />

              <label className="block mb-1 text-primary">Seudónimo</label>
              <input type="text" name="seudonimo" value={formData.seudonimo} onChange={handleInputChange} placeholder="Seudónimo" className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none" />

              <label className="block mb-1 text-primary">Distinciones</label>
              <textarea placeholder="Distinciones (separa por comas)" className="w-full border border-blue-950 rounded p-2 resize-y" value={formData.distinciones} name="distinciones" onChange={handleInputChange} rows={4} />
            </div>

            <div>
              <label className="block mb-1 text-primary">Fecha de nacimiento</label>
              <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleInputChange} className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none" />

              <label className="block mb-1 text-blue-950 font-semibold">País</label>
              <Select
                id='pais'
                options={paises}
                value={paises.find(option => option.value === formData.pais) || null}
                onChange={(selectedOption) => handleInputChange({ target: { name: 'pais', value: selectedOption.value } })}
                className='flex-1 mb-3'
                placeholder='Selecciona un país'
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: '1px solid #111829',
                    borderRadius: '0.375rem',
                    padding: '0.5rem',
                    boxShadow: 'none',
                    '&:hover': {
                      border: '1px solid #A0AEC0',
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
              <textarea name="biografia" value={formData.biografia} onChange={handleInputChange} placeholder="Biografía" className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none" />

              <h4 className='font-bold'>Selecciona hasta 5 géneros:</h4>
              <div className='grid grid-cols-2 gap-2'>
                {generosLiterarios.map((genero) => (
                  <label key={genero.nombre} className='flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      name='generos'
                      value={genero._id}
                      checked={formData.generos.includes(genero._id)}
                      onChange={() => handleGeneroChange(genero._id)}
                      className='hidden'
                    />
                    <div
                      className={`flex items-center border rounded-full p-2 ${formData.generos.includes(genero._id) ? 'bg-primary text-white' : 'bg-gray-200 text-primary'}`}
                    >
                      {genero.nombre}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition">
          {isCreatingAutor ? "Creando autor..." : "Crear autor"}
        </button>
        <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition">
          &times;
        </button>
      </form>
    </div>
  );
}

export default ModalCrearAutor;
