import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import EventCard from '../components/EventCard';

// Configura el icono por defecto de Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const [isJoined, setIsJoined] = useState(false);
    const [attendeesCount, setAttendeesCount] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);
    const [relatedEvents, setRelatedEvents] = useState([]);
    const [organizer, setOrganizer] = useState(null);

    const fetchEvent = async () => {
        try {
            setLoading(true);
            const data = await api.getEventById(id);
            setEvent(data);
            setIsJoined(data.isJoined);
            setAttendeesCount(data.attendeesCount);
            // Ahora los datos del organizador vienen completos en data.organizer
            if (data.organizer) {
                setOrganizer(data.organizer);
            } else {
                setOrganizer(null);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvent();
        // Cargar eventos relacionados
        const fetchRelated = async () => {
            if (!event || !event.category) return;
            try {
                const all = await api.getEventsByCategory(event.category);
                // Filtra solo los eventos de la misma categoría y que no sean el actual
                setRelatedEvents(all.filter(e => e.id !== event.id && e.category === event.category));
            } catch {}
        };
        fetchRelated();
    }, [id, event?.category]);

    const handleJoin = async () => {
        setActionLoading(true);
        try {
            await api.joinEvent(id);
            setIsJoined(true);
            setAttendeesCount((prev) => prev + 1);
            toast.success('¡Te has inscrito correctamente!');
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'No se pudo inscribir al evento');
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeave = async () => {
        setActionLoading(true);
        try {
            await api.leaveEvent(id);
            setIsJoined(false);
            setAttendeesCount((prev) => prev - 1);
            toast.success('Has cancelado tu asistencia.');
        } catch (err) {
            setError(err.message);
            toast.error(err.message || 'No se pudo cancelar la inscripción');
        } finally {
            setActionLoading(false);
        }
    };

    const handleBuy = async () => {
        setActionLoading(true);
        try {
            // LOG para depuración
            console.log('Intentando comprar. event:', event);
            console.log('stripePriceId enviado:', event.stripePriceId);
            // Llama a tu backend para crear la sesión de Stripe
            const token = localStorage.getItem('jwt_token');
            const user = JSON.parse(localStorage.getItem('user'));
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    priceId: event.stripePriceId,
                    eventId: event.id,
                    userId: user.id
                }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error('No se pudo iniciar el pago.');
            }
        } catch (err) {
            toast.error('Error al conectar con Stripe.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-400"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-50">
                <div className="bg-pink-50 text-pink-700 p-4 rounded-md border border-pink-200">
                    {error}
                </div>
            </div>
        );
    }

    if (!event) return null;

    const plazasDisponibles = event.capacity - attendeesCount;
    const isPaid = event.price && !isNaN(Number(event.price)) && Number(event.price) > 0;

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* HERO */}
            <section className="w-full bg-gradient-to-br from-teal-800 to-teal-500 via-teal-800 to-teal-600 text-white pb-1 pt-8 md:pt-7 mb-12">
                <div className="container mx-auto px-4 flex flex-col items-center justify-center">
                    <div className="max-w-3xl w-full mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-3 md:mb-4 drop-shadow-lg">{event.title}</h1>
                        <div className="relative w-full max-h-72 mx-auto mb-4">
                            <img
                                src={event.image || 'https://picsum.photos/1200/400'}
                                alt={event.title}
                                className="w-full max-h-72 object-cover object-center rounded-2xl shadow-xl border-4 border-white"
                            />
                            <span className="absolute top-4 right-4 flex items-center gap-1 bg-pink-200 text-pink-800 text-xs font-semibold px-4 py-1 rounded-full shadow ring-1 ring-pink-300 backdrop-blur-sm">
                                {event.category || 'General'}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contenido principal */}
            <div className="max-w-6xl mx-auto px-4 mt-0 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Columna principal */}
                <div className="md:col-span-2 space-y-8">
                    {/* Detalles del evento */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-blue-100">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-2">
                            <div className="flex flex-col items-start">
                                <span className="text-blue-700 text-sm flex items-center gap-2 mb-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 22 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Fecha
                                </span>
                                <span className="text-base font-semibold text-blue-900">{event.date ? new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' }) : '-'}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-blue-700 text-sm flex items-center gap-2 mb-1">
                                    🕑 Hora
                                </span>
                                <span className="text-base font-semibold text-blue-900">{event.date ? new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-blue-700 text-sm flex items-center gap-2 mb-1">
                                    💰Precio
                                </span>
                                <span className="text-base font-semibold text-blue-900">{event.price ? `${event.price} €` : 'Gratis'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Ubicación y mapa */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-4 border border-blue-100">
                        <h2 className="text-xl font-bold mb-4 text-blue-900">Ubicación</h2>
                        <div className="mb-4">
                            <div className="text-blue-900 font-medium">{event.location || '-'}, España</div>
                        </div>
                        {event.lat && event.lng ? (
                            <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg mt-4">
                                <MapContainer
                                    center={[Number(event.lat), Number(event.lng)]}
                                    zoom={15}
                                    style={{ height: "100%", width: "100%" }}
                                    scrollWheelZoom={false}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <Marker position={[Number(event.lat), Number(event.lng)]}>
                                        <Popup>
                                            <strong>{event.title}</strong><br />
                                            {event.location}
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </div>
                        ) : (
                            <div className="text-gray-500">No hay coordenadas para este evento.</div>
                        )}
                    </div>

                    {/* Eventos relacionados */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 mb-4 border border-yellow-100">
                        <h3 className="text-lg font-bold mb-2 text-yellow-700">Eventos relacionados</h3>
                        {relatedEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {relatedEvents.map(ev => (
                                    <EventCard key={ev.id} event={ev} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Próximamente eventos similares en esta categoría...</p>
                        )}
                    </div>
                </div>

                {/* Columna lateral */}
                <div className="space-y-8">
                    {user ? (
                        isJoined ? (
                            <div className="text-center border border-green-100 rounded-xl p-6 bg-white/70 shadow-sm">
                                <div className="text-green-700 font-semibold mb-3 flex items-center justify-center gap-2">
                                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Ya estás inscrito en este evento
                                </div>
                                <button
                                    onClick={handleLeave}
                                    className="w-full py-2 px-4 rounded-lg bg-white border border-pink-300 text-pink-700 font-semibold shadow-sm hover:bg-pink-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:ring-offset-2"
                                >
                                    Cancelar asistencia
                                </button>
                            </div>
                        ) : (
                            isPaid ? (
                                <button
                                    onClick={handleBuy}
                                    className="w-full py-2 px-4 rounded-lg bg-blue-800 border border-blue-900 text-white font-semibold shadow hover:bg-blue-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Redirigiendo...' : `Comprar (${event.price} €)`}
                                </button>
                            ) : (
                                <button
                                    onClick={handleJoin}
                                    className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-pink-400 text-white font-semibold shadow hover:from-blue-600 hover:to-pink-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2"
                                >
                                    Unirse al evento
                                </button>
                            )
                        )
                    ) : (
                        <div className="bg-white/90 rounded-xl shadow p-8 flex flex-col items-center border border-pink-100">
                            <span className="text-pink-600 mb-2 font-medium">Inicia sesión para unirte a este evento</span>
                            <Link to="/login" className="w-full py-2 px-4 rounded-lg bg-blue-800 border border-blue-900 text-white font-semibold shadow hover:bg-blue-900 transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2">Iniciar sesión</Link>
                        </div>
                    )}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
                        <h3 className="text-lg font-bold mb-2 text-blue-900">Organizador</h3>
                        {organizer ? (
                            <div className="flex items-center gap-3">
                                {organizer.photo ? (
                                    <img src={organizer.photo} alt={organizer.name} className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                        {organizer.name?.[0]}{organizer.surname?.[0]}
                                    </div>
                                )}
                                <div>
                                    <p className="font-semibold">{organizer.name} {organizer.surname}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">No disponible</div>
                        )}
                    </div>
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-yellow-100">
                        <h3 className="text-lg font-bold mb-4 text-yellow-700">Comparte este evento</h3>
                        <div className="flex gap-4 justify-center mt-2">
                            {/* Twitter */}
                            <a
                                href="https://x.com/?lang=es"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-blue-100 transition flex items-center justify-center text-2xl text-blue-700"
                                title="Compartir en Twitter"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                                    <path d="M22.46 5.924c-.793.352-1.645.59-2.54.698a4.48 4.48 0 001.963-2.475 8.94 8.94 0 01-2.828 1.082 4.48 4.48 0 00-7.635 4.086A12.72 12.72 0 013.11 4.86a4.48 4.48 0 001.39 5.976 4.45 4.45 0 01-2.03-.56v.057a4.48 4.48 0 003.6 4.393 4.48 4.48 0 01-2.025.077 4.48 4.48 0 004.184 3.11A8.98 8.98 0 012 19.54a12.67 12.67 0 006.88 2.02c8.26 0 12.78-6.84 12.78-12.77 0-.19-.01-.38-.02-.57A9.22 9.22 0 0024 4.59a8.93 8.93 0 01-2.54.698z" />
                                </svg>
                            </a>
                            {/* Facebook */}
                            <a
                                href="https://www.facebook.com/?locale=es_ES"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-blue-100 transition flex items-center justify-center text-2xl text-blue-700"
                                title="Compartir en Facebook"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-blue-100 transition flex items-center justify-center text-2xl text-blue-700"
                                title="Compartir en Instagram"
                            >
                                <img src="https://cdn-icons-png.flaticon.com/512/5968/5968776.png" alt="Instagram" className="w-9 h-7 object-contain" />

                            </a>
                            {/* TikTok */}
                            <a
                                href="https://www.tiktok.com/es/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white border border-gray-200 rounded-xl p-4 hover:bg-blue-100 transition flex items-center justify-center text-2xl text-blue-700"
                                title="Compartir en TikTok"
                            >
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/3046/3046122.png"
                                    alt="TikTok"
                                    className="w-7 h-7 object-contain"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;