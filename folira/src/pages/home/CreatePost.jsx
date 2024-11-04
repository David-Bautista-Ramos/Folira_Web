import { CiImageOn } from "react-icons/ci";
import { useRef, useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import EmojiPicker from 'emoji-picker-react'; // Importar EmojiPicker
import toast from 'react-hot-toast';

const CreatePost = () => {
	const [contenido, setContenido] = useState("");
	const [fotoPublicacion, setFotoPublicacion] = useState(null);
	const [mostrarPicker, setMostrarPicker] = useState(false); // Control del Picker de emojis
	const fotoPublicacionRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ['authUser'] });
	const queryClient = useQueryClient();

	const { mutate: CreatePost, isPending, isError, error } = useMutation({
		mutationFn: async ({ contenido, fotoPublicacion }) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ contenido, fotoPublicacion }),
				});
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Algo salió mal");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			setContenido("");
			setFotoPublicacion(null);
			toast.success("Publicación creado con éxito");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		CreatePost({ contenido, fotoPublicacion });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => setFotoPublicacion(reader.result);
			reader.readAsDataURL(file);
		}
	};

	const onEmojiClick = (emojiObject) => {
		setContenido((prev) => prev + emojiObject.emoji); // Agrega el emoji al contenido
		setMostrarPicker(false); // Cierra el picker
	};

	return (
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser?.fotoPerfil || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800'
					placeholder='¡¿Qué está pasando?!'
					value={contenido}
					onChange={(e) => setContenido(e.target.value)}
				/>
				{fotoPublicacion && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setFotoPublicacion(null);
								fotoPublicacionRef.current.value = null;
							}}
						/>
						<img
							src={fotoPublicacion}
							className='w-full mx-auto h-72 object-contain rounded'
						/>
					</div>
				)}

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
				<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => fotoPublicacionRef.current.click()}
						/>
						<BsEmojiSmileFill
							className='fill-primary w-5 h-5 cursor-pointer'
							onClick={() => setMostrarPicker((prev) => !prev)}
						/>
					</div>
					<input
						type='file'
						accept='image/*'
						hidden
						ref={fotoPublicacionRef}
						onChange={handleImgChange}
					/>
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Publicando..." : "Publicar"}
					</button>
				</div>

				{mostrarPicker && (
					<div className='absolute z-50 mt-2'>
						<EmojiPicker onEmojiClick={onEmojiClick} />
					</div>
				)}

				{isError && <div className='text-red-500'>{error.message}</div>}
			</form>
		</div>
	);
};

export default CreatePost;
