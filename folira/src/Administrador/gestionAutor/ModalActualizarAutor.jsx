import { useEffect, useState, useRef } from "react";
import useUpdateAutor from '../../hooks/useUpdateAutor.jsx';
import Select from 'react-select';


const ModalActualizarAutor = ({ isOpen, onClose, autorId, token, obtenerAutores }) => {

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
        biografia: "",
        pais: "",
        distinciones: "" ,
        fechaNacimiento: "",
        generos: [],
    });
    const [fotoAutor, setFotoAutor] = useState(null);
    const [generosLiterarios, setGenerosLiterarios] = useState([]);
    const fotoAutorRef = useRef(null);
    
    const { updateAutor, isUpdatingAuthors, isError, error } = useUpdateAutor(autorId);

    // Handles image upload
    const handleImgChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFotoAutor(reader.result); // Update photo state directly
            };
            reader.readAsDataURL(file);
        }
    };

    // Fetch author data when the modal opens
    useEffect(() => {
        const fetchAuthorData = async () => {
            if (isOpen && autorId) {
                try {
                    const response = await fetch(`/api/autror/autores/${autorId}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    const data = await response.json();
                    if (response.ok && data) {
                        setFormData({
                            nombre: data.nombre || "",
                            seudonimo: data.seudonimo || "",
                            biografia: data.biografia || "",
                            pais: data.pais || "",
                            distinciones: data.distinciones || "",
                            fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento).toISOString().split('T')[0] : "",
                            generos: data.generos.map(genero => genero._id) || [], // Asegúrate de que solo los IDs se almacenen
                        });
                        setFotoAutor(data.fotoAutor || "");
                    } else {
                        console.error("Error al obtener los datos del autor:", data.message);
                    }
                } catch (error) {
                    console.error("Error al obtener los datos del autor:", error);
                }
            }
        };

        fetchAuthorData();
    }, [isOpen, autorId, token]);

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
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === "generos") {
            if (checked && formData.generos.length < 5) {
                setFormData((prevData) => ({
                    ...prevData,
                    generos: [...prevData.generos, value],
                }));
            } else if (!checked) {
                setFormData((prevData) => ({
                    ...prevData,
                    generos: prevData.generos.filter((genero) => genero !== value),
                }));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateAutor({ ...formData, fotoAutor });
            obtenerAutores(); // Actualiza la lista de autores
            onClose(); // Cierra el modal
        } catch (error) {
            console.error("Error al actualizar el autor:", error);
        }
    };

    const handleCountryChange = (selectedOption) => {
        setFormData((prevData) => ({
            ...prevData,
            pais: selectedOption ? selectedOption.value : "",
        }));
    };
    
    

    return (
        <>
            {isOpen && (
                <>
                    {/* Fondo negro transparente */}
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />

                    <dialog
                        id="edit_author_modal"
                        className="modal"
                        open
                        style={{
                            maxHeight: '90vh',
                            overflow: 'auto', // Cambia a 'auto' para permitir el desplazamiento
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            top: '5%',
                            width: '100%', // Asegúrate de que tenga un ancho adecuado
                            padding: '20px', // Asegúrate de que haya espacio
                        }}
                    >
                        <div className="modal-box border rounded-md border-blue-950 w-full max-w-lg h-full shadow-md flex flex-col">
                            <h3 className='text-primary font-bold text-lg my-3'>Actualizar Autor</h3>
                            <form
                                className="text-primary flex flex-col gap-4 overflow-y-auto"
                                style={{ maxHeight: 'calc(90vh - 150px)', overflowY: 'auto' }}
                                onSubmit={handleSubmit}
                            >
                                {/* AUTHOR PHOTO */}
                                <div className='relative group/photo'>
                                    <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-white'>
                                        <img
                                            src={fotoAutor || "/avatar-placeholder.png"}
                                            className='w-full h-full object-cover'
                                            alt='author avatar'
                                        />
                                    </div>
                                    
                                    <div className='absolute top-5 right-[75%] p-1 rounded-full bg-gray-800 bg-opacity-75 cursor-pointer flex items-center justify-center hover:bg-blue-950'
                                        style={{ width: '40px', height: '24px', zIndex: 10 }}
                                        onClick={() => fotoAutorRef.current.click()}
                                    >
                                        <span className='w-full text-white text-xs text-center'>Editar</span>
                                    </div>

                                    <input
                                        type='file'
                                        hidden
                                        accept='image/*'
                                        ref={fotoAutorRef}
                                        onChange={handleImgChange}
                                    />
                                </div>

                                {/* FORMULARIO */}
                                <input
                                    type='text'
                                    placeholder='Nombre'
                                    className='input border border-blue-950 rounded p-2 input-md'
                                    value={formData.nombre}
                                    name='nombre'
                                    onChange={handleInputChange}
                                />

                                <input
                                    type='text'
                                    placeholder='Seudónimo'
                                    className='input border border-blue-950 rounded p-2 input-md'
                                    value={formData.seudonimo}
                                    name='seudonimo'
                                    onChange={handleInputChange}
                                />

                                {/* Campo para distinciones */}
                                <textarea
                                    placeholder="Distinciones (separa por comas)"
                                    className="w-full border border-blue-950 rounded p-2 resize-y"
                                    value={formData.distinciones}
                                    name="distinciones"
                                    onChange={handleInputChange}
                                    rows={4}
                                    style={{
                                        minHeight: '60px',
                                        maxHeight: '100px',
                                        overflowY: 'auto',
                                        overflowX: 'hidden',
                                        boxSizing: 'border-box'
                                    }}
                                />

                                <textarea
                                    placeholder="Biografía"
                                    className="w-full border border-blue-950 rounded p-2 resize-y" // Mantiene resize-y
                                    value={formData.biografia}
                                    name="biografia"
                                    onChange={handleInputChange}
                                    rows={8} // Número de filas inicial
                                    style={{
                                        minHeight: '100px', // Altura mínima
                                        maxHeight: '300px', // Altura máxima
                                        overflowY: 'auto', // Permite desplazamiento vertical
                                        overflowX: 'hidden', // Evita el desplazamiento horizontal
                                        boxSizing: 'border-box' // Asegura que el padding no afecte el tamaño total
                                    }}
                                />


                                <Select
                                    value={paises.find((option) => option.value === formData.pais)}
                                    options={paises}
                                    onChange={handleCountryChange}
                                    classNamePrefix="custom-select"
                                    placeholder="Seleccione un país"
                                />




                                <input
                                    type='date'
                                    className='input border border-blue-950 rounded p-2 input-md'
                                    value={formData.fechaNacimiento}
                                    name='fechaNacimiento'
                                    onChange={handleInputChange}
                                />

                                {/* generos */}
                                <div className='grid grid-cols-2 gap-2'>
                                    {generosLiterarios.map((genero) => (
                                        <label key={genero._id} className='flex items-center cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                name='generos'
                                                value={genero._id}
                                                checked={formData.generos.includes(genero._id)} // Asegúrate de que esto es correcto
                                                onChange={handleInputChange}
                                                className='hidden'
                                            />
                                            <div
                                                className={`flex items-center border rounded-full p-2 ${
                                                    formData.generos.includes(genero._id) ? 'bg-blue-950 text-white' : 'border-blue-950 text-blue-950'
                                                }`}
                                            >
                                                {genero.nombre}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {/* Submit button moved here */}
                                <div className="modal-action sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-300 flex justify-between">
                                    <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-950 ml-[52%]" type='submit' disabled={isUpdatingAuthors}>
                                        {isUpdatingAuthors ? "Actualizando..." : "Actualizar"}
                                    </button>
                                    {isError && <p className='text-red-500'>{error.message}</p>}
                                    <button className='px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400' type='button' onClick={onClose}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </dialog>
                </>
            )}
        </>
    );
};

export default ModalActualizarAutor;
