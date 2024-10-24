import mongoose from "mongoose";

const UsuarioInsigniasSchema = new mongoose.Schema(
    {
        usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        insigniaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Insignias', required: true },
        fechaAsignacion: { type: Date, default: Date.now },
    }
);

const UsuarioInsignias = mongoose.model('UsuarioInsignias', UsuarioInsigniasSchema);

export default UsuarioInsignias;
