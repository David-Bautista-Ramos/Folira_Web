import mongoose from "mongoose";


const ResenaSchema = new mongoose.Schema(
    {
      contenido: {
        type: String,
        required: true,
      },
      calificacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      fechaResena: {
        type: Date,
        default: Date.now,
      },
      idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      idLibro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Libro',
        required: true,
      },
      idAutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Autor',
      },
      estado: {
        type: Boolean,
        default: true,
      }
    },
    { timestamps: true }
  );

const Resena = mongoose.model("Resenas", ResenaSchema);

export default Resena;