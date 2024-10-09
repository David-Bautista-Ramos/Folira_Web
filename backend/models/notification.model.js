import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    de: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    para: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tipo: {
      type: String,
      required: true,
      enum:['seguidor','like','insignia','denuncia','comentario']
    },
    leido: {
      type: Boolean,
      default:false,
    }
  },
  { timestamps: true }
);
const Notification = mongoose.model('Notification',notificationSchema);

export default Notification;