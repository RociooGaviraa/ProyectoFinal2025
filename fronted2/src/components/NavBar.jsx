import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Cerrar el menú si se hace clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Obtener iniciales del usuario
    const getInitials = (name) => {
        if (!name) return '';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0">
                        <Link to="/" className="flex items-center gap-2">
                            <svg className="h-8 w-8 text-blue-900" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="2" width="20" height="20" rx="6" fill="#1e293b"/>
                                <path d="M7 12h10M12 7v10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <span className="text-2xl font-extrabold text-blue-900 tracking-tight">EventHorizon</span>
                        </Link>
                    </div>
                    {/* Enlaces centrales */}
                    <div className="hidden md:flex md:gap-8 md:ml-12">
                        <Link to="/events" className="text-base font-medium text-gray-700 hover:text-blue-900 transition">Eventos</Link>
                        <Link to="/map" className="text-base font-medium text-gray-700 hover:text-blue-900 transition">Mapa</Link>
                        <Link to="/events/create" className="text-base font-medium text-gray-700 hover:text-blue-900 transition">Crear Evento</Link>
                    </div>
                    {/* Botones de la derecha */}
                    <div className="flex items-center gap-4 relative">
                        {user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    onClick={() => setMenuOpen((open) => !open)}
                                >
                                    {user.profile ? (
                                        <img src={user.profile} alt="Foto de perfil" className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        getInitials(user.username || user.name)
                                    )}
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-50 border border-gray-100">
                                        <div className="px-4 py-3 border-b font-bold text-gray-900">Mi Cuenta</div>
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Perfil
                                        </Link>
                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Mis Eventos
                                        </Link>
                                        <div className="border-t my-1" />
                                        <button
                                            onClick={() => { setMenuOpen(false); logout(); }}
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
                                        >
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 rounded-md font-semibold text-base text-white bg-blue-900 hover:bg-blue-800 transition">Iniciar Sesión</Link>
                                <Link to="/register" className="px-4 py-2 rounded-md font-semibold text-base text-blue-900 border border-blue-900 hover:bg-blue-900 hover:text-white transition">Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;