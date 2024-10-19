import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateNotificacion = (notificacionId) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateNotificacion, isPending: isUpdatingNotificacion } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/notifications/actuNotifi/${notificacionId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Notificacion updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateNotificacion, isUpdatingNotificacion };
};

export default useUpdateNotificacion;