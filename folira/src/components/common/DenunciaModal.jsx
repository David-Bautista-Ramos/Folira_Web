import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

const ModalDenuncia = ({ postId, tipoDenuncia }) => {
  const [motivo, setMotivo] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: reportPost, isPending: isReporting } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/posts/numDenun/${postId}`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to report post');
      return res.json();
    },
    onSuccess: (data) => {
      toast.success("Publicación reportada con éxito");
      queryClient.setQueryData(["posts"], (oldData) =>
        oldData.map((p) => (p._id === postId ? { ...p, denuncias: data.denuncias } : p))
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/denuncias/denuncia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          motivo,
          tipoDenuncia,
          idPublicacion: tipoDenuncia === 'publicacion' ? postId : null,
          userId: authUser._id, // ID del denunciante
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al crear la denuncia');
      }

      // Llama a reportPost después de la denuncia
      await reportPost(); // Asegúrate de que esto sea una función async

      document.getElementById(`denuncia_modal_${postId}`).close(); // Cierra el modal
      setMotivo(''); // Resetea el estado de motivo
      setError(''); // Resetea el error
    } catch (error) {
      setError(error.message); // Manejo de errores
    }
  };

  return (
    <dialog id={`denuncia_modal_${postId}`} className='modal'>
      <div className='modal-box border rounded-md border-blue-950 shadow-md'>
        <h3 className='text-primary font-bold text-lg my-3'>Denuncia</h3>

        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <select
            className='border border-blue-950 rounded p-2'
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
          >
            <option value='' disabled>Motive de la denuncia</option>
            <option value='Muestra de odio'>Muestra de odio</option>
            <option value='Suplantación de identidad'>Suplantación de identidad</option>
            <option value='Contenido Violento y explícito'>Contenido Violento y explícito</option>
            <option value='Fraude y estafa'>Fraude y estafa</option>
            <option value='Suicidio, autolesiones y actos peligrosos'>Suicidio, autolesiones y actos peligrosos</option>
            <option value='Acoso o intimidación'>Acoso o intimidación</option>
            <option value='Venta o promoción de artículos'>Venta o promoción de artículos</option>
          </select>

          <button type='submit' className='btn btn-primary rounded-full btn-sm' disabled={isReporting}>
            {isReporting ? 'Reportando...' : 'Hacer Denuncia'}
          </button>
        </form>
      </div>

      {/* Cerrar el modal */}
      <form method='dialog' className='modal-backdrop'>
      <button type='button' onClick={() => document.getElementById(`denuncia_modal_${postId}`).close()}>
          Cerrar</button>
      </form>
    </dialog>
  );
};

export default ModalDenuncia;
