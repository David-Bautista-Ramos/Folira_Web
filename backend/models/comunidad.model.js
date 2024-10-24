import mongoose from 'mongoose'

const ComunidadSchema = new mongoose.Schema(
    {
      nombre: {
        type: String,
        required: true,
      },
      descripcion: {
        type: String,
        required: true,
      },
      link: {
        type: String,
      },
      fotoComunidad: String,
      fotoComunidadURL: String,
      fotoBanner: String,
      fotoBannerURL: String,
      fechaCreacion: {
        type: Date,
        default: Date.now,
      },
      estado: {
        type: Boolean,
        default: true,
      },
      generoLiterarios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GeneroLiterario'
      }],
      miembros: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
    },
    { timestamps: true }
  );

const Comunidad = mongoose.model("Comunidad", ComunidadSchema);

export default Comunidad;