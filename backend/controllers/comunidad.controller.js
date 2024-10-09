import Comunidad from "../models/comunidad.model.js";

// Crear una nueva comunidad
export const crearComunidad = async (req, res) => {
    try {
        const { nombre, descripcion, fotoComunidad, fotoBanner, generoLiterarios, admin } = req.body;

        // Verificar si ya existe una comunidad con el mismo nombre
        const comunidadExistente = await Comunidad.findOne({ nombre });
        if (comunidadExistente) {
            return res.status(400).json({ error: 'La comunidad ya existe.' });
        }

        const nuevaComunidad = new Comunidad({
            nombre,
            descripcion,
            fotoComunidad,
            fotoBanner,
            generoLiterarios,
            admin
        });

        // Guardar la comunidad en la base de datos
        await nuevaComunidad.save();
        res.status(201).json({ message: "Comunidad creada con éxito", comunidad: nuevaComunidad });
    } catch (error) {
        console.error("Error al crear la comunidad:", error.message);
        res.status(500).json({ error: "Error al crear la comunidad." });
    }
};

export const obtenerComunidades = async(req, res) => {
    try {
        const comunidades = await Comunidad.find().populate({path: "miembros",select: "-contrasena",}).populate({path: "admin",select: "-contrasena",});
        res.status(200).json(comunidades);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
};

// Obtener comunidades activas o inactivas según el estado
export const obtenerComunidadesAct = async (req, res) => {
    try {
        const estado = true;
        const comunidades = await Comunidad.find({estado:estado}).populate({path: "miembros",select: "-contrasena",}).populate({path: "admin",select: "-contrasena",});
        res.status(200).json({ comunidades });
    } catch (error) {
        console.error("Error al obtener las comunidades:", error.message);
        res.status(500).json({ error: "Error al obtener las comunidades." });
    }
};
export const obtenerComunidadesDes = async (req, res) => {
    try {
        const estado = false;

        const comunidades = await Comunidad.find({estado:estado}).populate({path: "miembros",select: "-contrasena",}).populate({path: "admin",select: "-contrasena",});
        res.status(200).json({ comunidades });
    } catch (error) {
        console.error("Error al obtener las comunidades:", error.message);
        res.status(500).json({ error: "Error al obtener las comunidades." });
    }
};

// Obtener una comunidad por su ID
export const obtenerComunidadPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const comunidad = await Comunidad.findById(id).populate('admin').populate('miembros');
        if (!comunidad) {
            return res.status(404).json({ error: "Comunidad no encontrada." });
        }

        res.status(200).json({ comunidad });
    } catch (error) {
        console.error("Error al obtener la comunidad:", error.message);
        res.status(500).json({ error: "Error al obtener la comunidad." });
    }
};

// Controlador para que un usuario se una a una comunidad
export const unirseComunidad = async (req, res) => {
    try {
        const { comunidadId } = req.params;  // ID de la comunidad a la que quiere unirse
        const userId = req.user._id;         // ID del usuario que está solicitando unirse

        // Buscar la comunidad
        const comunidad = await Comunidad.findById(comunidadId);
        if (!comunidad) {
            return res.status(404).json({ error: "Comunidad no encontrada" });
        }

        // Verificar si el usuario ya es miembro de la comunidad
        const esMiembro = comunidad.miembros.includes(userId);
        if (esMiembro) {
            return res.status(400).json({ error: "Ya eres miembro de esta comunidad" });
        }

        // Agregar el usuario a la lista de miembros
        comunidad.miembros.push(userId);
        await comunidad.save();

        return res.status(200).json({ message: "Te has unido a la comunidad con éxito", comunidad });
    } catch (error) {
        console.error("Error al unirse a la comunidad:", error.message);
        return res.status(500).json({ error: "Error en el servidor" });
    }
};


// Editar una comunidad
export const editarComunidad = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, fotoComunidad, fotoBanner, generoLiterarios, estado } = req.body;

        const comunidadActualizada = await Comunidad.findByIdAndUpdate(id, { nombre, descripcion, fotoComunidad, fotoBanner,generoLiterarios, estado }, { new: true, runValidators: true });

        if (!comunidadActualizada) {
            return res.status(404).json({ error: "Comunidad no encontrada." });
        }

        res.status(200).json({ message: "Comunidad actualizada con éxito", comunidad: comunidadActualizada });
    } catch (error) {
        console.error("Error al actualizar la comunidad:", error.message);
        res.status(500).json({ error: "Error al actualizar la comunidad." });
    }
};

// Desactivar una comunidad
export const desactivarComunidad = async (req, res) => {
    try {
        const { id } = req.params;

        const comunidadActualizada = await Comunidad.findByIdAndUpdate(id, { estado: false }, { new: true });

        if (!comunidadActualizada) {
            return res.status(404).json({ error: "Comunidad no encontrada." });
        }

        res.status(200).json({ message: "Comunidad desactivada con éxito", comunidad: comunidadActualizada });
    } catch (error) {
        console.error("Error al desactivar la comunidad:", error.message);
        res.status(500).json({ error: "Error al desactivar la comunidad." });
    }
};

// Activar una comunidad
export const activarComunidad = async (req, res) => {
    try {
        const { id } = req.params;

        const comunidadActualizada = await Comunidad.findByIdAndUpdate(id, { estado: true }, { new: true });

        if (!comunidadActualizada) {
            return res.status(404).json({ error: "Comunidad no encontrada." });
        }

        res.status(200).json({ message: "Comunidad activada con éxito", comunidad: comunidadActualizada });
    } catch (error) {
        console.error("Error al activar la comunidad:", error.message);
        res.status(500).json({ error: "Error al activar la comunidad." });
    }
};

// Eliminar una comunidad
export const eliminarComunidad = async (req, res) => {
    try {
        const { id } = req.params;

        const comunidadEliminada = await Comunidad.findByIdAndDelete(id);

        if (!comunidadEliminada) {
            return res.status(404).json({ error: "Comunidad no encontrada." });
        }

        res.status(200).json({ message: "Comunidad eliminada con éxito", comunidad: comunidadEliminada });
    } catch (error) {
        console.error("Error al eliminar la comunidad:", error.message);
        res.status(500).json({ error: "Error al eliminar la comunidad." });
    }
};
