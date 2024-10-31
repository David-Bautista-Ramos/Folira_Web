import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationsRoutes from "./routes/notification.routes.js";
import generosLiterariosRoutes from "./routes/generoLiterario.routes.js";
import librosRoutes from "./routes/libros.routes.js";
import autorRoutes from "./routes/autor.routes.js";
import resenaRoutes from "./routes/resena.routes.js";
import comunidadRoutes from "./routes/comunidad.routes.js";
import denunciaRoutes from "./routes/denuncia.routes.js";
import recomendacionesRoutes from "./routes/recomendaciones.routes.js";
import guardarLibrosRoutes from "./routes/guardarLibros.routes.js";
import insigniasRoutes from "./routes/insigniasRoutes.js";
import eventosRoutes from "./routes/eventosRoutes.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware de CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.options("*", cors());

// Configuración del cuerpo de la solicitud
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

// Middleware para las cookies
app.use(cookieParser());

// Rutas de la API
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/geneLiter", generosLiterariosRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/libro", librosRoutes);
app.use("/api/autror", autorRoutes);
app.use("/api/resenas", resenaRoutes);
app.use("/api/comunidad", comunidadRoutes);
app.use("/api/denuncias", denunciaRoutes);
app.use("/api/recomendaciones", recomendacionesRoutes);
app.use("/api/guardarLibros", guardarLibrosRoutes);
app.use("/api/insignias", insigniasRoutes);
app.use("/api/eventos", eventosRoutes);

// Conectar a MongoDB y luego iniciar el servidor
const startServer = async () => {
  try {
    await connectMongoDB(); // Esperar a que la conexión se realice
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error al conectar a la base de datos: ${error.message}`);
    process.exit(1); // Salir si hay un error en la conexión
  }
};

startServer(); // Llamar a la función para iniciar el servidor
