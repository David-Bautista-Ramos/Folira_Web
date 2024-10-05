import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import useFollow from '../../hooks/userFollow';
import LoadingSpinner from './LoadingSpinner';

const RightPanel = () => {
	
	const { data: suggestedUsers, isLoading } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/users/sugerencias");
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong!");
				}
				return data;
			} catch (error) {
				throw new Error(error.message);
			}
		},
	});
	const { follow, isPending } = useFollow();
	if (suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;

	return (
		<div className='hidden lg:block my-4 mx-2 '>
			<div className='bg-[#ebedef] p-4 rounded-md sticky top-2  '>
				<p className='font-bold'>A quienes seguir</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.nombre}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.fotoPerfil || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.nombre}
										</span>
										<span className='text-sm text-blue-950'>@{user.nombre}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-blue hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault();	
											follow(user._id);
										}}
									>
										{isPending ? <LoadingSpinner size="sm" /> : "Follow" }
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;