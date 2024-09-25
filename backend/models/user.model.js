import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema(
    {
      nombre: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      nombreCompleto: {
        type: String,
        required: true,
        min: 2,
        max: 58,
      },
      correo: {
        type: String,
        required: true,
        unique: true,
      },
      contrasena: {
        type: String,
        required: true,
        min: 6,
      },
      fotoPerfil: {
        type: String,
        default: "",
      },
      fotoPerfilBan: {
        type: String,
        default: "",
      },
      pais: {
        type: String,
        required: true,
      },
      biografia: {
        type: String,
        max: 255,
      },
      generoLiterarioPreferido: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GeneroLiterario'
      }],
      seguidores: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
      }],
      seguidos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
      }],
      estado: {
        type: Boolean,
        default: true,
      },
      likedPosts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
          default: [],
        },
      ],
      roles: {
        type: String,
        enum: ['usuario', 'admin'],
        required: true,
      }
    },
    { timestamps: true }
  );

const User = mongoose.model("User", UserSchema);

export default User;