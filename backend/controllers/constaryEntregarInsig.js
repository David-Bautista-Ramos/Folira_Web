import EventosUsuario from "../models/eventoUsuario.js";
import Insignias from "../models/insignias.js";
import UsuarioInsignias from "../models/usuarioInsignia.js";

// Registrar un evento de usuario
export const registrarEvento = async (usuarioId, tipo, datos = {}) => {
  try {
    if (tipo === 'tiempoPantalla') {
      // Acumula tiempo en pantalla
      await EventosUsuario.findOneAndUpdate(
        { usuarioId, tipo },
        { $inc: { cantidad: datos.cantidad || 1 } },
        { upsert: true, new: true }
      );
    } else {
      // Crea un nuevo evento para otros tipos
      const nuevoEvento = new EventosUsuario({
        usuarioId,
        tipo,
        ...datos, // Datos adicionales como publicacionId, libroId, etc.
      });

      await nuevoEvento.save();
    }

    console.log(`Evento ${tipo} registrado para el usuario ${usuarioId}`);
    await otorgarInsignia(usuarioId, tipo); // Verifica si se puede otorgar una insignia
  } catch (error) {
    console.error("Error al registrar evento:", error);
  }
};

// Otorgar insignia si se cumplen los criterios
export const otorgarInsignia = async (usuarioId, tipo) => {
  try {
    const evento = await EventosUsuario.findOne({ usuarioId, tipo });
    const cantidad = evento ? evento.cantidad : 0;

    // Busca todas las insignias que cumplan con los criterios
    const insignias = await Insignias.find({ 
      criterio: tipo, 
      cantidadObjetivo: { $lte: cantidad } 
    });

    for (const insignia of insignias) {
      const yaTieneInsignia = await UsuarioInsignias.findOne({
        usuarioId, 
        insigniaId: insignia._id
      });

      if (!yaTieneInsignia) {
        const nuevaInsignia = new UsuarioInsignias({
          usuarioId,
          insigniaId: insignia._id,
        });

        await nuevaInsignia.save();
        console.log(`Insignia "${insignia.nombre}" otorgada al usuario ${usuarioId}`);
      }
    }
  } catch (error) {
    console.error("Error al otorgar insignia:", error);
  }
};
