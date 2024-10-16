
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateComunidad = (comunidadId,obtenerComunidades) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updatecomunidad, isPending: isUpdatingcomunidad } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/comunidad/putcomunidad/${comunidadId}`, {
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
       obtenerComunidades();
      toast.success("Comunidad updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updatecomunidad, isUpdatingcomunidad };
};

export default useUpdateComunidad;