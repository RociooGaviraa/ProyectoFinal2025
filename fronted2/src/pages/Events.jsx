import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { category } = useParams();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/events${category ? `?category=${category}` : ''}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                const data = await response.json();
                setEvents(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [category]);

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-800"></div>
        </div>
    );

    if (error) return (
        <div className="text-center py-10">
            <p className="text-red-600">Error: {error}</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                {category ? `Eventos de ${category}` : 'Todos los Eventos'}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <img 
                            src={event.image || 'https://picsum.photos/800/400'} 
                            alt={event.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <div className="text-sm text-purple-600 mb-2">
                                {new Date(event.date).toLocaleDateString('es-ES')} · {new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {event.title}
                            </h3>
                            <p className="text-gray-600 mb-4">{event.location}</p>
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    {event.capacity - (event.participants?.length || 0)} plazas disponibles
                                </div>
                                <button 
                                    className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors duration-300"
                                    onClick={() => window.location.href = `/events/${event.id}`}
                                >
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;