import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

const UserEventsAdmin = () => {
    const { id } = useParams();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getUserEvents(id).then(setEvents).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div>Cargando eventos...</div>;

    return (
        <div>
            <h1>Eventos en los que participa el usuario</h1>
            <ul>
                {events.map(event => (
                    <li key={event.id}>
                        {event.title} - {event.date} - {event.location}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserEventsAdmin;