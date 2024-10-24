
import { useQuery } from '@tanstack/react-query';

const usePosts = (id) => {
  return useQuery({
    queryKey: ['posts', id],
    queryFn: async () => {
      const res = await fetch(`/api/posts/postComunidad/${id}`);
      if (!res.ok) throw new Error('Error al obtener las publicaciones');
      return res.json();
    },
  });
};

export default usePosts;