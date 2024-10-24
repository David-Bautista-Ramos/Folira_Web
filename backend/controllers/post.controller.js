import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comunidad from "../models/comunidad.model.js";
// import user from '../models/user.model.js'
import mongoose from "mongoose";

import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
  try {
    const { contenido, comunidadId } = req.body;
    let { fotoPublicacion } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Verificar si el contenido o la imagen está presente
    if (!contenido && !fotoPublicacion) {
      return res
        .status(400)
        .json({ error: "La publicación debe tener texto o imagen" });
    }

    // Manejar la subida de la imagen si existe
    if (fotoPublicacion) {
      const uploadedResponse = await cloudinary.uploader.upload(
        fotoPublicacion
      );
      fotoPublicacion = uploadedResponse.secure_url;
    }

    // Si es una publicación para una comunidad
    let comunidad = null;
    if (comunidadId) {
      comunidad = await Comunidad.findById(comunidadId);
      if (!comunidad) {
        return res.status(404).json({ message: "Comunidad no encontrada" });
      }
    }

    // Crear la nueva publicación
    const newPost = new Post({
      user: userId,
      contenido,
      fotoPublicacion,
      idComunidad: comunidadId || null, // Si no hay comunidadId, es una publicación personal
    });

    // Guardar la publicación en la base de datos
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
    console.log("Error en el controlador createPost: ", error);
  }
};

