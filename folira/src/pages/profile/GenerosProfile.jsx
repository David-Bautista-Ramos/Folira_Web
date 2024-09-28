const GenerosLiterarios = () => {
    const generos = [
      { nombre: "Drama", imagen: "/path/to/drama.png" },
      { nombre: "Terror", imagen: "/path/to/terror.png" },
      { nombre: "Desarrollo Personal", imagen: "/path/to/romance.png" },
      { nombre: "Comedia", imagen: "/path/to/comedia.png" },
      { nombre: "Negocios", imagen: "/path/to/negocios.png" }
    ];
  
    return (
      <div className='flex flex-col mt-4 -mb-3'>
        {/* Usamos flex y flex-wrap para que los géneros se acomoden según el espacio disponible */}
        <div className='flex flex-wrap gap-4'>
          {generos.map((genero) => (
            <div 
              key={genero.nombre} 
              className='flex items-center border rounded-full p-2 bg-white min-w-[120px] max-w-[150px] truncate'
            >
              <img src={genero.imagen} alt={genero.nombre} className='w-8 h-8 mr-2' />
              <span className="truncate">{genero.nombre}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default GenerosLiterarios;
  