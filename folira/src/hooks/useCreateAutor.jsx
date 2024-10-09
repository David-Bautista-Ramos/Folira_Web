import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function useCreateAutor() {
  const queryClient = useQueryClient();

  const { mutateAsync: createAutor, isPending: isCreatingAutor } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/autror/autores`, {
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
    onSuccess: async () => {
      // Cambia a async
      toast.success("Autor creado con éxito");
      await Promise.all([
        // Añade await aquí
        queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { createAutor, isCreatingAutor };
}

export default useCreateAutor;
