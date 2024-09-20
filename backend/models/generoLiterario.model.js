import mongoose from "mongoose";

const GeneroLiterarioSchema = new mongoose.Schema(
    {
      nombre: {
        type: String,
        required: true,
        unique: true,
      },
      descripcion: {
        type: String,
        required: true,
      },
      estado: {
        type: Boolean,
        default: true,
      }
    },
    { timestamps: true }
  );

const GeneroLiterario = mongoose.model('GeneroLiterario',GeneroLiterarioSchema);

export default GeneroLiterario;