import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

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
                    </div>
                    {/* Botones de la derecha */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-base font-medium text-gray-700 hover:text-blue-900 transition">Panel</Link>
                                <Link to="/profile" className="flex items-center gap-2 text-base font-medium text-gray-700 hover:text-blue-900 transition">
                                    {user.profile ? (
                                        <img src={user.profile} alt="Foto de perfil" className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z" /></svg>
                                    )}
                                    <span>{user.username}</span>
                                </Link>
                                <button onClick={logout} className="text-base font-medium text-gray-700 hover:text-blue-900 transition">Cerrar sesión</button>
                            </>
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