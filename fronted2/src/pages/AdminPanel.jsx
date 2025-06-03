import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import Statistics from './Statistics';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('usuarios');

    useEffect(() => {
        api.getAllUsers().then(setUsers).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-xl text-blue-900 font-semibold">Cargando usuarios...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Hero Section */}
            <section className="w-full bg-gradient-to-br from-blue-900 via-teal-800 to-teal-600 text-white py-20 shadow-md">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Panel de Administración</h1>
                        <p className="text-lg mb-2">Gestiona los usuarios registrados y accede a sus eventos.</p>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <div className="container mx-auto px-4 flex gap-4 mt-2">
                <button
                    className={`px-6 py-2 rounded-t-lg font-semibold text-lg focus:outline-none transition-all border-b-2 ${
                        tab === 'usuarios'
                            ? 'bg-white text-blue-900 border-blue-700'
                            : 'bg-gray-200 text-gray-600 border-transparent'
                    }`}
                    onClick={() => setTab('usuarios')}
                >
                    Usuarios registrados
                </button>
                <button
                    className={`px-6 py-2 rounded-t-lg font-semibold text-lg focus:outline-none transition-all border-b-2 ${
                        tab === 'estadisticas'
                            ? 'bg-white text-teal-700 border-teal-600'
                            : 'bg-gray-200 text-gray-600 border-transparent'
                    }`}
                    onClick={() => setTab('estadisticas')}
                >
                    Estadísticas
                </button>
            </div>

            {/* Contenido de la pestaña seleccionada */}
            <section className="container mx-auto px-4 pb-16 flex-1">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {tab === 'usuarios' && (
                        <>
                            <h2 className="text-2xl font-bold mb-6 text-blue-900">Usuarios registrados</h2>
                            <ul className="divide-y divide-gray-200">
                                {users.map(user => (
                                    <li
                                        key={user.id}
                                        className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                                    >
                                        <div>
                                            <span className="font-semibold text-gray-800">{user.username}</span>
                                            <span className="text-gray-500 ml-2">({user.email})</span>
                                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                                                {user.roles.join(', ')}
                                            </span>
                                        </div>
                                        <Link
                                            to={`/admin/usuarios/${user.id}/eventos`}
                                            className="mt-2 md:mt-0 inline-block bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition text-sm font-semibold"
                                        >
                                            Ver eventos
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    {tab === 'estadisticas' && <Statistics />}
                </div>
            </section>
        </div>
    );
};

export default AdminPanel;
