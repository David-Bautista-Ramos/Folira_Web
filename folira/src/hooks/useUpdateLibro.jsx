import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateLibro = (libroId) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateLibro, isPending: isUpdatingLibro } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/libro/putlibro/${libroId}`, {
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
      toast.success("Libro updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updateLibro, isUpdatingLibro };
};

export default useUpdateLibro;
