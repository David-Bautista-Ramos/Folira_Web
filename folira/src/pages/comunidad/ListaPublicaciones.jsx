import { FaRegComment, FaRegHeart, FaTrash } from "react-icons/fa";
import { BiError } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ModalDenuncia from "../../components/common/DenunciaModal";
import { formatPostDate } from "../../utils/date";

const ListaPublicaciones = ({ posts, esAdmin, esMiembro }) => {
  const queryClient = useQueryClient();
  const [comentario, setComentario] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [openCommentModal, setOpenCommentModal] = useState(null);
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const isMyComment = (commentUserId) => authUser?._id === commentUserId;
  
  // Mutación para eliminar publicaciones
  const handleDeletePost = useMutation({
    mutationFn: async (postId) => {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar la publicación");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Publicación eliminada.");
      queryClient.invalidateQueries(["posts"]); // Invalidar las consultas de publicaciones para refrescar la lista
    },
    onError: () => {
      toast.error("No se pudo eliminar la publicación.");
    },
  });

  const handleLikePost = useMutation({
    mutationFn: async (postId) => {
      const res = await fetch(`/api/posts/like/${postId}`, { method: "POST" });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(["posts"]),
  });

  const handleCommentPost = useMutation({
    mutationFn: async (postId) => {
      const res = await fetch(`/api/posts/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: comentario, image: previewImage }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Comentario publicado.");
      setComentario("");
      setPreviewImage(null);
      setOpenCommentModal(null);
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleDeleteComment = useMutation({
    mutationFn: async ({ postId, commentId }) => {
      await fetch(`/api/posts/${postId}/comments/${commentId}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast.success("Comentario eliminado.");
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleReportPost = (postId) => {
    document.getElementById(`denuncia_modal_${postId}`).showModal();
  };

  const canInteract = () => {
    return authUser && (esAdmin || esMiembro);
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold">Publicaciones:</h3>
      {posts.length ? (
        posts.map((post) => (
          <div key={post._id} className="border-b py-4">
            <div className="flex items-start gap-4">
              <Link to={`/profile/${post.user._id}`} className="w-10 h-10 rounded-full overflow-hidden">
                <img src={post.user.fotoPerfil || "/avatar-placeholder.png"} alt="Perfil" />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${post.user._id}`} className="font-bold">
                    {post.user.nombreCompleto}
                  </Link>
                  <span className="text-sm text-gray-500">@{post.user.nombre}</span>
                  <span className="text-sm text-gray-400">· {formatPostDate(post.createdAt)}</span>
                  {authUser && authUser._id === post.user._id && ( // Mostrar el botón de eliminar solo si es el autor
                    <FaTrash
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDeletePost.mutate(post._id)}
                    />
                  )}
                </div>
                <p className="mt-2">{post.contenido}</p>
                {post.fotoPublicacion && (
                  <img src={post.fotoPublicacion} alt="Publicación" className="w-full h-48 object-cover mt-2" />
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center gap-4">
                {canInteract() ? (
                  <>
                    <button onClick={() => handleLikePost.mutate(post._id)} className="flex items-center gap-1">
                      <FaRegHeart className="text-red-500" />
                      <span>{post.likes.length}</span>
                    </button>

                    <button onClick={() => setOpenCommentModal(post._id)}>
                      <FaRegComment />
                      <span>{post.comentarios.length}</span>
                    </button>

                    <button onClick={() => handleReportPost(post._id)}>
                      <BiError className="text-yellow-500" />
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500">Debes ser miembro de la comunidad.</p>
                )}
              </div>
            </div>

            {/* Modal de Comentarios */}
            <dialog id={`comments_modal_${post._id}`} className="modal" open={openCommentModal === post._id}>
              <div className="modal-box">
                <h3 className="font-bold">Comentarios</h3>
                <div className="max-h-60 overflow-auto mt-2">
                  {post.comentarios.map((comment) => (
                    <div key={comment._id} className="flex items-start gap-2 mb-2">
                      <img
                        src={comment.user.fotoPerfil || "/avatar-placeholder.png"}
                        alt="Perfil"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{comment.user.nombreCompleto}</span>
                          <span className="text-sm text-gray-500">@{comment.user.nombre}</span>
                          {isMyComment(comment.user._id) && (
                            <FaTrash
                              className="text-red-500 cursor-pointer"
                              onClick={() =>
                                handleDeleteComment.mutate({ postId: post._id, commentId: comment._id })
                              }
                            />
                          )}
                        </div>
                        <p>{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {canInteract() ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCommentPost.mutate(post._id);
                    }}
                    className="mt-4 flex gap-2"
                  >
                    <textarea
                      className="textarea w-full"
                      placeholder="Escribe un comentario..."
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">
                      Publicar
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setOpenCommentModal(null);
                        setPreviewImage(null);
                      }}
                    >
                      Cerrar
                    </button>
                  </form>
                ) : (
                  <p className="text-gray-500">Inicia sesión para comentar.</p>
                )}
              </div>
            </dialog>

            <ModalDenuncia
              id={`denuncia_modal_${post._id}`}
              postId={post._id}
              tipoDenuncia="publicacion"
            />
          </div>
        ))
      ) : (
        <p>No hay publicaciones.</p>
      )}
    </div>
  );
};

export default ListaPublicaciones;
