import Insignias from "../models/insignias.js";
import cloudinary from 'cloudinary'

export const crearInsignia = async (req, res) => {
  try {
    const { nombre, descripcion, criterio } = req.body;
    let { icono } = req.body; // Asegúrate de que estás utilizando el nombre correcto para el archivo

    // Verificar si ya existe una insignia con el mismo nombre
    const insigniaExistente = await Insignias.findOne({ nombre });
    if (insigniaExistente) {
      return res.status(400).json({ error: "La insignia ya existe." });
    }

    // Manejar la subida del icono de la insignia, si existe
    let iconoUrl = null;
    if (icono) {
      const uploadedResponse = await cloudinary.uploader.upload(icono[0].path);
      iconoUrl = uploadedResponse.secure_url; // Guardar la URL del icono subido
    }

    // Crear la nueva insignia
    const nuevaInsignia = new Insignias({
      nombre,
      descripcion,
      icono: iconoUrl, // Guardar la URL del icono
      criterio,
      fechaCreacion: new Date(),
      estado: true, // Puedes establecer el estado predeterminado aquí
    });

    // Guardar la insignia en la base de datos
    await nuevaInsignia.save();
    res.status(201).json({ message: "Insignia creada con éxito", insignia: nuevaInsignia });
  } catch (error) {
    console.error("Error al crear la insignia:", error.message);
    res.status(500).json({ error: "Error al crear la insignia." });
  }
};

  export const obtenerInsignias = async (req, res)=>{
    try {
        const insignias = await Insignias.find();
        res.json(insignias);
      } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener insignias', error });
      }
  }

  export const actualizarInsignia = async (req, res) => {
    try {
      const { id } = req.params; // Obtener el ID de la insignia desde los parámetros
      const { nombre, descripcion, criterio, cantidadObjetivo } = req.body;
  
      let iconoUrl = null;
  
      // Si se sube un nuevo icono, se actualiza en Cloudinary
      if (req.file) {
        const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
          folder: 'insignias',
        });
        iconoUrl = uploadedResponse.secure_url;
      }
  
      // Construir el objeto de actualización, incluyendo el icono si fue proporcionado
      const datosActualizados = {
        nombre,
        descripcion,
        criterio,
        cantidadObjetivo,
        ...(iconoUrl && { icono: iconoUrl }), // Agrega icono solo si se subió uno nuevo
      };
  
      const insigniaActualizada = await Insignias.findByIdAndUpdate(id, datosActualizados, {
        new: true, // Retorna la insignia actualizada
      });
  
      if (!insigniaActualizada) {
        return res.status(404).json({ mensaje: 'Insignia no encontrada' });
      }
  
      res.json(insigniaActualizada);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar insignia', error });
    }
  };

  export const eliminarInsignia = async (req, res) => {
    try {
      const { id } = req.params;
  
      const insignia = await Insignias.findById(id);
      if (!insignia) {
        return res.status(404).json({ mensaje: 'Insignia no encontrada' });
      }
  
      // Opcional: Eliminar el icono de Cloudinary si existe
      if (insignia.icono) {
        const publicId = insignia.icono.split('/').pop().split('.')[0]; // Extraer public_id del icono
        await cloudinary.uploader.destroy(`insignias/${publicId}`);
      }
  
      await Insignias.findByIdAndDelete(id);
      res.json({ mensaje: 'Insignia eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al eliminar insignia', error });
    }
  };
