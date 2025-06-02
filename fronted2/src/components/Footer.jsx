import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-light pt-12 pb-8 mt-auto border-t border-accent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center">
              <img src={require('../assets/logo.png')} alt="Eventfy Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-primary">Eventfy</span>
            </Link>
            <p className="mt-4 text-sm text-dark">
              Conecta, descubre y participa en eventos que te apasionan. Eventfy es tu plataforma para organizar y encontrar eventos sociales cercanos.
            </p>
          </div>
          
          {/* Enlaces rápidos */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-dark tracking-wider uppercase">
              Explorar
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/events" className="text-sm text-dark hover:text-primary">
                  Eventos
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-dark hover:text-primary">
                  Categorías
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-sm text-dark hover:text-primary">
                  Mapa de eventos
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-sm text-dark hover:text-primary">
                  Crear evento
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Enlaces de la empresa */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-dark tracking-wider uppercase">
              Empresa
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-dark hover:text-primary">
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-dark hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-dark hover:text-primary">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-dark hover:text-primary">
                  Empleo
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Enlaces legales */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-dark tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/privacy" className="text-sm text-dark hover:text-primary">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-dark hover:text-primary">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-dark hover:text-primary">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Redes sociales y copyright */}
        <div className="border-t border-accent pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-primary hover:text-secondary">
              <span className="sr-only">Facebook</span>
              {/* Icono Facebook */}
            </a>
            <a href="#" className="text-primary hover:text-secondary">
              <span className="sr-only">Instagram</span>
              {/* Icono Instagram */}
            </a>
          </div>
          <div className="text-dark text-sm">© 2025 Eventfy. Todos los derechos reservados.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;