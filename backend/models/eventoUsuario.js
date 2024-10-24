import mongoose from "mongoose";

const eventoUsuarioSchema  = new mongoose.Schema(
    {
        usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        tipo: { 
            type: String, 
            enum: ['publicacion', 'reseña', 'tiempoPantalla', 'like', 'librosGuardados'], 
            required: true 
          },
        fecha: { type: Date, default: Date.now },

        // Campos adicionales para eventos específicos
        publicacionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Publicacion' },
        libroId: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro' },
        autorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Autor' },
        tipoLike: { type: String, enum: ['publicacion', 'comentario', 'libro', 'autor'] },
        elementoId: { type: mongoose.Schema.Types.ObjectId }, // ID del objeto al que se le da like
    }
);

const EventosUsuario = mongoose.model('EventosUsuario', eventoUsuarioSchema );

export default EventosUsuario;
