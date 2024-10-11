import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateResena = (resenaId) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateResena, isPending: isUpdatingResena } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/resenas/putresenas/${resenaId}`, 
          {
          method: "POST",
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
      toast.success("Reseña updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateResena, isUpdatingResena };
};

export default useUpdateResena;