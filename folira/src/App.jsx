import { Routes, Route, Navigate } from 'react-router-dom'

import HomePage from './pages/home/HomePage.jsx'
import Sidebar from './components/common/Siderbar.jsx';
import LoginPage from './pages/auth/login/LoginPage.jsx';
import SignUpPage from './pages/auth/signup/SignUpPage.jsx';
import RightPanel from './components/common/RightPanel.jsx';
import NotificationPage from './pages/notification/NotificationPage.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import Comunidad from './pages/comunidad/Comunidad.jsx';
import Libro from './pages/libro/Libros.jsx';
import Autor from './pages/autor/Autor.jsx';
import GestionUsuario from './Administrador/gestionUsuario/GestionUsuario.jsx';


import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';



function App() {
	const { data: authUser, isLoading } = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUser is here:", data);
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});
	if (isLoading) {
		return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
	}

	return (
		<div className='flex max-w-6xl mx-auto'>
			{/* Common component, bc it's not wrapped with Routes */}
			{authUser && <Sidebar />}
			<main className='flex-1'>
				<Routes>
					<Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
					<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
					<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
					<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
					<Route path='/profile/:nombre' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
					<Route path='/comunidad' element={authUser ? <Comunidad /> : <Navigate to='/login' />} />
					<Route path='/libro' element={authUser ? <Libro /> : <Navigate to='/login' />} />
					<Route path='/autor' element={authUser ? <Autor /> : <Navigate to='/login' />} />
					<Route path='/gestionUsuario' element={authUser ? <GestionUsuario /> : <Navigate to='/login' />} />

				</Routes>
			</main>
			{authUser && <RightPanel />}
			<Toaster />
		</div>
	);
}

export default App
