import mongoose from "mongoose";
import { string } from "yup";

const LibroSchema = new mongoose.Schema(
    {
      titulo: {
        type: String,
        required: true,
        max: 100,
      },
      isbn: {
        type: String,
        required: true,
        unique: true,
      },
      fechaPublicacion: {
        type: Date,
        required: true,
      },
      editorial: {
        type: String,
        required: true,
      },
      sinopsis: {
        type: String,
        required: true,
      },
      portada: String,
      calificacion: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
      },
      estado: {
        type: Boolean,
        default: true,
      },
      serie: {
        type: String,
      },
      generos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GeneroLiterario'
      }],
      autores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Autor'
      }],
    },
    { timestamps: true }
  );

const Libro = mongoose.model("Libro", LibroSchema);

export default Libro;