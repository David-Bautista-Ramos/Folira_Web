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
      await fetch(`/api/posts/deletecomen/${postId}/${commentId}`, { method: "DELETE" });
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
      {posts && posts.length ? (
        posts.map((post) => (
          <div key={post._id} className="border-b py-4">
            <div className="flex items-start gap-4">
              <Link to={`/profile/${post.user?._id}`} className="w-10 h-10 rounded-full overflow-hidden">
                <img src={post.user?.fotoPerfil || "/avatar-placeholder.png"} alt="Perfil" />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${post.user?._id}`} className="font-bold">
                    {post.user?.nombreCompleto}
                  </Link>
                  <span className="text-sm text-gray-500">@{post.user?.nombre}</span>
                  <span className="text-sm text-gray-400">· {formatPostDate(post.createdAt)}</span>
                  {authUser && authUser._id === post.user?._id && ( // Mostrar el botón de eliminar solo si es el autor
                    <FaTrash
                      className="text-primary hover:blue-950 cursor-pointer"
                      onClick={() => handleDeletePost.mutate(post._id)}
                    />
                  )}
                </div>
                <p className="mt-2">{post.contenido}</p>
                {post.fotoPublicacion && (
                  <img src={post.fotoPublicacion} alt="Publicación" className="w-full h-88 object-cover mt-2" />
                )}
              </div>
            </div>

            <div className="flex justify-center items-center mt-3">
              <div className="flex items-center gap-[120px]">
                {canInteract() ? (
                  <>
                    {/* Botón de Like */}
                    <button onClick={() => handleLikePost.mutate(post._id)} className="flex items-center gap-1">
                      <FaRegHeart className="w-4 h-4 cursor-pointer text-slate-500 hover:text-pink-500" />
                      <span>{post.likes.length}</span>
                    </button>

                    {/* Botón de Comentario */}
                    <button onClick={() => setOpenCommentModal(post._id)} className="flex items-center gap-1">
                      <FaRegComment className="w-4 h-4 text-slate-500 hover:text-blue-950" />
                      <span>{post.comentarios.length}</span>
                    </button>

                    {/* Botón de Reportar */}
                    <button onClick={() => handleReportPost(post._id)} className="flex items-center gap-1">
                      <BiError className="w-6 h-6 text-slate-500 hover:text-yellow-500" />
                      <span>{post.denuncias !== undefined ? post.denuncias : 0}</span>
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500">Debes ser miembro de la comunidad.</p>
                )}
              </div>
            </div>



            {/* Modal de Comentarios */}
            <dialog
              id={`comments_modal_${post._id}`}
              className="modal fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
              open={openCommentModal === post._id}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setOpenCommentModal(null); // Cierra el modal cuando se hace clic fuera del contenido del modal
                }
              }}
            >
              <div className="modal-box rounded border border-blue-950 p-6 relative">
                <h3 className="font-bold text-lg mb-4">COMENTARIOS</h3>
                <div className="flex flex-col gap-3 max-h-60 overflow-auto mt-2">
                  {post.comentarios?.length === 0 && (
                    <p className="text-sm text-slate-500">
                      No hay comentarios todavía 🤔 Sé el primero 😉
                    </p>
                  )}
                  {post.comentarios?.slice().reverse().map((comment) => (
                    <div key={comment._id} className="flex gap-2 items-start">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={comment.user?.fotoPerfil || "/avatar-placeholder.png"}
                            alt="Profile"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold mr-2">
                            {comment.user?.nombreCompleto}
                          </span>
                          <span className="text-blue-950 text-sm">
                            @{comment.user?.nombre}
                          </span>
                          {isMyComment(comment.user._id) && (
                            <span className="text-blue-950 flex flex-1 ml-auto">
                              <FaTrash
                                className="cursor-pointer hover:text-blue-950"
                                onClick={() =>
                                  handleDeleteComment.mutate({
                                    postId: post._id,
                                    commentId: comment._id,
                                  })
                                }
                              />
                            </span>
                          )}
                        </div>
                        <div className="text-sm break-all">{comment.text}</div>
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
                    className="flex gap-2 items-center mt-4 border-t border-blue-950 pt-2"
                  >
                    <textarea
                      className="textarea w-full p-1 h-[20px] rounded text-md resize-none border focus:outline-none border-blue-950"
                      placeholder="Escribe un comentario..."
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary rounded-full btn-sm text-white px-4">
                      Publicar
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