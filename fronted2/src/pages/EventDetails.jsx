import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const data = await api.getEventById(id);
                setEvent(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    {error}
                </div>
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Hero con imagen de fondo y tarjeta superpuesta */}
            <div className="relative h-80 w-full flex items-end justify-center bg-gray-200">
                <img
                    src={event.image || 'https://picsum.photos/1200/400'}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
                />
                <div className="relative z-10 w-full max-w-3xl mb-[-3rem]">
                    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{event.title}</h1>
                            <div className="flex items-center gap-3 text-lg text-gray-700">
                                <span className="inline-flex items-center gap-1">
                                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    4.7
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="capitalize">{event.category || 'General'}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="text-gray-500 text-sm">Gastronomía</span>
                            <span className="text-gray-500 text-sm">{event.location || '-'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-6xl mx-auto px-4 mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Columna principal */}
                <div className="md:col-span-2 space-y-8">
                    {/* Detalles del evento */}
                    <div className="bg-white rounded-xl shadow p-8 mb-4">
                        <h2 className="text-xl font-bold mb-4">Detalles del evento</h2>
                        <p className="text-gray-700 mb-6">{event.description || 'Sin descripción.'}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <svg className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Fecha
                                </p>
                                <p className="text-lg font-medium">{event.date ? new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <svg className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                                    Hora
                                </p>
                                <p className="text-lg font-medium">{event.date ? new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <svg className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    Ubicación
                                </p>
                                <p className="text-lg font-medium">{event.location || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                    <svg className="w-5 h-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    Asistentes
                                </p>
                                <p className="text-lg font-medium">0 / {event.capacity || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ubicación y mapa (simulado) */}
                    <div className="bg-white rounded-xl shadow p-8 mb-4">
                        <h2 className="text-xl font-bold mb-4">Ubicación</h2>
                        <div className="bg-gray-100 rounded-lg p-6 text-center text-gray-500 mb-4">
                            <span className="block font-semibold mb-2">Mapa Interactivo</span>
                            <span className="text-sm">Esta es una simulación de mapa para la demo del proyecto. En la implementación final se integraría con Google Maps.</span>
                        </div>
                        <div className="text-gray-700 font-medium">{event.title || '-'}<br />{event.location || '-'}, España</div>
                    </div>

                    {/* Comentarios y valoraciones (simulado) */}
                    <div className="bg-white rounded-xl shadow p-8 mb-4">
                        <h2 className="text-xl font-bold mb-4">Comentarios y valoraciones</h2>
                        <div className="flex items-center mb-4">
                            <span className="text-yellow-400 text-2xl mr-2">★★★★★</span>
                            <span className="font-bold text-lg">4.7</span>
                        </div>
                        <textarea className="w-full border border-gray-300 rounded-md p-2 mb-4" placeholder="Comparte tu experiencia..." rows={3} disabled />
                        <button className="bg-blue-800 text-white px-4 py-2 rounded-md font-semibold cursor-not-allowed" disabled>Publicar comentario</button>
                        <p className="text-gray-500 mt-4">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                    </div>
                </div>

                {/* Columna lateral */}
                <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
                        <span className="text-gray-500 mb-2">Inicia sesión para unirte a este evento</span>
                        <Link to="/login" className="bg-blue-800 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-900 transition w-full text-center">Iniciar sesión</Link>
                    </div>
                    <div className="bg-white rounded-xl shadow p-8">
                        <h3 className="text-lg font-bold mb-2">Organizador</h3>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">JA</div>
                            <div>
                                <p className="font-semibold">Jane Smith</p>
                                <p className="text-yellow-500 flex items-center gap-1 text-sm"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>4.5</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-8">
                        <h3 className="text-lg font-bold mb-2">Comparte este evento</h3>
                        <div className="flex gap-3">
                            <button className="bg-gray-100 p-2 rounded hover:bg-gray-200"><i className="fab fa-facebook-f"></i></button>
                            <button className="bg-gray-100 p-2 rounded hover:bg-gray-200"><i className="fab fa-twitter"></i></button>
                            <button className="bg-gray-100 p-2 rounded hover:bg-gray-200"><i className="fab fa-instagram"></i></button>
                            <button className="bg-gray-100 p-2 rounded hover:bg-gray-200"><i className="fab fa-discord"></i></button>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow p-8">
                        <h3 className="text-lg font-bold mb-2">Eventos relacionados</h3>
                        <p className="text-gray-500">Próximamente eventos similares en esta categoría...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;