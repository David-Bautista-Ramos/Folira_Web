import User from "../models/user.model.js";

export const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;  // Obtener el ID del usuario desde los parámetros de la solicitud

        // Buscar el usuario por su ID
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        // Retornar el nombre del usuario
        res.status(200).json({ nombre: user.nombre });
    } catch (error) {
        console.error("Error al obtener el nombre del usuario por ID:", error.message);
        res.status(500).json({ error: "Error al obtener el nombre del usuario." });
    }
};
