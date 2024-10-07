import express from 'express';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from "cloudinary";
import cors from 'cors'

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js'; 
import notificationsRoutes from './routes/notification.routes.js';
import generosLiterariosRoutes from './routes/generoLiterario.routes.js';
import librosRoutes from './routes/libros.routes.js';
import autorRoutes from './routes/autor.routes.js';
import resenaRoutes from './routes/resena.routes.js';
import comunidadRoutes from './routes/comunidad.routes.js';
import denunciaRoutes from './routes/denuncia.routes.js';
import recomendacionesRoutes from './routes/recomendaciones.routes.js';
import guardarLibrosRoutes from './routes/guardarLibros.routes.js';

import connectMongoDB from './db/connectMongoDB.js';


dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express ();
const PORT =  process.env.PORT || 8000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],

    credentials: true
}));

app.options('*', cors()); 

console.log(process.env.MONGO_URI);

app.use(express.json({limit:"5mb"}));
app.use(express.urlencoded({extended: true}))

app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/geneLiter",generosLiterariosRoutes);
app.use("/api/notifications",notificationsRoutes);
app.use("/api/libro",librosRoutes);
app.use("/api/autror",autorRoutes);
app.use("/api/resenas",resenaRoutes);
app.use("/api/comunidad",comunidadRoutes);
app.use("/api/denuncias",denunciaRoutes);
app.use("/api/recomendaciones",recomendacionesRoutes);
app.use("/api/guardarLibros",guardarLibrosRoutes);


app.listen(8000, () => {
    console.log(`Server is running on port ${PORT}`);
    connectMongoDB();
});