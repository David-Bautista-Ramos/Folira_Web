import mongoose from "mongoose";

const AutorSchema = new mongoose.Schema(
    {
      nombre: {
        type: String,
        required: true,
        max: 100,
      },
      seudonimo: {
        type: String,
        required: true,
        max: 100,
      },
      fechaNacimiento: {
        type: Date,
        required: true,
      },
      pais: {
        type: String,
        required: true,
      },
      biografia: {
        type: String,
        required: true,
      },
      fotoAutor: String,
      fotoAutorURL: String,
      distinciones: [{
        type: String,
      }],
      estado: {
        type: Boolean,
        default: true,
      }
    },
    { timestamps: true }
  );

const  Autor = mongoose.model('Autor', AutorSchema);

export default Autor;

