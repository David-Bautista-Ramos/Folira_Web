import { useEffect, useState } from "react";
import useCreateAutor from "../../hooks/useCreateAutor";
import Select from "react-select";

function ModalCrearAutor({ isOpen, onClose, obtenerAutores, token }) {
  const paises = [
    { value: 'Afganistán', label: 'Afganistán' },
    { value: 'Alemania', label: 'Alemania' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Austria', label: 'Austria' },
    { value: 'Bélgica', label: 'Bélgica' },
    { value: 'Bolivia', label: 'Bolivia' },
    { value: 'Brasil', label: 'Brasil' },
    { value: 'Canadá', label: 'Canadá' },
    { value: 'Chile', label: 'Chile' },
    { value: 'China', label: 'China' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Corea del Sur', label: 'Corea del Sur' },
    { value: 'Costa Rica', label: 'Costa Rica' },
    { value: 'Cuba', label: 'Cuba' },
    { value: 'Dinamarca', label: 'Dinamarca' },
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'Egipto', label: 'Egipto' },
    { value: 'El Salvador', label: 'El Salvador' },
    { value: 'Emiratos Árabes Unidos', label: 'Emiratos Árabes Unidos' },
    { value: 'España', label: 'España' },
    { value: 'Estados Unidos', label: 'Estados Unidos' },
    { value: 'Filipinas', label: 'Filipinas' },
    { value: 'Francia', label: 'Francia' },
    { value: 'Grecia', label: 'Grecia' },
    { value: 'Guatemala', label: 'Guatemala' },
    { value: 'Honduras', label: 'Honduras' },
    { value: 'India', label: 'India' },
    { value: 'Indonesia', label: 'Indonesia' },
    { value: 'Irlanda', label: 'Irlanda' },
    { value: 'Israel', label: 'Israel' },
    { value: 'Italia', label: 'Italia' },
    { value: 'Japón', label: 'Japón' },
    { value: 'México', label: 'México' },
    { value: 'Nicaragua', label: 'Nicaragua' },
    { value: 'Noruega', label: 'Noruega' },
    { value: 'Nueva Zelanda', label: 'Nueva Zelanda' },
    { value: 'Países Bajos', label: 'Países Bajos' },
    { value: 'Panamá', label: 'Panamá' },
    { value: 'Paraguay', label: 'Paraguay' },
    { value: 'Perú', label: 'Perú' },
    { value: 'Polonia', label: 'Polonia' },
    { value: 'Portugal', label: 'Portugal' },
    { value: 'Reino Unido', label: 'Reino Unido' },
    { value: 'República Checa', label: 'República Checa' },
    { value: 'República Dominicana', label: 'República Dominicana' },
    { value: 'Rusia', label: 'Rusia' },
    { value: 'Sudáfrica', label: 'Sudáfrica' },
    { value: 'Suecia', label: 'Suecia' },
    { value: 'Suiza', label: 'Suiza' },
    { value: 'Tailandia', label: 'Tailandia' },
    { value: 'Turquía', label: 'Turquía' },
    { value: 'Ucrania', label: 'Ucrania' },
    { value: 'Uruguay', label: 'Uruguay' },
    { value: 'Venezuela', label: 'Venezuela' },
    { value: 'Vietnam', label: 'Vietnam' },
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

              <label className="block mb-1 text-primary">Biografía</label>
              <textarea name="biografia" value={formData.biografia} onChange={handleInputChange} placeholder="Biografía" className="w-full p-2 mb-3 border rounded focus:border-primary focus:outline-none" />


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

              
              <label className="block mb-1 text-primary">Distinciones</label>
              <textarea placeholder="Distinciones (separa por comas)" className="w-full border border-blue-950 rounded p-2 resize-y" value={formData.distinciones} name="distinciones" onChange={handleInputChange} rows={4} />

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

        <div  className="flex justify-end">

          <button type="submit" className="bg-primary mt-3 text-white px-4 py-2 rounded-md hover:bg-blue-950">
          {isCreatingAutor ? "Creando autor..." : "Crear"}
          </button>

          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md mt-3 ml-4 hover:bg-gray-400">
            Cerrar
          </button>
        </div>
        
      </form>
    </div>
  );
}

export default ModalCrearAutor;