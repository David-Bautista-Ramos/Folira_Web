import mongoose from "mongoose";


const DenunciaSchema = new mongoose.Schema(
    {
      motivo: {
        type: String,
        required: true,
      },
      solucion: {
        type: String,
        required: true,
      },
      fechaCreacion: {
        type: Date,
        default: Date.now,
      },
      estado: {
        type: Boolean,
        default: true,
      },
      idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      idPublicacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publicacion',
      },
      idComunidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comunidad',
      },
      idResena: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resena',
      },
    },
    { timestamps: true }
  );

const  Denuncia = mongoose.model('Denuncia', DenunciaSchema);

export default Denuncia;
