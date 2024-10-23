import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/home/HomePage.jsx';
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
import GestionLibro from './Administrador/gestionLibro/GestionLibro.jsx';
import GestionComunidad from './Administrador/gestionComunidad/GestionComunidad.jsx';
import GestionAutor from './Administrador/gestionAutor/GestionAutor.jsx';
import GestionPublicacion from './Administrador/gestionPublicaciones/GestionPublicacion.jsx';
import GestionResenas from './Administrador/gestionReseñas/GestionResena.jsx';
import GestionNotificacion from './Administrador/gestionNotificaciones/GestionNotificacion.jsx';
import GestionDenuncias from './Administrador/gestionDenuncia/GestionDenuncia.jsx';
import FichaTecnicaLibro from './pages/libro/FichaLibro.jsx';
import FichaTecnicaAutor from './pages/autor/FichaAutor.jsx';
import DetallesComunidad from  './pages/comunidad/DetalleComunidad.jsx';
import Index from './pages/Index.jsx';
import RecuperarContrasena from './pages/auth/contraseña/RecuperarContrasena.jsx';
import Insignias from './pages/insignias/Insignias.jsx';


import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner.jsx';
import { createContext, useEffect,  useRef  } from 'react';


// Crear un contexto para compartir el tiempo en pantalla
export const TimeSpentContext = createContext();

function App() {
  
  const timeSpentRef = useRef(0);
  let intervalRef = useRef(null); // Para manejar el intervalo

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  // Pausar o reanudar el contador basándonos en el estado de autenticación
  useEffect(() => {
    if (authUser) {
      // Si el usuario está autenticado, inicia o reanuda el contador
      intervalRef.current = setInterval(() => {
        timeSpentRef.current += 1;
        console.log(`Tiempo en pantalla: ${timeSpentRef.current} segundos`); // Para verificar en consola
      }, 1000);
    } else {
      // Si el usuario no está autenticado, detener el contador
      clearInterval(intervalRef.current);
    }

    // Limpiar el intervalo al desmontar
    return () => clearInterval(intervalRef.current);
  }, [authUser]); // Dependencia de authUser para pausar/reanudar

  // Proporciona el valor del tiempo al contexto
  const value = { timeSpentRef };

  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }
 // Verifica si la ruta actual es una de gestión
 const isGestionRoute =
 location.pathname.startsWith('/gestion');


 const AdminRoute = ({ children }) => {
  // Verifica si el usuario está autenticado y si tiene el rol de administrador
  if (authUser && authUser.roles === 'admin') {
    // Permite el acceso si es administrador
    return children;
  }
  
  // Si no es administrador, redirigirlo a la página principal (Home)
  return <Navigate to='/' />;
};

  


  return (
    <TimeSpentContext.Provider value={value}>
      <div>
        {/* Si estamos en la ruta de gestión, solo renderizamos la vista de gestión */}
        {isGestionRoute ? (
          <div className='flex max-w-6xl mx-auto'>
            <main className='flex-1'>
            <Routes>
                  <Route path='/gestionUsuario' element={<AdminRoute><GestionUsuario /></AdminRoute>} />
                  <Route path='/gestionLibro' element={<AdminRoute><GestionLibro /></AdminRoute>} />
                  <Route path='/gestionComunidad' element={<AdminRoute><GestionComunidad /></AdminRoute>} />
                  <Route path='/gestionAutor' element={<AdminRoute><GestionAutor /></AdminRoute>} />
                  <Route path='/gestionPublicacion' element={<AdminRoute><GestionPublicacion /></AdminRoute>} />
                  <Route path='/gestionResenas' element={<AdminRoute><GestionResenas /></AdminRoute>} />
                  <Route path='/gestionNotificacion' element={<AdminRoute><GestionNotificacion /></AdminRoute>} />
                  <Route path='/gestionDenuncia' element={<AdminRoute><GestionDenuncias /></AdminRoute>} />
            </Routes>
            </main>
          </div>
        ) : (
        // En las demás rutas, renderizamos Sidebar, RightPanel y las vistas correspondientes
            <div className='flex max-w-6xl mx-auto'>
              {authUser && <Sidebar />}
              <main className='flex-1'>
                <Routes>
                  <Route path='/index' element={ <Index />} />  
                  <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/index' />} />
                  <Route path='/login' element={!authUser ? <LoginPage /> :<Navigate to='/' /> } />
                  <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to='/' />} />
                  <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to='/login' />} />
                  <Route path='/profile/:nombre' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
                  <Route path='/comunidad' element={authUser ? <Comunidad /> : <Navigate to='/login' />} />
                  <Route path='/libro' element={authUser ? <Libro /> : <Navigate to='/login' />} />
                  <Route path='/autor' element={authUser ? <Autor /> : <Navigate to='/login' />} />
                  <Route path='/fichaLibro' element={authUser ? <FichaTecnicaLibro /> : <Navigate to='/login' />} />
                  <Route path='/fichaAutor' element={authUser ? <FichaTecnicaAutor /> : <Navigate to='/login' />} />
                  <Route path='/detalleComunidad' element={authUser ? <DetallesComunidad /> : <Navigate to='/login' />} />  
                  <Route path='/insignia' element={authUser ? <Insignias /> : <Navigate to='/login' />} />   
                  <Route path='/recuperarContrasena' element={<RecuperarContrasena />} />


                  </Routes>
              </main>
              {authUser && <RightPanel />}
            </div>

        )}

        {/* Notificaciones globales */}
        <Toaster />
      </div>
    </TimeSpentContext.Provider>
    
  );
}

export default App;