export const createPostad = async (req, res) => {
  try {
    const { contenido, comunidadId, userId } = req.body; // Extraer userId correctamente
    let { fotoPublicacion } = req.body;

    // Verificar si el usuario existe
    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Verificar si el contenido o la imagen está presente
    if (!contenido && !fotoPublicacion) {
      return res
        .status(400)
        .json({ error: "La publicación debe tener texto o imagen" });
    }

    // Manejar la subida de la imagen si existe
    if (fotoPublicacion) {
      const uploadedResponse = await cloudinary.uploader.upload(
        fotoPublicacion
      );
      fotoPublicacion = uploadedResponse.secure_url;
    }

    // Si es una publicación para una comunidad
    let comunidad = null;
    if (comunidadId) {
      comunidad = await Comunidad.findById(comunidadId);
      if (!comunidad) {
        return res.status(404).json({ message: "Comunidad no encontrada" });
      }
    }

    // Crear la nueva publicación
    const newPost = new Post({
      user: userId,
      contenido,
      fotoPublicacion,
      idComunidad: comunidadId || null, // Si no hay comunidadId, es una publicación personal
    });

    // Guardar la publicación en la base de datos
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error en el controlador createPost: ", error); // Mejora en el log
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Verificar si es una publicación de comunidad
    const isCommunityPost = !!post.idComunidad;

    if (isCommunityPost) {
      // Es una publicación en comunidad
      const comunidad = await Comunidad.findById(post.idComunidad);
      if (!comunidad) {
        return res.status(404).json({ error: "Comunidad no encontrada" });
      }

      // Verificar si el usuario es admin o moderador de la comunidad
      const isAdminOrModerator =
      comunidad.admin.equals(req.user._id) || // Comparar si es el admin
      comunidad.moderadores.includes(req.user._id); // Verificar si es moderador
      if (!isAdminOrModerator) {
        return res.status(401).json({
          error:
            "No tienes permisos para eliminar esta publicación de la comunidad",
        });
      }
    } else {
      // Es una publicación personal, verificar si el usuario es el autor
      if (post.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({
          error: "No estás autorizado para eliminar esta publicación",
        });
      }
    }

    // Si la publicación tiene una imagen asociada, eliminarla de Cloudinary
    if (post.fotoPublicacion) {
      const fotoPublicacionId = post.fotoPublicacion
        .split("/")
        .pop()
        .split(".")[0];
      await cloudinary.uploader.destroy(fotoPublicacionId);
    }

    // Eliminar la publicación de la base de datos
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Publicación eliminada con éxito" });
  } catch (error) {
    console.log("Error en el controlador deletePost: ", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deletePostAdm = async (req, res) => {
  const post = req.params.id; // Obtiene el ID de la publicación desde los parámetros de la URL.
  try {
    // Elimina la publicación con el ID especificado.
    await Post.findByIdAndDelete(post);

    // Responde con un mensaje de éxito si la eliminación fue exitosa.
    res.status(200).json({ message: "Publicación eliminada con éxito" });
  } catch (error) {
    // Muestra el error en la consola si ocurre uno durante la eliminación.
    console.log("Error en el controlador deletePost: ", error);

    // Envía un mensaje de error al cliente.
    res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const commentOnPostAd = async (req, res) => {
  try {
    const { text, userId } = req.body;
    const postId = req.params.id;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };

    post.comentarios.push(comment);
    await post.save();

    const notification = new Notification({
      de: userId,
      para: post.user,
      tipo: "comentario",
    });
    await notification.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };

    post.comentarios.push(comment);
    await post.save();

    const notification = new Notification({
      de: userId,
      para: post.user,
      tipo: "comentario",
    });
    await notification.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const userLikedPost = post.likes.includes(userId);

    if (userLikedPost) {
      // Unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res.status(200).json(updatedLikes);
    } else {
      // Like post
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        de: userId,
        para: post.user,
        tipo: "like",
      });
      await notification.save();

      const updatedLikes = post.likes;
      res.status(200).json(updatedLikes);
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-contrasena",
      })
      .populate({
        path: "comentarios.user",
        select: "-contrasena",
      })
      .populate({
        path: "idComunidad", // Aquí se hace populate para idComunidad
      });

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const numDenuncias = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    post.denuncias += 1; // Incrementa el contador de denuncias
    await post.save(); // Guarda el post actualizado

    res.json({ success: true, denuncias: post.denuncias });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Obtener publicaciones de una comunidad específica con estado activo
export const getPostsByCommunity = async (req, res) => {
  const { comunidadId } = req.params;

  try {
    const posts = await Post.find({
      idComunidad: comunidadId,
      estado: true,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-contrasena",
      })
      .populate({
        path: "comentarios.user",
        select: "-contrasena",
      });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getPostsByCommunity controller:", error);
    res.status(500).json({ error: "Internal server error  " });
  }
};

// Obtener publicaciones sin comunidad y con estado activo
export const getPostsWithoutCommunity = async (req, res) => {
  try {
    const posts = await Post.find({
      $or: [
        { idComunidad: null }, // idComunidad es null
        { idComunidad: { $exists: false } }, // idComunidad no existe
      ],
      estado: true,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-contrasena",
      })
      .populate({
        path: "comentarios.user",
        select: "-contrasena",
      });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getPostsWithoutCommunity controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLikedPosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "user",
        select: "-contrasena",
      })
      .populate({
        path: "comentarios.user",
        select: "-contrasena",
      });

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const following = user.seguidores;

    const feedPosts = await Post.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-contrasena",
      })
      .populate({
        path: "comentarios.user",
        select: "-contrasena",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { nombre } = req.params;

    const user = await User.findOne({ nombre });
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-contrasena",
      })
      .populate({
        path: "comentarios.user",
        select: "-contrasena",
      });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

{
  /*ADMIN*/
}

// Crear una nueva publicación se usa la de arriba

// Obtener una publicación por ID
export const obtenerPublicacionPorId = async (req, res) => {
  try {
    const { postId } = req.params;

    // Verifica que el ID tenga el formato adecuado de ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "ID de publicación no válido" });
    }

    // Busca la publicación por su ID
    const publicacion = await Post.findById(postId)
      .populate("user", "nombre nombreCompleto") // Poblamos los datos del usuario que creó la publicación
      .populate("comentarios.user", "nombre nombreCompleto")
      .populate("idComunidad");

    // Si la publicación no se encuentra, devuelve un 404
    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Verificar si la publicación es de una comunidad
    const isCommunityPost = !!publicacion.idComunidad;
    if (isCommunityPost) {
      // Es una publicación de comunidad, obtener la comunidad
      const comunidad = await Comunidad.findById(publicacion.idComunidad);
      if (!comunidad) {
        return res.status(404).json({ error: "Comunidad no encontrada" });
      }
    }

    return res.status(200).json(publicacion);
  } catch (error) {
    console.error("Error al obtener la publicación:", error.message);
    return res.status(500).json({ error: "Error en el servidor." });
  }
};

