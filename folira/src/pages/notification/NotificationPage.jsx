import { useState } from 'react';
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser, FaHeart, FaTrash } from "react-icons/fa6";
import toast from 'react-hot-toast';

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  // Estado para manejar cuál notificación se está eliminando
  const [isDeleting, setIsDeleting] = useState(null);

  // Manejador para eliminar una notificación individual
  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al eliminar la notificación");
      return data;
    },
    onSuccess: () => {
      toast.success("Notificación eliminada con éxito");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsDeleting(null); // Restablecer el estado de eliminación
    }
  });

  // Función para manejar la eliminación de una notificación específica
  const handleDeleteNotification = (id) => {
    setIsDeleting(id);
    deleteNotification(id);
  };

  return (
    <>
      <div className='flex-[4_4_0] border-r border-primary min-h-screen '>
        <div className='flex justify-between items-center p-4 border-b border-gray-700'>
          <p className='font-bold'>Notifications</p>
          <div className='dropdown '>
            <div tabIndex={0} role='button' className='m-1'>
              <IoSettingsOutline className='w-4' />
            </div>
            <ul
              tabIndex={0}
              className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'
            >
              <li>
                <a onClick={deleteNotification}>Delete all notifications</a>
              </li>
            </ul>
          </div>
        </div>
        {isLoading && (
          <div className='flex justify-center h-full items-center'>
            <LoadingSpinner size='lg' />
          </div>
        )}
        {notifications?.length === 0 && <div className='text-center p-4 font-bold'>No notifications 🤔</div>}
        {notifications?.map((notification) => (
          <div className='border-b border-gray-700' key={notification._id}>
            <div className='flex justify-between p-4'>
              <div className='flex gap-2'>
                {notification.tipo === "follow" && <FaUser className='w-7 h-7 text-primary' />}
                {notification.tipo === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
                <Link to={`/profile/${notification.de.nombre}`}>
                  <div className='avatar'>
                    <div className='w-8 rounded-full'>
                      <img src={notification.de.fotoPerfil || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className='flex gap-1'>
                    <span className='font-bold'>@{notification.de.nombre}</span>{" "}
                    {notification.tipo === "follow" ? "followed you" : "liked your post"}
                  </div>
                </Link>
              </div>
              {/* Botón de basura */}
              <div className='flex items-center'>
                {isDeleting === notification._id ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <FaTrash
                    className='cursor-pointer hover:text-red-500'
                    onClick={() => handleDeleteNotification(notification._id)}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default NotificationPage;
