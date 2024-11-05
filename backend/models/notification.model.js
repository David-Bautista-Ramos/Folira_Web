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
    mensaje:{
      type:String
    },
    tipo: {
      type: String,
      required: true,
      enum:['seguidor','like','comunidad','denuncia','comentario']
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