export const actualizarPublicacion = async (req, res) => {
  try {
    const { postId } = req.params;
    const { contenido, fotoPublicacion, comunidadId, userId } = req.body;

    // Buscar la publicación
    const publicacion = await Post.findById(postId);

    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Verificar si el usuario es admin del sistema
    const isAdmin = req.user.roles === "admin"; // Asumiendo que el rol del usuario está en req.user.role

    // Si no es admin, proceder con las verificaciones adicionales
    if (!isAdmin) {
      // Verificar si es una publicación de comunidad
      const isCommunityPost = !!publicacion.comunidadId;

      if (isCommunityPost) {
        // Verificar permisos para comunidad (admin o moderador)
        const comunidad = await Comunidad.findById(publicacion.idComunidad);
        if (!comunidad) {
          return res.status(404).json({ error: "Comunidad no encontrada" });
        }

        const isAdminOrModerator =
          comunidad.admin.toString() === req.user._id.toString() ||
          comunidad.moderadores?.includes(req.user._id);

        if (!isAdminOrModerator) {
          return res.status(401).json({
            error: "No tienes permisos para actualizar esta publicación",
          });
        }
      } else {
        // Verificar si es el autor para publicaciones personales
        if (publicacion.user.toString() !== req.user._id.toString()) {
          return res.status(401).json({
            error: "No tienes permisos para actualizar esta publicación",
          });
        }
      }
    }

    // Si hay una nueva imagen, manejar la subida a Cloudinary
    let nuevaFotoPublicacion = publicacion.fotoPublicacion;
    if (fotoPublicacion) {
      const uploadedResponse = await cloudinary.uploader.upload(
        fotoPublicacion
      );
      nuevaFotoPublicacion = uploadedResponse.secure_url;
    }

    // Actualizar la publicación con la nueva información
    publicacion.contenido = contenido || publicacion.contenido;
    publicacion.fotoPublicacion = nuevaFotoPublicacion;
    publicacion.idComunidad = comunidadId || publicacion.idComunidad;

    if (userId && isAdmin) {
      publicacion.user = userId;
    }

    await publicacion.save();

    return res.status(200).json({
      message: "Publicación actualizada con éxito",
      publicacion,
    });
  } catch (error) {
    console.error("Error al actualizar la publicación:", error.message);
    return res.status(500).json({ error: "Error en el servidor." });
  }
};

export const cambiarEstadoPublicacionact = async (req, res) => {
  try {
    const { postId } = req.params;
    const nuevoEstado = true; // Estado para activar

    const publicacion = await Post.findById(postId);
    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    const isAdmin = req.user.roles === "admin"; // Verificar si es administrador del sistema

    if (!isAdmin) {
      // Verificar permisos para comunidad o publicación personal si no es admin
      if (publicacion.idComunidad) {
        const comunidad = await Comunidad.findById(publicacion.idComunidad);
        if (
          !comunidad ||
          (!comunidad.admin.includes(req.user._id) &&
            !comunidad.moderadores.includes(req.user._id))
        ) {
          return res.status(401).json({
            error: "No tienes permisos para activar esta publicación",
          });
        }
      } else {
        if (publicacion.user.toString() !== req.user._id.toString()) {
          return res.status(401).json({
            error: "No tienes permisos para activar esta publicación",
          });
        }
      }
    }

    // Cambiar el estado de la publicación a activada
    publicacion.estado = nuevoEstado;
    await publicacion.save();

    return res.status(200).json({
      message: "Publicación activada con éxito",
      publicacion,
    });
  } catch (error) {
    console.error("Error al activar la publicación:", error.message);
    return res.status(500).json({ error: "Error en el servidor." });
  }
};

