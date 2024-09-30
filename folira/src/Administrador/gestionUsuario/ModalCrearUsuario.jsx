import { useState } from "react";

function ModalCrearUsuario({ isOpen, onClose }) {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");

  

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div
        className="bg-white p-5 rounded-lg w-90 md:w-106 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="border-b-2 border-primary pb-2 mb-5">
          <h2 className="text-lg text-center text-primary">CREAR USUARIO</h2>
        </div>
        <div className="overflow-y-auto max-h-80 mb-5 text-primary text-lg modal-scrollbar">
          <label className="block mb-1  text-primary ">Foto de perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="max-w-full h-auto mb-3 "
            />
          )}

        <label className="block mb-1  text-primary">Banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              className="max-w-full h-auto mb-3"
            />
          )}

          <label className="block mb-1  text-primary">Nombre usuario</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre usuario"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

        <label className="block mb-1  text-primary">Nombre completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre completo"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

<label className="block mb-1  text-primary">Correo electronico</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Correo electronico"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

<label className="block mb-1  text-primary">Contraseña</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contraseña"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

          <label className="block mb-1  text-primary">Fecha de nacimiento</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Fecha de nacimiento"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

            <label className="block mb-1  text-primary">Biografía</label>
          <textarea
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Biografía"
            className="w-full p-2 mb-3 border  rounded focus:border-primary focus:outline-none"
          />

        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md  hover:bg-gray-400"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button className="px-4 py-2 border rounded bg-primary text-white hover:bg-blue-950">
            Crear
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalCrearUsuario;
