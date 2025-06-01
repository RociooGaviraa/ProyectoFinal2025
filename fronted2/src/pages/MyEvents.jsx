import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

const MyEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                const data = await api.getMyEvents();
                setEvents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMyEvents();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Eventos</h1>
                {loading && (
                    <div className="bg-blue-50 text-blue-700 p-4 rounded-md mb-6">Cargando...</div>
                )}
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">Error: {error}</div>
                )}
                {!loading && !error && (
                    <>
                        {events.length === 0 ? (
                            <div className="bg-white shadow rounded-lg p-6 text-center text-gray-600">
                                No estás inscrito en ningún evento.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {events.map(event => (
                                    <div key={event.id} className="bg-white shadow rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <div className="text-lg font-semibold text-gray-800">{event.title}</div>
                                            <div className="text-sm text-gray-500 mt-1">{event.date}</div>
                                        </div>
                                        {/* Puedes agregar más detalles aquí si lo deseas */}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default MyEvents;
