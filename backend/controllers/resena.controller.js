import Resena from "../models/resena.model.js";

// Crear una nueva reseña
export const crearResena = async (req, res) => {
    try {
        const { contenido, calificacion, idUsuario, idLibro, idAutor } = req.body;

        const nuevaResena = new Resena({
            contenido,
            calificacion,
            idUsuario,
            idLibro,
            idAutor,
        });

        // Guardar la reseña en la base de datos
        await nuevaResena.save();
        res.status(201).json({ message: "Reseña creada con éxito", resena: nuevaResena });
    } catch (error) {
        console.error("Error al crear la reseña:", error.message);
        res.status(500).json({ error: "Error al crear la reseña." });
    }
};

export const obtenerResena =async(req, res) => {
    try {
        const resenas = await Resena.find().populate({ path: "idUsuario", select: "-contrasena",}).populate('idLibro').populate('idAutor');
        res.status(200).json(resenas);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

// Obtener todas las reseñas (activos o inactivos)
export const obtenerResenasAct = async (req, res) => {
    try {
        const estado = true;

        const resenas = await Resena.find({estado:estado})
            .populate('idUsuario', 'nombre')
            .populate('idLibro', 'titulo')
            .populate('idAutor', 'nombre');
        
        res.status(200).json({ resenas });
    } catch (error) {
        console.error("Error al obtener las reseñas:", error.message);
        res.status(500).json({ error: "Error al obtener las reseñas." });
    }
};

export const obtenerResenasDes = async (req, res) => {
    try {
        const estado = false;

        const resenas = await Resena.find({estado:estado})
            .populate('idUsuario', 'nombre')
            .populate('idLibro', 'titulo')
            .populate('idAutor', 'nombre');
        
        res.status(200).json({ resenas });
    } catch (error) {
        console.error("Error al obtener las reseñas:", error.message);
        res.status(500).json({ error: "Error al obtener las reseñas." });
    }
};

// Obtener una reseña por su ID
export const obtenerResenaPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const resena = await Resena.findById(id)
            .populate('idUsuario', 'nombre')
            .populate('idLibro', 'titulo')
            .populate('idAutor', 'nombre');

        if (!resena) {
            return res.status(404).json({ error: "Reseña no encontrada." });
        }

        res.status(200).json({ resena });
    } catch (error) {
        console.error("Error al obtener la reseña:", error.message);
        res.status(500).json({ error: "Error al obtener la reseña." });
    }
};

// Editar una reseña
export const editarResena = async (req, res) => {
    try {
        const { id } = req.params;
        const { contenido, calificacion, idLibro, idAutor, estado } = req.body;

        const resenaActualizada = await Resena.findByIdAndUpdate(id, {
            contenido,
            calificacion,
            idLibro,
            idAutor,
            estado
        }, { new: true, runValidators: true });

        if (!resenaActualizada) {
            return res.status(404).json({ error: "Reseña no encontrada." });
        }

        res.status(200).json({ message: "Reseña actualizada con éxito", resena: resenaActualizada });
    } catch (error) {
        console.error("Error al actualizar la reseña:", error.message);
        res.status(500).json({ error: "Error al actualizar la reseña." });
    }
};

// // Agregar un "like" a una reseña
// export const agregarLike = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { idUsuario } = req.body;

//         const resena = await Resena.findById(id);
//         if (!resena) {
//             return res.status(404).json({ error: "Reseña no encontrada." });
//         }

//         // Verificar si el usuario ya ha dado "like"
//         if (resena.likes.includes(idUsuario)) {
//             return res.status(400).json({ error: "Ya has dado like a esta reseña." });
//         }

//         resena.likes.push(idUsuario);
//         await resena.save();

//         res.status(200).json({ message: "Like agregado con éxito", resena });
//     } catch (error) {
//         console.error("Error al agregar el like:", error.message);
//         res.status(500).json({ error: "Error al agregar el like." });
//     }
// };

// // Eliminar un "like" de una reseña
// export const eliminarLike = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { idUsuario } = req.body;

//         const resena = await Resena.findById(id);
//         if (!resena) {
//             return res.status(404).json({ error: "Reseña no encontrada." });
//         }

//         // Verificar si el usuario ha dado "like"
//         if (!resena.likes.includes(idUsuario)) {
//             return res.status(400).json({ error: "No has dado like a esta reseña." });
//         }

//         resena.likes = resena.likes.filter(likeId => likeId.toString() !== idUsuario);
//         await resena.save();

//         res.status(200).json({ message: "Like eliminado con éxito", resena });
//     } catch (error) {
//         console.error("Error al eliminar el like:", error.message);
//         res.status(500).json({ error: "Error al eliminar el like." });
//     }
// };

// Desactivar una reseña
export const desactivarResena = async (req, res) => {
    try {
        const { id } = req.params;

        const resenaActualizada = await Resena.findByIdAndUpdate(id, { estado: false }, { new: true });

        if (!resenaActualizada) {
            return res.status(404).json({ error: "Reseña no encontrada." });
        }

        res.status(200).json({ message: "Reseña desactivada con éxito", resena: resenaActualizada });
    } catch (error) {
        console.error("Error al desactivar la reseña:", error.message);
        res.status(500).json({ error: "Error al desactivar la reseña." });
    }
};

// Activar una reseña
export const activarResena = async (req, res) => {
    try {
        const { id } = req.params;

        const resenaActualizada = await Resena.findByIdAndUpdate(id, { estado: true }, { new: true });

        if (!resenaActualizada) {
            return res.status(404).json({ error: "Reseña no encontrada." });
        }

        res.status(200).json({ message: "Reseña activada con éxito", resena: resenaActualizada });
    } catch (error) {
        console.error("Error al activar la reseña:", error.message);
        res.status(500).json({ error: "Error al activar la reseña." });
    }
};

// Eliminar una reseña
export const eliminarResena = async (req, res) => {
    try {
        const { id } = req.params;

        const resenaEliminada = await Resena.findByIdAndDelete(id);

        if (!resenaEliminada) {
            return res.status(404).json({ error: "Reseña no encontrada." });
        }

        res.status(200).json({ message: "Reseña eliminada con éxito", resena: resenaEliminada });
    } catch (error) {
        console.error("Error al eliminar la reseña:", error.message);
        res.status(500).json({ error: "Error al eliminar la reseña." });
    }
};
