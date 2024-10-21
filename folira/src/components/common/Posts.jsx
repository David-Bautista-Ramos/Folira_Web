import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({feedType, nombre, userId}) => {

	const getPostEndpoint = () =>{
		switch(feedType){
			case "forYou":
				return "/api/posts/postsinComunidad";
			case "following":
				return "/api/posts/seguidores";
			case "posts":
				return `/api/posts/user/${nombre}`;
			case "likes":
				return `/api/posts/likes/${userId}`;
			default:
				return "/api/posts/all";
		}
	}

	const POST_ENDPOINT = getPostEndpoint();

	const {data:posts, isLoading, refetch,isRefetching} = useQuery({
		queryKey: ["posts"],
		queryFn: async () =>{
			try {
				const res = await fetch(POST_ENDPOINT);
				const data = await res.json();

				if(!res.ok){
					throw new Error(data.error || "Something wnet wrong");
				}

				return data;
			} catch (error) {
				throw new Error(error);

			}
		}
	});

	useEffect(()=>{
		refetch();

	}, [feedType,refetch,nombre]);


	return (
		<>
			{(isLoading || isRefetching ) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No hay publicaciones en esta pestaña.👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;