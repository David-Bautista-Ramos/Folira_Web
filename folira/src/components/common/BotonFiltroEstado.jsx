const BotonFiltroEstado = ({ onOpen }) => {
    return (
        <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition duration-200"
            onClick={onOpen} // Abre el modal al hacer clic
        >
            Filtrar por Estado
        </button>
    );
};

export default BotonFiltroEstado;
