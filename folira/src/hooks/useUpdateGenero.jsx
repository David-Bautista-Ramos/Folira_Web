import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateGenero = (generoId,obtenerGenerosLiterarios) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateGenero, isPending: isUpdatingGenero } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/geneLiter/updgeneros/${generoId}`, {
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
        obtenerGenerosLiterarios();
      toast.success("genero updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateGenero, isUpdatingGenero };
};

export default useUpdateGenero;
