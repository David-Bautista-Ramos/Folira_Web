import {
  FaRegComment,
  FaRegHeart,
  FaTrash,
} from "react-icons/fa";
import { BiError } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ModalDenuncia from "./DenunciaModal";

import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
  const [comentarios, setComentarios] = useState("");
  const [loadingComments, setLoadingComments] = useState({});
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const postOwner = post.user; // Ahora hace referencia a "usuario"
  const isLiked = post.likes.includes(authUser._id); // Cambiar según la lógica de likes
  const isMyPost = authUser._id === post.user._id; // Cambiar según la lógica de identificación del usuario
  const isMyComm = (commentUserId) => authUser._id === commentUserId;

  const formattedDate = formatPostDate(post.createdAt); // Cambiar según el tiempo real

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      // this is not the best UX, bc it will refetch all posts
      // queryClient.invalidateQueries({ queryKey: ["posts"] });

      // instead, update the cache directly for that post
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: updatedLikes };
          }
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comentarios }),
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
      setComentarios("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: DeletecommentPost, isPending: isDeleteCommenting } = useMutation({
    mutationFn: async (commentId) => {
      try {
        setLoadingComments((prev) => ({ ...prev, [commentId]: true }));
        const res = await fetch(`/api/posts/deletecomen/${post._id}/${commentId}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }finally {
        setLoadingComments((prev) => ({ ...prev, [commentId]: false }));
      }
    },
    onSuccess: () => {
      toast.success("Commentario eliminado con exito");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePostCoom = (commentId) => {
    DeletecommentPost(commentId);
  };
  const handleDeletePost = () => {
    deletePost();
  };
  const handlePostComment = (e) => {
    e.preventDefault();
    if (isCommenting) return;
    commentPost();
  };
  const handleLikePost = () => {
    if (isLiking) return;
    likePost();
  };


  return (
    <div className="flex gap-2 items-start p-4 border-b border-blue-950">
      <div className="avatar">
        <Link
          to={`/profile/${postOwner.nombre}`}
          className="w-8 rounded-full overflow-hidden"
        >
          <img
            src={postOwner.fotoPerfil || "/avatar-placeholder.png"}
            alt="Profile"
          />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center">
          <Link
            to={`/profile/${postOwner.nombre}`}
            className="font-bold"
          >
            {postOwner.nombreCompleto}
          </Link>
          <span className="text-blue-950 flex gap-1 text-sm">
            <Link to={`/profile/${postOwner._id}`}>@{postOwner.nombre}</Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className="text-blue-950 flex justify-end flex-1">
              {!isDeleting && (
                <FaTrash
                  className="cursor-pointer hover:text-red-500"
                  onClick={handleDeletePost}
                />
              )}

              {isDeleting && <LoadingSpinner size="sm" />}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-left max-w-full overflow-hidden text-ellipsis whitespace-normal break-all">
            {post.contenido}
          </span>
          {post.fotoPublicacion && (
            <img
              src={post.fotoPublicacion}
              className="h-80 object-contain rounded-lg border border-blue-950"
              alt="Post"
            />
          )}
        </div>

        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center w-2/3 justify-between">
            <div
              className="flex gap-1 items-center cursor-pointer group"
              onClick={() =>
                document.getElementById("comments_modal" + post._id).showModal()
              }
            >
              <FaRegComment className="w-4 h-4 text-slate-500 group-hover:text-blue-950" />
              <span className="text-sm text-slate-500 group-hover:text-blue-950">
                {post.comentarios ? post.comentarios.length : 0}
              </span>
            </div>

            <dialog
              id={`comments_modal${post._id}`}
              className="modal border-none outline-none"
            >
              <div className="modal-box rounded border border-blue-950">
                <h3 className="font-bold text-lg mb-4">COMENTARIOS</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                  {post.comentarios.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No hay comentarios todavía 🤔 Sé el primero 😉
                    </p>
                  )}
                  {post.comentarios.map((comentario) => (
                    <div
                      key={comentario._id}
                      className="flex gap-2 items-start"
                    >
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              comentario.user.fotoPerfil ||
                              "/avatar-placeholder.png"
                            }
                            alt="Profile"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold mr-2">
                            {comentario.user.nombreCompleto}
                          </span>{" "}
                          {/* Añadido margin-right */}
                          <span className="text-blue-950 text-sm">
                            @{comentario.user.nombre}
                          </span>
                          {/* Agregar el icono de eliminar al lado del nombre del usuario */}
                          {isMyComm(comentario.user._id) && (
                          <span className="text-blue-950 flex flex-1 ml-auto">
                            {loadingComments[comentario._id] ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              <FaTrash
                                className={`cursor-pointer hover:text-red-500 ${
                                  isDeleteCommenting ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                onClick={() => handleDeletePostCoom(comentario._id)}
                                disabled={isDeleteCommenting} // Deshabilitar si hay una eliminación en proceso
                              />
                            )}
                          </span>
                        )}
                        </div>
                        <div className="text-sm">{comentario.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <form
                  className="flex gap-2 items-center mt-4 border-t border-blue-950 pt-2"
                  onSubmit={handlePostComment}
                >
                  <textarea
                    className="textarea w-full p-1 rounded text-md resize-none border focus:outline-none border-blue-950"
                    placeholder="Add a comment..."
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                  />
                  <button className="btn btn-primary rounded-full btn-sm text-white px-4">
                    {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
                  </button>
                </form>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button className="outline-none">close</button>
              </form>
            </dialog>

            <div>
              {/* Aquí está el ícono que abrirá el modal */}
              <div className="flex gap-1 items-center group cursor-pointer">
                <BiError
                  className="w-6 h-6 text-slate-500 group-hover:text-yellow-500 "
                  onClick={() =>
                    document.getElementById(`denuncia_modal_${post._id}`).showModal()
                  } // Abre el modal al hacer clic
                />
                <span className="text-sm text-slate-500 group-hover:text-yellow-500">
                {post.denuncias}
                </span>{" "}
                {/* Muestra el número de denuncias */}
              </div>

              {/* Llama al ModalDenuncia aquí y pasa la función de denuncia */}
              <ModalDenuncia 
                id={`denuncia_modal_${post._id}`} // ID único para cada modal
                postId={post._id} 
                tipoDenuncia="publicacion" // o "comunidad", "resena", según corresponda
                denunciadoId={postOwner._id} // Pasamos el ID del dueño
              />

              {/* Mostrar las notificaciones */}
              {/* <div className='mt-4'>
                {notificaciones.map((notificacion, index) => (
                  <div key={index} className='notification'>
                    {notificacion}
                  </div>
                ))}
              </div> */}
            </div>

            <div
              className="flex gap-2 items-center group cursor-pointer"
              onClick={handleLikePost}
            >
              {isLiking && <LoadingSpinner size="sm" />}
              {!isLiked && !isLiking && (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500" />
              )}
              {isLiked && !isLiking && (
                <FaRegHeart className="w-4 h-4 cursor-pointer text-pink-500 " />
              )}

              <span
                className={`text-sm  group-hover:text-pink-500 ${
                  isLiked ? "text-pink-500" : "text-slate-500"
                }`}
              >
                {post.likes.length}
              </span>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Post;
