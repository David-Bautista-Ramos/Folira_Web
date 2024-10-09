import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import ModalSeguidos from "./SeguidosModal";
import ModalSeguidores from "./SeguidoresModal";
import userFollow from "../../hooks/userFollow";
import GenerosProfile from "./GenerosProfile";
import GenerosModal from "./GenerosModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const ProfilePage = () => {
  const [fotoPerfilBan, setfotoPerfilBan] = useState(null);
  const [fotoPerfil, setfotoPerfil] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const fotoPerfilBanRef = useRef(null);
  const fotoPerfilRef = useRef(null);

  const { nombre } = useParams();

  const { follow, isPending } = userFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${nombre}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
  useEffect(() => {
    refetch();
  }, [nombre, refetch]);

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  const isMyProfile = authUser._id === user?._id;
  const amIFollowing = authUser?.seguidos.includes(user?._id);
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setfotoPerfilBan(reader.result);
        state === "profileImg" && setfotoPerfil(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const [modalOpen, setModalOpen] = useState(false); // Definir el estado aquí

  const abrirModal = () => {
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="flex-[4_4_0] border-r border-primary min-h-screen ">
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.nombreCompleto}</p>
                  <span className="text-sm text-slate-500">
                    {POSTS?.length} posts
                  </span>
                </div>
              </div>
              {/* COVER IMG */}
              <div className="relative group/cover">
                <img
                  src={fotoPerfilBan || user?.fotoPerfilBan || "/cover.png"}
                  className="h-52 w-full object-cover"
                  alt="cover image"
                />
                {isMyProfile && (
                  <div
                    className="absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200"
                    onClick={() => fotoPerfilBanRef.current.click()}
                  >
                    <MdEdit className="w-5 h-5 text-white" />
                  </div>
                )}

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={fotoPerfilBanRef}
                  onChange={(e) => handleImgChange(e, "coverImg")}
                />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={fotoPerfilRef}
                  onChange={(e) => handleImgChange(e, "profileImg")}
                />
                {/* USER AVATAR */}
                <div className="avatar absolute -bottom-16 left-4">
                  <div className="w-32 rounded-full relative group/avatar">
                    <img
                      src={
                        fotoPerfil ||
                        user?.fotoPerfil ||
                        "/avatar-placeholder.png"
                      }
                    />
                    <div className="absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer">
                      {isMyProfile && (
                        <MdEdit
                          className="w-4 h-4 text-white"
                          onClick={() => fotoPerfilRef.current.click()}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end px-4 mt-5">
                {isMyProfile && <EditProfileModal authUser={authUser} />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={() => follow(user?._id)}
                  >
                    {isPending && "Loading..."}
                    {!isPending && amIFollowing && "Unfollow"}
                    {!isPending && !amIFollowing && "Follow"}
                  </button>
                )}
                {(fotoPerfilBan || fotoPerfil) && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={async () => {
                      await updateProfile({ fotoPerfil, fotoPerfilBan });
                      setfotoPerfil(null);
                      setfotoPerfilBan(null);
                    }}
                  >
                    {isUpdatingProfile ? "Updating..." : "Upadte"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-14 px-4">
                <div className="flex flex-col">
                  <span className="font-bold text-lg">
                    {user?.nombreCompleto}
                  </span>
                  <span className="text-sm text-slate-500">
                    @{user?.nombre}
                  </span>
                  <span
                    className="text-sm my-1 block break-words"
                    style={{
                      maxWidth: "100%",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {user?.biografia}
                  </span>
                  <span className="text-sm my-1">Pais: {user?.pais}</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {memberSinceDate}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    {/* Cantidad de seguidores */}
                    <span className="font-bold text-xs">
                      {user?.seguidos.length}
                    </span>

                    {/* Botón que abre el modal de seguidores */}
                    <ModalSeguidos seguidores={user?.seguidos} />
                  </div>

                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.seguidores.length}
                    </span>
                    <ModalSeguidores seguidores={user?.seguidos} />
                  </div>
                </div>

                {/* Géneros literarios preferidos */}
                <div>
                  <div className="mt-4 flex items-center">
                    <span className="font-bold text-xl mr-2">
                      Preferred Literary Genres:
                    </span>
                    <div className="flex-1" />{" "}
                    {/* Este div tomará el espacio disponible para empujar el botón */}
                    {/* Ajusta el estilo del botón */}
                    <button
                      className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-950 text-sm h-9 w-28"
                      style={{
                        marginLeft: "20px",
                        maxWidth: "calc(40% - 100px)",
                      }} // Reduce el margen izquierdo para alinear con la lista
                      onClick={abrirModal} // Llama a la función para abrir el modal
                    >
                      Ver Géneros
                    </button>
                    <GenerosModal isOpen={modalOpen} onClose={cerrarModal} />{" "}
                    {/* Pasa el estado y la función */}
                    <ul className="list-disc ml-5">
                      {user?.generoLiterarioPreferido.map((genero) => (
                        <li key={genero} className="text-sm">
                          {genero}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <GenerosProfile />
                </div>
              </div>

              <div className="flex w-full border-b border-gray-700 mt-4">
                <div
                  className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                  {feedType === "posts" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                  {feedType === "likes" && (
                    <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                  )}
                </div>
              </div>
            </>
          )}

          <Posts feedType={feedType} nombre={nombre} userId={user?._id} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
