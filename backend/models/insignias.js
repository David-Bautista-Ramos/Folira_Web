import mongoose from "mongoose";

const InsigniasSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true },
        descripcion: { type: String },
        criterio: { 
            type: String, 
            enum: ['publicacion', 'reseña', 'tiempoPantalla', 'like', 'librosGuardados'], 
            required: true 
        },
        cantidadObjetivo: { type: Number, required: true },
        icono: { type: String }, // URL del icono de la insignia
        fechaCreacion: { type: Date, default: Date.now },
    }
);

const Insignias = mongoose.model('Insignias', InsigniasSchema);

export default Insignias;
