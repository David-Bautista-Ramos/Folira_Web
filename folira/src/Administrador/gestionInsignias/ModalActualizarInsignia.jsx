import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ModalActualizarInsignia = ({ isOpen, onClose, insignia, onUpdate }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fotoInsigniaURL, setFotoInsigniaURL] = useState('');
  const [estado, setEstado] = useState(true);

  useEffect(() => {
    if (insignia) {
      setNombre(insignia.nombre);
      setDescripcion(insignia.descripcion);
      setFotoInsigniaURL(insignia.fotoInsignia.fotoInsigniaURL);
      setEstado(insignia.estado);
    }
  }, [insignia]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedInsignia = {
      ...insignia,
      nombre,
      descripcion,
      fotoInsignia: { fotoInsigniaURL },
      estado,
    };
    onUpdate(updatedInsignia);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
  <div className="fixed inset-0 bg-black opacity-50" onClick={onClose} />
  <form
    className="bg-white p-5 rounded-lg max-w-sm w-full shadow-lg relative z-10"
    onClick={(e) => e.stopPropagation()}
    onSubmit={handleSubmit}
  >
    <h2 className="text-xl text-primary text-center mb-4">Actualizar Insignia</h2>

    <div className="mb-4">
      <label className="block mb-1 text-gray-700" htmlFor="nombre">Nombre</label>
      <input
        type="text"
        id="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        className="p-2 border border-gray-400 rounded w-full focus:border-primary focus:outline-none"
      />
    </div>

    <div className="mb-4">
      <label className="block mb-1 text-gray-700" htmlFor="descripcion">Descripción</label>
      <textarea
        id="descripcion"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
        className="p-2 border border-gray-400 rounded w-full focus:border-primary focus:outline-none"
      />
    </div>

    <div className="mb-4">
      <label className="block mb-1 text-gray-700" htmlFor="fotoInsigniaURL">URL de la Foto</label>
      <input
        type="text"
        id="fotoInsigniaURL"
        value={fotoInsigniaURL}
        onChange={(e) => setFotoInsigniaURL(e.target.value)}
        required
        className="p-2 border border-gray-400 rounded w-full focus:border-primary focus:outline-none"
      />
    </div>

    <div className="mb-4">
      <label className="block mb-1 text-gray-700">Estado</label>
      <select
        value={estado}
        onChange={(e) => setEstado(e.target.value === 'true')}
        className="p-2 border border-gray-400 rounded w-full focus:border-primary focus:outline-none"
      >
        <option value={true}>Activa</option>
        <option value={false}>Inactiva</option>
      </select>
    </div>

    <div className="flex justify-end gap-2 mt-3">
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="bg-primary text-white py-2 px-4 rounded-md hover:bg-blue-950"
      >
        Actualizar
      </button>
    </div>
  </form>
</div>

  );
};

ModalActualizarInsignia.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  insignia: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default ModalActualizarInsignia;
