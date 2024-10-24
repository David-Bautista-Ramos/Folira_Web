import Insignias from "../models/insignias.js";
import cloudinary from 'cloudinary'

export const crearInsignia = async (req, res) => {
  try {
    const { nombre, descripcion, criterio, cantidadObjetivo } = req.body;
    let iconoUrl = null;

    // Manejar la subida del icono, si existe
    if (req.file) {
      // Si ya hay un icono existente, eliminarlo de Cloudinary
      if (req.body.iconoUrl) { // Asumiendo que envías la URL del icono existente
        const publicId = req.body.iconoUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }

      const uploadedResponse = await cloudinary.uploader.upload(req.file.path, {
        folder: 'insignias',
      });
      iconoUrl = uploadedResponse.secure_url;
    } else {
      return res.status(400).json({ mensaje: 'Es necesario subir un icono' });
    }

    const nuevaInsignia = new Insignias({
      nombre,
      descripcion,
      criterio,
      cantidadObjetivo,
      icono: iconoUrl, // Guardar la URL segura del icono
    });

    await nuevaInsignia.save();
    res.status(201).json(nuevaInsignia);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear insignia', error });
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
