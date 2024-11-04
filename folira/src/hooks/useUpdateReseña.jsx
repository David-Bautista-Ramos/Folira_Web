import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const useUpdateResena = (resenaId) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateResena, isPending: isUpdatingResena } = useMutation({
    mutationFn: async (formData) => {
      try {
        const res = await fetch(`/api/resenas/putresenas/${resenaId}`, {
          method: "PUT", // Asegúrate de que es POST o PUT
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        
        // Si recibes una respuesta HTML (por ejemplo, un error 404), no podrás hacer .json()
        if (res.headers.get('content-type')?.includes('text/html')) {
          throw new Error('El punto final devolvió HTML. Verificar problemas de URL o del lado del servidor.');
        }

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "algo salió mal");
        }
        return data;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Reseña actualizada con éxito");
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