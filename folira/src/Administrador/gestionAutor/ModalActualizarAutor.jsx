import { useEffect, useState, useRef } from "react";
import useUpdateAutor from '../../hooks/useUpdateAutor.jsx';

const ModalActualizarAutor = ({ isOpen, onClose, autorId, token }) => {
    const [formData, setFormData] = useState({
        nombre: "",
        seudonimo: "",
        biografia: "",
        pais: "",
        fechaNacimiento: "",
        distinciones: [],
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
                            fechaNacimiento: data.fechaNacimiento || "",
                            distinciones: data.distinciones || [],
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
        if (name === "distinciones") {
            if (checked && formData.distinciones.length < 5) {
                setFormData((prevData) => ({
                    ...prevData,
                    distinciones: [...prevData.distinciones, value],
                }));
            } else if (!checked) {
                setFormData((prevData) => ({
                    ...prevData,
                    distinciones: prevData.distinciones.filter((distincion) => distincion !== value),
                }));
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    return (
        <>
            {isOpen && (
                <dialog id='edit_author_modal' className='modal' open>
                    <div className='modal-box border rounded-md border-blue-950 h-[500px] shadow-md modal-scrollbar'>
                        <h3 className='text-primary font-bold text-lg my-3'>Actualizar Autor</h3>
                        <form
                            className='text-primary flex flex-col gap-4'
                            onSubmit={(e) => {
                                e.preventDefault();
                                updateAutor({ ...formData, fotoAutor });
                            }}
                        >
                            {/* AUTHOR PHOTO */}
                            <div className='relative group/photo'>
                                <img
                                    src={fotoAutor || "/avatar-placeholder.png"}
                                    className='h-32 w-32 rounded-full object-cover'
                                    alt='author avatar'
                                />
                                <div
                                    className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer'
                                    onClick={() => fotoAutorRef.current.click()}
                                >
                                    <span className='w-5 h-5 text-white'>Editar</span>
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

                            <textarea
                                placeholder='Biografía'
                                className='w-full border border-blue-950 rounded p-2 input-md'
                                value={formData.biografia}
                                name='biografia'
                                onChange={handleInputChange}
                                maxLength={200}
                                rows={4}
                                style={{ resize: 'none', overflowWrap: 'break-word' }}
                            />

                            <input
                                type='text'
                                placeholder='País'
                                className='input border border-blue-950 rounded p-2 input-md'
                                value={formData.pais}
                                name='pais'
                                onChange={handleInputChange}
                            />

                            <input
                                type='date'
                                className='input border border-blue-950 rounded p-2 input-md'
                                value={formData.fechaNacimiento}
                                name='fechaNacimiento'
                                onChange={handleInputChange}
                            />

                            {/* Distinciones */}
                            <h4 className='font-bold'>Selecciona hasta 5 distinciones:</h4>
                            <div className='grid grid-cols-2 gap-2'>
                                {generosLiterarios.map((genero) => (
                                    <label key={genero.nombre} className='flex items-center cursor-pointer'>
                                        <input
                                            type='checkbox'
                                            name='distinciones'
                                            value={genero._id}
                                            checked={formData.distinciones.includes(genero._id)}
                                            onChange={handleInputChange}
                                            className='hidden'
                                        />
                                        <div
                                            className={`flex items-center border rounded-full p-2 ${formData.distinciones.includes(genero._id)
                                                ? "bg-primary text-white"
                                                : "border-primary text-primary"
                                                }`}
                                        >
                                            <span>{genero.nombre}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            <div className='modal-action'>
                                <button className='btn btn-primary' type='submit' disabled={isUpdatingAuthors}>
                                    {isUpdatingAuthors ? "Actualizando..." : "Guardar"}
                                </button>
                                {isError && <p className='text-red-500'>{error.message}</p>}
                                <button className='btn btn-outline' type='button' onClick={onClose}>
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

export default ModalActualizarAutor;
