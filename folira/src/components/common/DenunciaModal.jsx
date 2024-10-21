const ModalDenuncia = ({ onDenuncia }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes manejar la lógica de la denuncia
    // Luego llama a onDenuncia para incrementar el contador
    onDenuncia(); // Esto incrementa el contador en el componente principal
    document.getElementById("denuncia_modal").close(); // Cierra el modal
  };

  return (
    <dialog id='denuncia_modal' className='modal'>
      <div className='modal-box border rounded-md border-blue-950 shadow-md'>
        <h3 className='text-primary font-bold text-lg my-3'>Denuncia</h3>
        
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          {/* Aquí va tu campo desplegable con las causas de la denuncia */}
          <select className='border border-blue-950 rounded p-2'>
            <option value='causa1'>Muestra de odio</option>
            <option value='causa2'>Suplantación de identidad</option>
            <option value='causa3'>Contenido Violento y explicito</option>
            <option value='causa4'>Fraude y estafa</option>
            <option value='causa5'>Suicidio , autolesione sy actos peligrosos</option>
            <option value='causa6'>Acoso o intimidación</option>
            <option value='causa6'>Venta o promoción de articulos</option>
            <option value='causa6'>Acoso o intimidación</option>
          </select>

          <button type='submit' className='btn btn-primary rounded-full btn-sm'>
            Hacer Denuncia
          </button>
        </form>
      </div>

      {/* Cerrar el modal */}
      <form method='dialog' className='modal-backdrop'>
        <button className='outline-none'>Cerrar</button>
      </form>
    </dialog>
  );
};

export default ModalDenuncia;
