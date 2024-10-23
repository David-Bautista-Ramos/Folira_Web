import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IoSettingsOutline } from 'react-icons/io5';
import { FaUser, FaHeart, FaTrash, FaTriangleExclamation, FaRegMessage } from 'react-icons/fa6';
import toast from 'react-hot-toast';

const NotificationPage = () => {
  const queryClient = useQueryClient(); 
  const [isDeletingGlobal, setIsDeletingGlobal] = useState(false); 
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false); // Estado para el modal de confirmación

  // Fetch inicial de notificaciones
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications/');
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al cargar notificaciones');
      }
      return res.json();
    },
  });

  // Eliminar una notificación específica
  const { mutate: deleteNotification } = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/notifications/notifi/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar la notificación');
    },
    onMutate: async (id) => {
      setIsDeletingGlobal(true);
      await queryClient.cancelQueries(['notifications']);
      const previousNotifications = queryClient.getQueryData(['notifications']);
      queryClient.setQueryData(['notifications'], (old) =>
        old.filter((notif) => notif._id !== id)
      );
      return { previousNotifications };
    },
    onError: (error, _, context) => {
      toast.error(error.message);
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['notifications']);
      setIsDeletingGlobal(false);
    },
  });

  // Eliminar todas las notificaciones
  const { mutate: deleteAllNotifications } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/notifications/', { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar todas las notificaciones');
    },
    onMutate: async () => {
      setIsDeletingGlobal(true);
      await queryClient.cancelQueries(['notifications']);
      queryClient.setQueryData(['notifications'], []);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['notifications']);
      setIsDeletingGlobal(false);
    },
  });

  const handleDeleteNotification = (id) => deleteNotification(id);

  const handleDeleteAllNotifications = () => {
    setConfirmDeleteAll(true); // Mostrar el modal de confirmación
  };

  const confirmDeleteAllNotifications = () => {
    deleteAllNotifications();
    setConfirmDeleteAll(false); // Cerrar el modal de confirmación
  };

  return (
    <div className='flex-[4_4_0] border-r border-primary min-h-screen relative'>
      <div className='flex justify-between items-center p-4 border-b border-gray-700'>
        <p className='font-bold'>Notifications</p>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='m-1'>
            <IoSettingsOutline className='w-4' />
          </div>
          <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
            <li>
              <button className='text-red-500' onClick={handleDeleteAllNotifications}>
                Delete all notifications
              </button>
            </li>
          </ul>
        </div>
      </div>

      {isLoading || isDeletingGlobal ? (
        <div className='flex justify-center items-center h-full'>
          <LoadingSpinner size='lg' />
        </div>
      ) : error ? (
        <div className='text-center p-4 font-bold text-red-500'>
          Error al cargar notificaciones 😥
        </div>
      ) : notifications?.length === 0 ? (
        <div className='text-center p-4 font-bold'>No notifications 🤔</div>
      ) : (
        notifications.map((notification) => (
          <div className='border-b border-gray-700' key={notification._id}>
            <div className='flex justify-between p-4'>
              <div className='flex gap-2 items-center'>
                {notification.tipo === 'seguidor' && <FaUser className='w-7 h-7 text-primary' />}
                {notification.tipo === 'like' && <FaHeart className='w-7 h-7 text-red-500' />}
                {notification.tipo === 'denuncia' && (
                  <FaTriangleExclamation className='text-gray-600 text-2xl' />
                )}
                {notification.tipo === 'comentario' && (
                  <FaRegMessage className='text-green-500 text-2xl' />
                )}
                <Link to={`/profile/${notification.de.nombre}`} className='flex items-center gap-2'>
                  <div className='avatar'>
                    <div className='w-8 rounded-full'>
                      <img src={notification.de.fotoPerfil || '/avatar-placeholder.png'} alt='profile' />
                    </div>
                  </div>
                  <span className='font-bold'>@{notification.de.nombre}</span>
                </Link>
              </div>

              <FaTrash
                className='cursor-pointer hover:text-red-500'
                onClick={() => handleDeleteNotification(notification._id)}
              />
            </div>
          </div>
        ))
      )}

      {/* Modal de confirmación para eliminar todas las notificaciones */}
      {confirmDeleteAll && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded shadow-md text-center'>
            <p>¿Estás seguro de que quieres eliminar todas las notificaciones?</p>
            <div className='flex justify-center gap-4 mt-4'>
              <button
                onClick={confirmDeleteAllNotifications}
                className='btn btn-primary'
              >
                Sí, eliminar
              </button>
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className='btn btn-secondary'
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
