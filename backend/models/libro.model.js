import mongoose from "mongoose";

const LibroSchema = new mongoose.Schema(
    {
      titulo: {
        type: String,
        required: true,
        max: 100,
      },
      ISBN: {
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
      portadaURL: String,
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