export const cambiarEstadoPublicaciondes = async (req, res) => {
  try {
    const { postId } = req.params;
    const nuevoEstado = false; // Estado para desactivar

    const publicacion = await Post.findById(postId);
    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    const isAdmin = req.user.roles === "admin"; // Verificar si es administrador del sistema

    if (!isAdmin) {
      // Verificar permisos para comunidad o publicación personal si no es admin
      if (publicacion.idComunidad) {
        const comunidad = await Comunidad.findById(publicacion.idComunidad);
        if (
          !comunidad ||
          (!comunidad.admin.includes(req.user._id) &&
            !comunidad.moderadores.includes(req.user._id))
        ) {
          return res.status(401).json({
            error: "No tienes permisos para desactivar esta publicación",
          });
        }
      } else {
        if (publicacion.user.toString() !== req.user._id.toString()) {
          return res.status(401).json({
            error: "No tienes permisos para desactivar esta publicación",
          });
        }
      }
    }

    // Cambiar el estado de la publicación a desactivada
    publicacion.estado = nuevoEstado;
    await publicacion.save();

    return res.status(200).json({
      message: "Publicación desactivada con éxito",
      publicacion,
    });
  } catch (error) {
    console.error("Error al desactivar la publicación:", error.message);
    return res.status(500).json({ error: "Error en el servidor." });
  }
};

export const obtenerPublicacionesAct = async (req, res) => {
  try {
    const estado = true;

    // Filtrar solo las publicaciones activas
    const publicaciones = await Post.find({ estado: estado })
      .populate("user", "nombre nombreCompleto fotoPerfil") // Poblar datos del usuario que hizo la publicación
      .populate("idComunidad", "nombre descripcion") // Poblar la comunidad si es que la publicación pertenece a una
      .populate("comentarios.user", "nombre nombreCompleto") // Poblar los datos de los usuarios que comentaron
      .exec();

    res.status(200).json({ publicaciones });
  } catch (error) {
    console.error("Error al obtener las publicaciones activas:", error.message);
    res
      .status(500)
      .json({ error: "Error al obtener las publicaciones activas." });
  }
};

export const obtenerPublicacionesDes = async (req, res) => {
  try {
    const estado = false;

    // Filtrar solo las publicaciones inactivas
    const publicaciones = await Post.find({ estado: estado })
      .populate("user", "nombre nombreCompleto fotoPerfil") // Poblar datos del usuario que hizo la publicación
      .populate("idComunidad", "nombre descripcion") // Poblar la comunidad si es que la publicación pertenece a una
      .populate("comentarios.user", "nombre nombreCompleto") // Poblar los datos de los usuarios que comentaron
      .exec();

    res.status(200).json({ publicaciones });
  } catch (error) {
    console.error("Error al obtener las publicaciones activas:", error.message);
    res
      .status(500)
      .json({ error: "Error al obtener las publicaciones activas." });
  }
};

{
  /* ADMIN Comentarios */
}
export const obtenerComentarioPorId = async (req, res) => {
  try {
    const { comentarioId, postId } = req.params; // IDs de la publicación y el comentario

    // Buscar la publicación, populando la comunidad y usuarios involucrados
    const publicacion = await Post.findById(postId)
      .populate("idComunidad", "nombre descripcion") // Popula solo campos necesarios de la comunidad
      .populate("user", "nombre nombreCompleto fotoPerfil") // Popula los datos del autor de la publicación
      .populate("comentarios.user", "nombre fotoPerfil"); // Popula los datos del autor del comentario

    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Buscar el comentario dentro de los comentarios de la publicación
    const comentario = publicacion.comentarios.id(comentarioId);
    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    return res.status(200).json({
      message: "Comentario encontrado",
      comentario,
    });
  } catch (error) {
    console.error("Error al obtener el comentario:", error.message);
    return res.status(500).json({ error: "Error en el servidor." });
  }
};

