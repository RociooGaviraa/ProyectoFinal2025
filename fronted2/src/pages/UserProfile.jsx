import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import EventCard from '../components/EventCard';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [userEvents, setUserEvents] = useState([]);
    const [userEventsWithAttendees, setUserEventsWithAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        surname: '',
        birthDate: '',
    });
    const [activeTab, setActiveTab] = useState('inscritos');
    const [myCreatedEvents, setMyCreatedEvents] = useState([]);
    const [myCreatedEventsWithAttendees, setMyCreatedEventsWithAttendees] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [editingEventId, setEditingEventId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    // Simulación de datos adicionales para el diseño
    const intereses = ['Música', 'Arte', 'Deportes'];
    const rating = 5.0;
    const eventosOrganizados = 0;
    const eventosAsistidos = 0;
    const fechaRegistro = profile?.createdAt || 'mayo de 2025'; // Simulado
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
        fetchFavorites();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const profileData = await api.getUserProfile();
            setProfile(profileData);
            setFormData({
                username: profileData.username || "",
                email: profileData.email || "",
                name: profileData.name || "",
                surname: profileData.surname || "",
                birthDate: profileData.birthDate ? profileData.birthDate.slice(0, 10) : "",
            });
            const eventsData = await api.getUserEvents(profileData.id);
            // Obtener asistentes reales para eventos inscritos
            const eventsWithAttendees = await Promise.all(eventsData.map(async (event) => {
                try {
                    const detail = await api.getEventById(event.id);
                    return { ...event, attendees: detail.attendeesCount, image: detail.image, category: detail.category };
                } catch {
                    return { ...event, attendees: 0 };
                }
            }));
            setUserEvents(eventsData);
            setUserEventsWithAttendees(eventsWithAttendees);

            // Llama al endpoint correcto para eventos creados
            const createdEvents = await api.getMyCreatedEvents();
            // Obtener asistentes reales para eventos creados y la imagen
            const createdWithAttendees = await Promise.all(createdEvents.map(async (event) => {
                try {
                    const detail = await api.getEventById(event.id);
                    return { ...event, attendees: detail.attendeesCount, image: detail.image };
                } catch {
                    return { ...event, attendees: 0 };
                }
            }));
            setMyCreatedEvents(createdEvents);
            setMyCreatedEventsWithAttendees(createdWithAttendees);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        try {
            const favs = await api.getFavorites();
            // Para cada favorito, obtener asistentes reales
            const favsWithAttendees = await Promise.all(favs.map(async (event) => {
                try {
                    const detail = await api.getEventById(event.id);
                    return { ...event, attendees: detail.attendeesCount };
                } catch {
                    return { ...event, attendees: 0 };
                }
            }));
            setFavorites(favsWithAttendees);
        } catch (err) {
            // Puedes mostrar un error si quieres
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.updateUserProfile(formData);
            setProfile({ ...profile, ...formData });
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }
    if (!profile) {
        return null;
    }

    // Avatar con iniciales
    const getInitials = (name, surname, username) => {
        if (name && surname) return name[0] + surname[0];
        if (profile.username) return profile.username.slice(0, 2).toUpperCase();
        return 'US';
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}
                {/* Card principal */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="flex items-center gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-700">
                            {getInitials(profile.name, profile.surname, profile.username)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl font-bold text-gray-900">{profile.name} {profile.surname}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 12A4 4 0 1 1 8 12a4 4 0 0 1 8 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14v7m0 0H9m3 0h3" /></svg>
                                <span>{profile.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm gap-2 mt-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10m-9 4h6" /></svg>
                                <span>Miembro desde {fechaRegistro}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col items-end">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-100 transition font-medium"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 1 1 2.828 2.828L11.828 15.828a4 4 0 0 1-1.414.828l-4 1a1 1 0 0 1-1.263-1.263l1-4a4 4 0 0 1 .828-1.414Z" /></svg>
                            Editar Perfil
                        </button>
                    </div>
                </div>
                {/* Estadísticas */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center justify-between mb-6">
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-3xl font-bold text-gray-900">{rating}</span>
                        <span className="text-gray-500 text-sm">Calificación</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-3xl font-bold text-green-600">{eventosOrganizados}</span>
                        <span className="text-gray-500 text-sm">Eventos Organizados</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-3xl font-bold text-gray-900">{eventosAsistidos}</span>
                        <span className="text-gray-500 text-sm">Eventos Asistidos</span>
                    </div>
                </div>
                {/* Intereses */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <h3 className="text-gray-800 font-semibold mb-2">Intereses</h3>
                    <div className="flex flex-wrap gap-2">
                        {intereses.map((interes, idx) => (
                            <span key={idx} className="bg-cyan-700 text-white px-3 py-1 rounded-full text-sm font-medium">{interes}</span>
                        ))}
                    </div>
                </div>
                {/* Tabs y eventos */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex gap-2 border-b mb-4">
                        <button
                            className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 'inscritos' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-500 hover:text-indigo-700'}`}
                            onClick={() => setActiveTab('inscritos')}
                        >
                            Eventos Inscritos ({userEvents.length})
                        </button>
                        <button
                            className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 'mis' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-500 hover:text-indigo-700'}`}
                            onClick={() => setActiveTab('mis')}
                        >
                            Mis Eventos ({myCreatedEvents.length})
                        </button>
                        <button
                            className={`px-4 py-2 font-medium focus:outline-none ${activeTab === 'favoritos' ? 'text-indigo-700 border-b-2 border-indigo-700' : 'text-gray-500 hover:text-indigo-700'}`}
                            onClick={() => setActiveTab('favoritos')}
                        >
                            Favoritos ({favorites.length})
                        </button>
                    </div>
                    {activeTab === 'inscritos' && (
                        <>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Eventos en los que estás inscrito</h2>
                            {userEventsWithAttendees.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {userEventsWithAttendees.map(event => (
                                        <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden relative transition hover:shadow-lg">
                                            {/* Imagen */}
                                            <img
                                                src={event.image || "/no-image.png"}
                                                alt={event.title}
                                                className="w-full h-44 object-cover"
                                            />
                                            {/* Categoría */}
                                            <span className="absolute top-4 right-4 bg-gray-800 text-white text-xs px-3 py-0.5 rounded-full">
                                                {event.category?.name || event.category || "Sin categoría"}
                                            </span>
                                            <div className="p-5 space-y-3">
                                                {/* Título */}
                                                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                                                {/* Fecha y ubicación */}
                                                <div className="flex items-center text-sm text-gray-500 gap-2">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    {new Date(event.date).toLocaleDateString("es-ES", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}{" "}
                                                    -{" "}
                                                    {new Date(event.date).toLocaleTimeString("es-ES", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 gap-2">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z"
                                                        />
                                                    </svg>
                                                    {event.location}
                                                </div>
                                                {/* Botón cancelar suscripción */}
                                                <button
                                                    className="block w-full text-center mt-2 bg-red-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-600 transition"
                                                    onClick={async () => {
                                                        try {
                                                            await api.leaveEvent(event.id);
                                                            setUserEventsWithAttendees(prev => prev.filter(e => e.id !== event.id));
                                                        } catch {
                                                            alert('No se pudo cancelar la suscripción');
                                                        }
                                                    }}
                                                >
                                                    Cancelar suscripción
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 mb-4">No te has inscrito en ningún evento aún.</p>
                                    <button className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition">Explorar Eventos</button>
                                </div>
                            )}
                        </>
                    )}
                    {activeTab === 'mis' && (
                        <>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Mis eventos creados</h2>
                            {myCreatedEventsWithAttendees.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {myCreatedEventsWithAttendees.map(event => (
                                        <div key={event.id} className="bg-white rounded-2xl shadow-md overflow-hidden relative transition hover:shadow-lg">
                                            {/* Imagen */}
                                            <img
                                                src={event.image || "/no-image.png"}
                                                alt={event.title}
                                                className="w-full h-44 object-cover"
                                            />
                                            {/* Categoría */}
                                            <span className="absolute top-4 right-4 bg-gray-800 text-white text-xs px-3 py-0.5 rounded-full">
                                                {event.category?.name || event.category || "Sin categoría"}
                                            </span>
                                            <div className="p-5 space-y-3">
                                                {/* Título */}
                                                <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                                                {/* Fecha y ubicación */}
                                                <div className="flex items-center text-sm text-gray-500 gap-2">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M8 7V3m8 4V3m-9 8h10m-12 8h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    {new Date(event.date).toLocaleDateString("es-ES", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}{" "}
                                                    -{" "}
                                                    {new Date(event.date).toLocaleTimeString("es-ES", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 gap-2">
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M17.657 16.657L13.414 12.414a4 4 0 10-1.414 1.414l4.243 4.243a1 1 0 001.414-1.414z"
                                                        />
                                                    </svg>
                                                    {event.location}
                                                </div>
                                                {/* Botón o formulario de edición */}
                                                {editingEventId === event.id ? (
                                                    <form
                                                        onSubmit={async (e) => {
                                                            e.preventDefault();
                                                            try {
                                                                await api.updateEvent(event.id, editFormData);
                                                                setEditingEventId(null);
                                                                fetchUserData();
                                                            } catch {
                                                                alert('No se pudo actualizar el evento');
                                                            }
                                                        }}
                                                        className="space-y-2"
                                                    >
                                                        <input
                                                            className="w-full border rounded p-2"
                                                            value={editFormData.title || ""}
                                                            onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                                                            placeholder="Título"
                                                        />
                                                        <textarea
                                                            className="w-full border rounded p-2"
                                                            value={editFormData.description || ""}
                                                            onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                                                            placeholder="Descripción"
                                                        />
                                                        <input
                                                            className="w-full border rounded p-2"
                                                            type="datetime-local"
                                                            value={editFormData.date || ""}
                                                            onChange={e => setEditFormData({ ...editFormData, date: e.target.value })}
                                                            placeholder="Fecha y hora"
                                                        />
                                                        <input
                                                            className="w-full border rounded p-2"
                                                            value={editFormData.location || ""}
                                                            onChange={e => setEditFormData({ ...editFormData, location: e.target.value })}
                                                            placeholder="Ubicación"
                                                        />
                                                        <input
                                                            className="w-full border rounded p-2"
                                                            value={editFormData.image || ""}
                                                            onChange={e => setEditFormData({ ...editFormData, image: e.target.value })}
                                                            placeholder="URL de la imagen"
                                                        />
                                                        <input
                                                            className="w-full border rounded p-2"
                                                            value={editFormData.category || ""}
                                                            onChange={e => setEditFormData({ ...editFormData, category: e.target.value })}
                                                            placeholder="Categoría (ID o nombre)"
                                                        />
                                                        <input
                                                            className="w-full border rounded p-2"
                                                            type="number"
                                                            value={editFormData.capacity || ""}
                                                            onChange={e => setEditFormData({ ...editFormData, capacity: e.target.value })}
                                                            placeholder="Capacidad"
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="block w-full text-center mt-2 bg-green-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-green-600 transition"
                                                        >
                                                            Guardar cambios
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="block w-full text-center mt-2 bg-gray-300 text-gray-800 text-sm font-medium py-2 rounded-lg hover:bg-gray-400 transition"
                                                            onClick={() => setEditingEventId(null)}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <button
                                                        className="block w-full text-center mt-2 bg-blue-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-600 transition"
                                                        onClick={() => {
                                                            setEditingEventId(event.id);
                                                            setEditFormData({
                                                                title: event.title || "",
                                                                description: event.description || "",
                                                                date: event.date ? new Date(event.date).toISOString().slice(0,16) : "",
                                                                location: event.location || "",
                                                                image: event.image || "",
                                                                category: event.category?.id || event.category || "",
                                                                capacity: event.capacity || "",
                                                            });
                                                        }}
                                                    >
                                                        Editar evento
                                                    </button>
                                                )}
                                                <button
                                                    className="block w-full text-center mt-2 bg-gray-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-600 transition"
                                                    onClick={() => navigate(`/events/${event.id}`)}
                                                >
                                                    Ver detalles
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 mb-4">No has creado ningún evento aún.</p>
                                    <button 
                                        className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition"
                                        onClick={() => navigate('/events/create')}
                                    >
                                        Crear Evento
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    {activeTab === 'favoritos' && (
                        <>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Mis eventos favoritos</h2>
                            {favorites.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {favorites.map(event => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 mb-4">No tienes eventos favoritos aún.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
                {/* Modal de edición */}
                {isEditing && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Apellidos</label>
                                    <input
                                        type="text"
                                        value={formData.surname}
                                        onChange={e => setFormData({ ...formData, surname: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Fecha de nacimiento</label>
                                    <input
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                    >
                                        Guardar cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {editingEventId && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Editar Evento</h2>
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        await api.updateEvent(editingEventId, editFormData);
                                        setEditingEventId(null);
                                        fetchUserData();
                                    } catch {
                                        alert('No se pudo actualizar el evento');
                                    }
                                }}
                                className="space-y-2"
                            >
                                <input
                                    className="w-full border rounded p-2"
                                    value={editFormData.title || ""}
                                    onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                                    placeholder="Título"
                                />
                                <textarea
                                    className="w-full border rounded p-2"
                                    value={editFormData.description || ""}
                                    onChange={e => setEditFormData({ ...editFormData, description: e.target.value })}
                                    placeholder="Descripción"
                                />
                                <input
                                    className="w-full border rounded p-2"
                                    type="datetime-local"
                                    value={editFormData.date || ""}
                                    onChange={e => setEditFormData({ ...editFormData, date: e.target.value })}
                                    placeholder="Fecha y hora"
                                />
                                <input
                                    className="w-full border rounded p-2"
                                    value={editFormData.location || ""}
                                    onChange={e => setEditFormData({ ...editFormData, location: e.target.value })}
                                    placeholder="Ubicación"
                                />
                                <input
                                    className="w-full border rounded p-2"
                                    value={editFormData.image || ""}
                                    onChange={e => setEditFormData({ ...editFormData, image: e.target.value })}
                                    placeholder="URL de la imagen"
                                />
                                <input
                                    className="w-full border rounded p-2"
                                    value={editFormData.category || ""}
                                    onChange={e => setEditFormData({ ...editFormData, category: e.target.value })}
                                    placeholder="Categoría (ID o nombre)"
                                />
                                <input
                                    className="w-full border rounded p-2"
                                    type="number"
                                    value={editFormData.capacity || ""}
                                    onChange={e => setEditFormData({ ...editFormData, capacity: e.target.value })}
                                    placeholder="Capacidad"
                                />
                                <button
                                    type="submit"
                                    className="block w-full text-center mt-2 bg-green-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-green-600 transition"
                                >
                                    Guardar cambios
                                </button>
                                <button
                                    type="button"
                                    className="block w-full text-center mt-2 bg-gray-300 text-gray-800 text-sm font-medium py-2 rounded-lg hover:bg-gray-400 transition"
                                    onClick={() => setEditingEventId(null)}
                                >
                                    Cancelar
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;