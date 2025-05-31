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

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Mis Eventos</h1>
            {events.length === 0 ? (
                <p>No estás inscrito en ningún evento.</p>
            ) : (
                <ul>
                    {events.map(event => (
                        <li key={event.id}>
                            <strong>{event.title}</strong> - {event.date}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyEvents;
