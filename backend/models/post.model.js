import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      contenido: {
        type: String,
        required: true,
      },
      fotoPublicacion: String,
      estado: {
        type: Boolean,
        default: true,
      },
      idComunidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comunidad',
      },
      likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }],
      denuncias: {
        type: Number,
        default: 0, // Inicialmente 0
      },
      comentarios: [{
        text:{
            type: String,
            required: true
        },
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          }
      }],
    },
    { timestamps: true }
  );

const Post = mongoose.model("Post", PostSchema);

export default Post;