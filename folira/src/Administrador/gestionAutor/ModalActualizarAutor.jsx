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
                        overflow: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        top: '5%',
                        width: '100%',
                        padding: '20px',
                    }}
                >
                    <div className="modal-box border rounded-md border-blue-950 w-full max-w-4xl h-full shadow-md flex flex-col">
                        <h3 className='text-primary font-bold text-lg my-3'>Actualizar Autor</h3>
                        <form
                            className="text-primary grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto"
                            style={{ maxHeight: 'calc(90vh - 150px)', overflowY: 'auto' }}
                            onSubmit={handleSubmit}
                        >
                            {/* Primera columna */}
                            <div className="flex flex-col gap-4">
                                {/* AUTHOR PHOTO */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Foto del Autor</label>
                                    <div className='relative group/photo flex justify-center'>
                                        <div className='w-32 h-32 mr-[60%] rounded-full overflow-hidden border-4 border-white'>
                                            <img
                                                src={fotoAutor || "/avatar-placeholder.png"}
                                                className='w-full h-full  object-cover'
                                                alt='author avatar'
                                            />
                                        </div>
                                        <div className='absolute top-5 right-[65%] p-1 rounded-full bg-gray-800 bg-opacity-75 cursor-pointer flex items-center justify-center hover:bg-blue-950'
                                            style={{ width: '40px', height: '24px', zIndex: 10 }}
                                            onClick={() => fotoAutorRef.current.click()}
                                        >
                                            <span className='w-full  text-white text-xs text-center'>Editar</span>
                                        </div>
                                        <input
                                            type='file'
                                            hidden
                                            accept='image/*'
                                            ref={fotoAutorRef}
                                            onChange={handleImgChange}
                                        />
                                    </div>
                                </div>
    
                                <div>
                                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                                        Nombre
                                    </label>
                                    <input
                                        type='text'
                                        id="nombre"
                                        placeholder='Nombre'
                                        className='input border border-blue-950 rounded p-2 w-[100%] input-md'
                                        value={formData.nombre}
                                        name='nombre'
                                        onChange={handleInputChange}
                                    />
                                </div>
    
                                <div>
                                    <label htmlFor="seudonimo" className="block text-sm font-medium text-gray-700">
                                        Seudónimo
                                    </label>
                                    <input
                                        type='text'
                                        id="seudonimo"
                                        placeholder='Seudónimo'
                                        className='input border border-blue-950 rounded w-[100%] p-2 input-md'
                                        value={formData.seudonimo}
                                        name='seudonimo'
                                        onChange={handleInputChange}
                                    />
                                </div>
    
                                <div>
                                    <label htmlFor="pais" className="block text-sm font-medium text-gray-700">
                                        País
                                    </label>
                                    <Select
                                        inputId="pais"
                                        value={paises.find((option) => option.value === formData.pais)}
                                        options={paises}
                                        onChange={handleCountryChange}
                                        classNamePrefix="custom-select"
                                        placeholder="Seleccione un país"
                                    />
                                </div>
    
                                <div>
                                    <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700">
                                        Fecha de Nacimiento
                                    </label>
                                    <input
                                        type='date'
                                        id="fechaNacimiento"
                                        className='input border border-blue-950 rounded w-[100%] p-2 input-md'
                                        value={formData.fechaNacimiento}
                                        name='fechaNacimiento'
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
    
                            {/* Segunda columna */}
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="distinciones" className="block text-sm font-medium text-gray-700">
                                        Distinciones
                                    </label>
                                    <textarea
                                        id="distinciones"
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
                                </div>
    
                                <div>
                                    <label htmlFor="biografia" className="block text-sm font-medium text-gray-700">
                                        Biografía
                                    </label>
                                    <textarea
                                        id="biografia"
                                        placeholder="Biografía"
                                        className="w-full border border-blue-950 rounded p-2 resize-y"
                                        value={formData.biografia}
                                        name="biografia"
                                        onChange={handleInputChange}
                                        rows={8}
                                        style={{
                                            minHeight: '100px',
                                            maxHeight: '300px',
                                            overflowY: 'auto',
                                            overflowX: 'hidden',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
    
                                {/* Generos literarios */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Géneros Literarios
                                    </label>
                                    <div className='grid grid-cols-2 gap-2'>
                                        {generosLiterarios.map((genero) => (
                                            <label key={genero._id} className='flex items-center cursor-pointer'>
                                                <input
                                                    type='checkbox'
                                                    name='generos'
                                                    value={genero._id}
                                                    checked={formData.generos.includes(genero._id)}
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
                                </div>
                            </div>
    
                            {/* Botones de acción en una fila que ocupa ambas columnas */}
                            <div className="col-span-2 modal-action sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-300 flex justify-between">
                                <button className="bg-primary text-white px-4 py-2 ml-[73%] rounded-md hover:bg-blue-950" type='submit' disabled={isUpdatingAuthors}>
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
