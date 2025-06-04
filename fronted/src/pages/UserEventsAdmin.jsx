import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import EventCard from '../components/EventCard';
import EventCardAdmin from '../components/EventCardAdmin';

const UserEventsAdmin = () => {
    const { id } = useParams();
    const [events, setEvents] = useState([]); // Inscritos con asistentes
    const [createdEvents, setCreatedEvents] = useState([]); // Creados con asistentes
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('inscritos');

    useEffect(() => {
        setLoading(true);
        Promise.all([
            api.getUserEvents(id),
            api.getUserCreatedEvents(id),
            api.getUserById(id)
        ]).then(async ([inscritos, creados, userData]) => {
            // Obtener asistentes reales para eventos inscritos
            const inscritosWithAttendees = await Promise.all(inscritos.map(async (event) => {
                try {
                    const detail = await api.getEventById(event.id);
                    return { ...event, attendees: detail.attendeesCount, image: detail.image };
                } catch {
                    return { ...event, attendees: 0 };
                }
            }));
            // Obtener asistentes reales para eventos creados
            const creadosWithAttendees = await Promise.all(creados.map(async (event) => {
                try {
                    const detail = await api.getEventById(event.id);
                    return { ...event, attendees: detail.attendeesCount, image: detail.image };
                } catch {
                    return { ...event, attendees: 0 };
                }
            }));
            setEvents(inscritosWithAttendees);
            setCreatedEvents(creadosWithAttendees);
            setUser(userData);
        }).finally(() => {
            setLoading(false);
            setUserLoading(false);
        });
    }, [id]);

    const handleUnsubscribe = async (eventId) => {
        try {
            await api.adminUnsubscribeUser(eventId, id); // Llama al backend
            // Elimina el evento del estado local para que desaparezca de la vista
            setEvents((prevEvents) => prevEvents.filter(event => event.id !== eventId));
        } catch (error) {
            alert('No se pudo cancelar la suscripción');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await api.deleteEvent(eventId);
            setCreatedEvents((prev) => prev.filter(event => event.id !== eventId));
        } catch (error) {
            alert('No se pudo borrar el evento');
        }
    };

    if (loading || userLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="text-xl text-blue-900 font-semibold">Cargando eventos...</div>
        </div>
    );

    const renderEventCards = (eventList, isAdminTab = false) => (
        eventList.length === 0 ? (
            <div className="text-center text-gray-600 p-4">No hay eventos para mostrar.</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {eventList.map(event =>
                    isAdminTab
                        ? <EventCardAdmin key={event.id} event={event} userId={id} onUnsubscribe={() => handleUnsubscribe(event.id)} />
                        : <EventCardAdmin key={event.id} event={event} onDelete={() => handleDeleteEvent(event.id)} />
                )}
            </div>
        )
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Espacio para header fijo */}
            <div className="h-20" />

            {/* Hero Section */}
            <section className="w-full bg-gradient-to-br from-blue-900 via-teal-800 to-teal-600 text-white py-12 mb-8 shadow-md">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Eventos de {user ? (user.name || user.username || user.email) : ''}
                        </h1>
                        <p className="text-lg mb-2">Lista de eventos en los que participa {user ? (user.name || user.username || user.email) : ''}.</p>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <section className="container mx-auto px-4 pb-16 flex-1">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex gap-2 border-b mb-6">
                        <button
                            className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 'inscritos' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-500 hover:text-blue-900'}`}
                            onClick={() => setActiveTab('inscritos')}
                        >
                            Inscrito ({events.length})
                        </button>
                        <button
                            className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 'creados' ? 'text-blue-900 border-b-2 border-blue-900' : 'text-gray-500 hover:text-blue-900'}`}
                            onClick={() => setActiveTab('creados')}
                        >
                            Creados ({createdEvents.length})
                        </button>
                    </div>
                    {activeTab === 'inscritos'
                        ? renderEventCards(events, true)
                        : renderEventCards(createdEvents, false)
                    }
                </div>
            </section>
        </div>
    );
};

export default UserEventsAdmin;