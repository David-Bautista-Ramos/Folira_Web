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
        default: null 
      },
      idAutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Autor',
        default: null 
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