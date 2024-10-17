// import { Link } from 'react-router-dom';
import conectar_personas from "../assets/icons/conectar_personas.png";
import calificar_estrella from "../assets/icons/calificar_revisar.png";
import explorar_titulos from "../assets/icons/explorar_titulos.png";
import no_venta from "../assets/icons/no-venta2.png";
import contenido_inapropiado from "../assets/icons/contenido-inapropiado2.png";
import denuncia2 from "../assets/icons/denuncia2.png";
import FoliraIndex from "../assets/img/Folira_blanco.png";
import fotoBack from '../assets/img/fondo_nuevo.jpg';
import libro from "../assets/img/libro.jpg";
import escritores from "../assets/img/escritores.jpg";
import generoIndex from "../assets/img/libro-genero.jpg"; 
import { useNavigate } from 'react-router-dom';
import TerminosConditionsModal from './TerminosCondiciones';

function Index() {
    const navigate = useNavigate();
  return (
    <div className="w-full"> {/* Asegura que el div principal use todo el ancho */}
      <header
      className="bg-cover bg-center min-h-[70vh] flex flex-col justify-between w-full relative"
      style={{ backgroundImage: `url(${fotoBack})` }}
    >
      <div className="absolute inset-0 bg-black opacity-90" /> {/* Capa oscura */}
      <div className="flex items-center justify-between w-full p-5 relative">
        <img src={FoliraIndex} alt="Logo" className="w-[300px] -mt-[50px] h-[250px]" />
        <nav className="flex items-center space-x-4">
          <button
            className="border border-white text-white py-2 -mt-[70px] mr-10 px-4 rounded bg-transparent hover:bg-white hover:text-blue-950"
            onClick={() => navigate('/login')} // Redirigir a la página de login
          >
            Iniciar Sesión
          </button>
          {/* <RegisterModal /> */}
          {/* <LoginModal /> */}
        </nav>
      </div>
      <div className="text-center my-auto relative z-10">
        <h1 className="text-6xl md:text-8xl text-white uppercase mb-6">Explora un Mundo de Libros y Conexiones</h1>
        <p className="text-lg md:text-xl text-white mx-4 md:mx-16 mb-6">
          Imagina un lugar donde cada página de tu libro favorito puede llevarte a nuevas amistades. En nuestra comunidad, encontrarás personas que comparten tu amor por la lectura y podrán discutir contigo sobre los últimos lanzamientos, clásicos inolvidables y todo lo que está entre medio. Únete a nosotros para descubrir una red vibrante de lectores apasionados, crear conexiones significativas y sumergirte en debates fascinantes sobre tus libros favoritos.
        </p>
      </div>
    </header>



      <section className="py-24 bg-gray-200 w-full">
        <div className="w-full text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <img src={conectar_personas} alt="Conecta con Lectores" className="mx-auto mb-4 w-20 " />
              <h3 className="text-2xl font-bold mb-2">Conecta con Lectores</h3>
              <p>Encuentra y únete a comunidades de lectura, donde podrás compartir opiniones y descubrir nuevos amigos con intereses similares.</p>
            </div>
            <div className="text-center">
              <img src={calificar_estrella} alt="Califica y Revisa" className="mx-auto mb-4 w-20" />
              <h3 className="text-2xl font-bold mb-2">Califica y Revisa</h3>
              <p>Califica tus libros favoritos y deja reseñas detalladas para ayudar a otros a encontrar su próxima lectura perfecta.</p>
            </div>
            <div className="text-center">
              <img src={explorar_titulos} alt="Explora Nuevos Títulos" className="mx-auto mb-4 h-20" />
              <h3 className="text-2xl font-bold mb-2">Explora Nuevos Títulos</h3>
              <p>Descubre una amplia variedad de libros a través de nuestras recomendaciones personalizadas y listas de lectura.</p>
            </div>
          </div>
        </div>
      </section>

      <main className="relative bg-white py-16 w-full"
      style={{ backgroundImage: `url(${libro})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
>
  <div className="absolute inset-0 bg-black opacity-80" /> {/* Capa oscura con mayor opacidad */}
  <div className="w-full relative z-10"> {/* Asegúrate de que el contenido esté por encima de la capa oscura */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
      <div>
        <img src={no_venta} alt="No Promovemos la Venta de Libros" className="mx-auto mb-4 h-20" />
        <h3 className="text-xl text-white font-semibold">No Promovemos la Venta de Libros</h3>
      </div>
      <div>
        <img src={contenido_inapropiado} alt="No Se Permite el Contenido Inapropiado" className="mx-auto mb-4 h-20" />
        <h3 className="text-xl text-white font-semibold">No Se Permite el Contenido Inapropiado</h3>
      </div>
      <div>
        <img src={denuncia2} alt="Sistema de Denuncias Activo" className="mx-auto mb-4 h-20" />
        <h3 className="text-xl text-white font-semibold">Sistema de Denuncias Activo</h3>
      </div>
    </div>
    <p className="text-center mt-10 text-lg text-white max-w-2xl mx-auto">
      En nuestra plataforma, nos dedicamos a promover la interacción y el intercambio de ideas entre amantes de los libros, sin involucrarnos en la venta de libros o productos. Mantenemos un entorno seguro y respetuoso, por lo que no permitimos contenido inapropiado. Si encuentras algo que no cumpla con nuestras políticas, te ofrecemos un sistema de denuncias activo para que podamos mantener la calidad de nuestra comunidad.
    </p>
  </div>
</main>


      <section className="bg-gray-200 py-16 w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-left pl-4 md:pl-10 mt-10">
            <h2 className="text-4xl font-semibold mb-4">Encuentra a Tu Nuevo Escritor Favorito</h2>
            <p className="text-lg text-gray-700">
              Explora una amplia gama de escritores y descubre aquellos que se ajustan a tus gustos literarios. Ya sea que prefieras autores contemporáneos, clásicos o de géneros específicos, nuestra plataforma te permite encontrar y seguir a los escritores que más te interesan.
            </p>
          </div>
          <div className="flex justify-center items-center">
            <img src={escritores} alt="Escritores" className="max-w-full h-auto object-contain" />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 w-full">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex justify-center items-center">
            <img src={generoIndex} alt="Géneros Literarios" className="max-w-full h-auto object-contain" />
          </div>
          <div className="text-center md:text-left flex flex-col justify-center">
            <h2 className="text-4xl font-semibold mb-4">Explora Géneros Literarios</h2>
            <p className="text-lg text-gray-700">
              Sumérgete en una variedad de géneros literarios y encuentra tus nuevas lecturas favoritas. Desde ficción hasta no ficción, ciencia ficción, fantasía, y más, nuestra plataforma te ayuda a explorar diferentes categorías y descubrir libros que se ajusten a tus intereses.
            </p>
          </div>
        </div>
      </section>

      <footer className="text-primary py-10 w-full bg-gray-200">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-200">
                <div>
                    <h3 className="text-xl font-semibold ml-5 mb-4">Sobre Nosotros</h3>
                    <p className='ml-5'>Nos dedicamos a conectar a los amantes de los libros y promover la interacción en un entorno seguro y respetuoso.</p>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4">Enlaces Útiles</h3>
                    <TerminosConditionsModal /> {/* Aquí incluimos el modal */}
                </div>
                {/* <div>
                    <h3 className="text-xl font-semibold mb-4">Síguenos</h3>
                    <ul>
                        <li className="mb-2"><Link to="#" className="hover:underline">Facebook</Link></li>
                        <li className="mb-2"><Link to="#" className="hover:underline">Twitter</Link></li>
                        <li><Link to="#" className="hover:underline">Instagram</Link></li>
                    </ul>
                </div> */}
            </div>
        </footer>
    </div>
  );
}

export default Index;