// Editar un comentario de una publicación
// Editar un comentario de una publicación
export const editarComentario = async (req, res) => {
  try {
    const { comentarioId, postId } = req.params; // ID de la publicación y del comentario
    const { nuevoTexto } = req.body; // Nuevo texto para el comentario

    const publicacion = await Post.findById(postId).populate("idComunidad"); // Populando la comunidad si es una publicación de comunidad
    if (!publicacion) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }

    // Buscar el comentario por su ID
    const comentario = publicacion.comentarios.id(comentarioId);
    if (!comentario) {
      return res.status(404).json({ error: "Comentario no encontrado" });
    }

    // Verificar permisos: si es administrador del sistema o autor del comentario
    const isAdmin = req.user.roles === "admin"; // Verificar si el usuario es administrador
    const isAuthor = comentario.user.toString() === req.user._id.toString(); // Verificar si es el autor

    // Si es administrador del sistema, puede editar cualquier comentario
    if (isAdmin) {
      // Actualizar el texto del comentario
      comentario.text = nuevoTexto;
      await publicacion.save();

      return res.status(200).json({
        message: "Comentario actualizado con éxito por el administrador",
        comentarioActualizado: comentario,
      });
    }

    // Si no es administrador, verificar otros permisos
    if (publicacion.idComunidad) {
      // Es una publicación de comunidad, verificar si es admin o moderador de la comunidad
      const comunidad = publicacion.idComunidad; // Ya está poblada
      const isAdminOrModerator =
        comunidad.admins.includes(req.user._id) ||
        comunidad.moderadores.includes(req.user._id);

      if (!isAdminOrModerator && !isAuthor) {
        return res.status(401).json({
          error:
            "No tienes permisos para editar este comentario en la comunidad",
        });
      }
    } else {
      // Es una publicación personal, verificar si es el autor del comentario
      if (!isAuthor) {
        return res
          .status(401)
          .json({ error: "No tienes permisos para editar este comentario" });
      }
    }

    // Actualizar el texto del comentario si los permisos son correctos
    comentario.text = nuevoTexto;
    await publicacion.save();

    return res.status(200).json({
      message: "Comentario actualizado con éxito",
      comentarioActualizado: comentario,
    });
  } catch (error) {
    console.error("Error al editar el comentario:", error.message);
    return res.status(500).json({ error: "Error en el servidor." });
  }
};

// Eliminar un comentario de una publicación
export const eliminarComentario = async (req, res) => {
    try {
      const { postId, comentarioId } = req.params;
  
      // Buscar la publicación y poblar la comunidad
      const publicacion = await Post.findById(postId).populate("idComunidad");
      if (!publicacion) {
        return res.status(404).json({ error: "Publicación no encontrada" });
      }
  
      // Verificar si es una publicación de comunidad
      const isCommunityPost = !!publicacion.idComunidad;
  
      // Verificar permisos: Administrador del sistema o autor del comentario
      const comentario = publicacion.comentarios.find(
        (c) => c._id.toString() === comentarioId
      );
      if (!comentario) {
        return res.status(404).json({ error: "Comentario no encontrado" });
      }
  
      const isAdmin = req.user.roles === "admin";
      const isAuthor = comentario.user.toString() === req.user._id.toString();
  
      if (isCommunityPost) {
        const comunidad = publicacion.idComunidad;
        const isAdminOrModerator =
          comunidad.admin.equals(req.user._id) ||
          (comunidad.moderadores && comunidad.moderadores.includes(req.user._id));
        if (!isAdminOrModerator && !isAdmin) {
          return res
            .status(403)
            .json({ error: "No tienes permisos para eliminar este comentario en la comunidad" });
        }
      } else {
        if (!isAuthor && !isAdmin) {
          return res
            .status(403)
            .json({ error: "No tienes permisos para eliminar este comentario" });
        }
      }
  
      // Eliminar el comentario usando filter()
      publicacion.comentarios = publicacion.comentarios.filter(
        (c) => c._id.toString() !== comentarioId
      );
      await publicacion.save();
  
      return res
        .status(200)
        .json({ message: "Comentario eliminado con éxito", publicacion });
    } catch (error) {
      console.error("Error al eliminar el comentario:", error.message);
      return res.status(500).json({ error: "Error en el servidor." });
    }
  };
  