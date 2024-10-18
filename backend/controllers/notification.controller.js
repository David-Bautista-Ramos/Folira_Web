import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getNotifications = async (req, res) => {
	try {
		const userId = req.user._id;

		const notifications = await Notification.find({ para: userId }).populate({
			path: "de",
			select: "nombre fotoPerfil",
		});

		await Notification.updateMany({ para: userId }, { read: true });

		res.status(200).json(notifications);
	} catch (error) {
		console.log("Error in getNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteNotifications = async (req, res) => {
	try {
		const userId = req.user._id;

		await Notification.deleteMany({ para: userId });

		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
		console.log("Error in deleteNotifications function", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deteteNotification = async (req, res) => {
    try {
        const {notificationId} = req.params;
        const userId = req.user._id;
        
        // Buscar la notificación por ID
        const notification = await Notification.findById(notificationId);

        // Si no se encuentra la notificación
        if (!notification) {
            return res.status(404).json({ error: "Notificación no encontrada" });
        }

        // Verificar si el usuario tiene permiso para eliminar la notificación
        if (notification.para.toString() !== userId.toString()) {
            return res.status(403).json({ error: "No tienes permiso para eliminar esta notificación" });
        }

        // Eliminar la notificación
        await Notification.findByIdAndDelete(notificationId);
        return res.status(200).json({ message: "Notificación eliminada con éxito" });

    } catch (error) {
        console.log("Error in deleteNotification function", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};



{/*ADMIN*/}

// Crear una nueva notificación
export const crearNotificacion = async (req, res) => {
    try {
        const { de, para, tipo } = req.body;

        const nuevaNotificacion = new Notification({
            de,
            para,
            tipo,
        });

        // Guardar la notificación en la base de datos
        await nuevaNotificacion.save();
        res.status(201).json({ message: "Notificación creada con éxito", notificacion: Notification });
    } catch (error) {
        console.error("Error al crear la notificación:", error.message);
        res.status(500).json({ error: "Error al crear la notificación." });
    }
};
// Obtener todos los usuarios
export const obtenerUsuarios = async (req, res) => {
    try {
      const usuarios = await User.find(); // Puedes agregar filtros si es necesario
      res.status(200).json({usuarios});
    } catch (error) {
      res.status(500).json({ error: "Error al obtener usuarios" });
    }
  };
export const obtenerTodasNotificaciones = async (req, res) => {
    try {
        const notificaciones = await Notification.find()
            .populate('de', 'nombre')
            .populate('para', 'nombre');

        res.status(200).json({ notificaciones });
    } catch (error) {
        console.error("Error al obtener las notificaciones:", error.message);
        res.status(500).json({ error: "Error al obtener las notificaciones." });
    }
};

// Obtener todas las notificaciones de un usuario
export const obtenerNotificaciones = async (req, res) => {
    try {
        const { para } = req.params;  // ID del usuario receptor

        const notificaciones = await Notification.find({ para })
            .populate('de', 'nombre')
            .populate('para', 'nombre');

        res.status(200).json({ notificaciones });
    } catch (error) {
        console.error("Error al obtener las notificaciones:", error.message);
        res.status(500).json({ error: "Error al obtener las notificaciones." });
    }
};

// Obtener todas las notificaciones de un usuario
export const obtenerNotificacionesId = async (req, res) => {
    try {
        const { id } = req.params;  // ID de la notificación

        const notificaciones = await Notification.findById(id);
           

        if (!notificaciones) {
            return res.status(404).json({ error: "Notificación no encontrada." });
        }

        res.status(200).json(notificaciones);
    } catch (error) {
        console.error("Error al obtener las notificaciones:", error.message);
        res.status(500).json({ error: "Error al obtener las notificaciones." });
    }
};

// Update Notification
export const updateNotification = async (req, res) => {
    const { id } = req.params; // Notification ID from the URL
    const { de, para, tipo } = req.body; // Data from the request body
  
    try {
      // Find the notification and update it
      const updatedNotification = await Notification.findByIdAndUpdate(
        id,
        { de, para, tipo },
        { new: true, runValidators: true } // Options: return updated doc, validate before saving
      );
  
      // Check if notification was found
      if (!updatedNotification) {
        return res.status(404).json({ message: 'Notificación no encontrada' });
      }
  
      // Return the updated notification
      return res.status(200).json(updatedNotification);
    } catch (error) {
      console.error("Error al actualizar la notificación:", error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

// Marcar una notificación como no leída
export const marcarNotificacionNoLeida = async (req, res) => {
    try {
        const { id } = req.params;

        const notificacionActualizada = await Notification.findByIdAndUpdate(id, { leido: false }, { new: true });

        if (!notificacionActualizada) {
            return res.status(404).json({ error: "Notificación no encontrada." });
        }

        res.status(200).json({ message: "Notificación marcada como no leída", notificacion: notificacionActualizada });
    } catch (error) {
        console.error("Error al marcar la notificación como leída:", error.message);
        res.status(500).json({ error: "Error al marcar la notificación como leída." });
    }
};
// Marcar una notificación como leída
export const marcarNotificacionLeida = async (req, res) => {
    try {
        const { id } = req.params;

        const notificacionActualizada = await Notification.findByIdAndUpdate(id, { leido: true }, { new: true });

        if (!notificacionActualizada) {
            return res.status(404).json({ error: "Notificación no encontrada." });
        }

        res.status(200).json({ message: "Notificación marcada como leída", notificacion: notificacionActualizada });
    } catch (error) {
        console.error("Error al marcar la notificación como leída:", error.message);
        res.status(500).json({ error: "Error al marcar la notificación como leída." });
    }
};

// Obtener el recuento de notificaciones no leídas para un usuario
export const obtenerNotificacionesNoLeidas = async (req, res) => {
    try {
        const { para } = req.params;  // ID del usuario receptor

        const notificacionesNoLeidas = await Notification.countDocuments({ para, leido: false });

        res.status(200).json({ count: notificacionesNoLeidas });
    } catch (error) {
        console.error("Error al obtener el recuento de notificaciones no leídas:", error.message);
        res.status(500).json({ error: "Error al obtener el recuento de notificaciones no leídas." });
    }
};
// Obtener el recuento de notificaciones no leídas de usuarios
export const obtenerNotificacionesNoLeidasAD = async (req, res) => {
    try {
        const notificacionesNoLeidas = await Notification.find({ leido: false })
        .populate('de', 'nombre')
        .populate('para', 'nombre');

        res.status(200).json( {notificacionesNoLeidas} );
    } catch (error) {
        console.error("Error al obtener el recuento de notificaciones no leídas:", error.message);
        res.status(500).json({ error: "Error al obtener el recuento de notificaciones no leídas." });
    }
};

// Obtener el recuento de notificaciones no leídas de usuarios
export const obtenerNotificacionesLeidasAD = async (req, res) => {
    try {
        const notificacionesNoLeidas = await Notification.find({ leido: true })
        .populate('de', 'nombre')
        .populate('para', 'nombre');

        res.status(200).json({notificacionesNoLeidas} );
    } catch (error) {
        console.error("Error al obtener el recuento de notificaciones leídas:", error.message);
        res.status(500).json({ error: "Error al obtener el recuento de notificaciones leídas." });
    }
};


// Eliminar una notificación
export const eliminarNotificacion = async (req, res) => {
    try {
        const { id } = req.params;

        const notificacionEliminada = await Notification.findByIdAndDelete(id);

        if (!notificacionEliminada) {
            return res.status(404).json({ error: "Notificación no encontrada." });
        }

        res.status(200).json({ message: "Notificación eliminada con éxito", notificacion: notificacionEliminada });
    } catch (error) {
        console.error("Error al eliminar la notificación:", error.message);
        res.status(500).json({ error: "Error al eliminar la notificación." });
    }
};
