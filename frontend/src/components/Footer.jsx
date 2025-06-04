import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaTiktok } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-5 mt-auto border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
          {/* Logo y descripción */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-2 group">
              <img src={logo} alt="Eventfy Logo" className="h-9 w-9 transition-transform group-hover:scale-105" />
              <span className="text-xl font-semibold text-white group-hover:text-primary transition">Eventfy</span>
            </Link>
            <p className="text-gray-400 text-sm leading-snug max-w-xs">
              Conecta, descubre y participa en eventos que te apasionan. Tu plataforma para organizar y encontrar experiencias inolvidables.
            </p>
            <div className="flex space-x-3 mt-2">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition" aria-label="Facebook"><FaFacebookF size={16} /></a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition" aria-label="Instagram"><FaInstagram size={16} /></a>
              <a href="#" className="text-gray-400 hover:text-sky-400 transition" aria-label="Twitter"><FaTwitter size={16} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="TikTok"><FaTiktok size={16} /></a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-base font-semibold mb-2 text-primary">Enlaces rápidos</h3>
            <ul className="space-y-1 text-sm text-gray-400">
              <li><Link to="/events" className="hover:text-white transition">Eventos</Link></li>
              <li><Link to="/events/create" className="hover:text-white transition">Crear evento</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-base font-semibold mb-2 text-primary">Contacto</h3>
            <p className="text-sm text-gray-400 leading-snug">
              <span className="text-white font-medium">Email:</span> info@eventfy.com<br />
              <span className="text-white font-medium">Tel:</span> +34 123 456 789<br />
              <span className="text-white font-medium">Dirección:</span> Gran Via 21, Madrid
            </p>
          </div>
        </div>

        {/* Footer base */}
        <div className="mt-4 pt-3 border-t border-gray-800 text-center text-xs text-gray-500">
          © 2025 Eventfy. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
