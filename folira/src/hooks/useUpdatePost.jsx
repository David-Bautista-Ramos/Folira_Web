import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdatePublicacion = (publicacionId) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updatePost, isPending: isUpdatingPost } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/posts/post/${publicacionId}`, {
          method: "PUT", // Asegúrate de que es POST o PUT
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
      toast.success("Publicacion updated successfully");
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { updatePost, isUpdatingPost };
};

export default useUpdatePublicacion;