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
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(null);
    const [hasRated, setHasRated] = useState(false);

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

    const fetchReviews = async () => {
        try {
            const data = await api.getEventReviews(id);
            setReviews(data);
        } catch (err) {
            setReviews([]);
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
        fetchReviews();
        // eslint-disable-next-line
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
            // Llama a tu backend para crear la sesión de Stripe Checkout
            const token = localStorage.getItem('jwt_token');
            const response = await fetch(`/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    priceId: event.stripePriceId, // este campo debe estar en tu evento
                    eventId: event.id
                }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; // Redirige a Stripe Checkout
            } else {
                toast.error('No se pudo iniciar el pago.');
            }
        } catch (err) {
            toast.error('Error al conectar con Stripe.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleStarClick = (star) => {
        setReviewRating(star);
        setHasRated(true);
    };

    const handleStarMouseEnter = (star) => {
        if (!hasRated) setHoverRating(star);
    };

    const handleStarMouseLeave = () => {
        if (!hasRated) setHoverRating(null);
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewLoading(true);
        try {
            await api.createEventReview(id, {
                comment: reviewText,
                rating: reviewRating
            });
            setReviewText('');
            setReviewRating(5);
            setHasRated(false);
            fetchReviews(); // Recarga las reseñas
            toast.success('¡Comentario publicado!');
        } catch (err) {
            toast.error('No se pudo publicar el comentario');
        } finally {
            setReviewLoading(false);
        }
    };

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

    const plazasDisponibles = event.capacity - attendeesCount;
    const isPaid = event.price && !isNaN(Number(event.price)) && Number(event.price) > 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* HERO VISUAL IGUAL QUE EN LA FOTO */}
            <div className="relative h-80 w-full flex items-end justify-center bg-gray-200 mb-12">
                <img
                    src={event.image || 'https://picsum.photos/1200/400'}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
                />
                <div className="relative z-10 w-full max-w-2xl mb-[-3rem]">
                    <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-2 items-start">
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
                </div>
            </div>

            {/* Contenido principal */}
            <div className="max-w-6xl mx-auto px-4 mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Columna principal */}
                <div className="md:col-span-2 space-y-8">
                    {/* Detalles del evento en formato moderno */}
                    <div className="bg-white rounded-xl shadow p-8 mb-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-2">
                            <div className="flex flex-col items-start">
                                <span className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 22 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Fecha
                                </span>
                                <span className="text-base font-semibold text-gray-900">{event.date ? new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric' }) : '-'}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                                    🕑 Hora
                                </span>
                                <span className="text-base font-semibold text-gray-900">{event.date ? new Date(event.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '-'}</span>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                                    💰Precio
                                </span>
                                <span className="text-base font-semibold text-gray-900">{event.price ? `${event.price} €` : 'Gratis'}</span>
                            </div>

                            {/* <div className="flex flex-col items-start">
                                <span className="text-gray-500 text-sm flex items-center gap-2 mb-1">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                    Asistentes
                                </span>
                                <span className="text-base font-semibold text-gray-900">{attendeesCount} / {event.capacity || '-'}</span>
                            </div> */}
                        </div>
                    </div>

                    {/* Ubicación y mapa (simulado) */}
                    <div className="bg-white rounded-xl shadow p-8 mb-4">
                        <h2 className="text-xl font-bold mb-4">Ubicación</h2>
                        <div className="mb-4">
                            <div className="text-gray-700 font-medium">{event.location || '-'}, España</div>
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

                    {/* Comentarios y valoraciones (simulado) */}
                    <div className="bg-white rounded-xl shadow p-8 mb-4">
                        <h2 className="text-xl font-bold mb-4">Comentarios y valoraciones</h2>
                        <div className="flex items-center mb-4">
                            <span className="text-yellow-400 text-2xl mr-2">
                                {'★'.repeat(Math.round(
                                    reviews.length ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 5
                                ))}
                                {'☆'.repeat(5 - Math.round(
                                    reviews.length ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 5
                                ))}
                            </span>
                            <span className="font-bold text-lg">
                                {reviews.length
                                    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                                    : '5.0'}
                            </span>
                        </div>
                        {user ? (
                            <form onSubmit={handleReviewSubmit}>
                                <div className="flex items-center mb-2">
                                    {[1,2,3,4,5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => handleStarClick(star)}
                                            onMouseEnter={() => handleStarMouseEnter(star)}
                                            onMouseLeave={handleStarMouseLeave}
                                            className={
                                                ((hoverRating !== null ? star <= hoverRating : star <= reviewRating)
                                                    ? 'text-yellow-400'
                                                    : 'text-gray-300') +
                                                ' text-2xl transition-colors duration-150 focus:outline-none'
                                            }
                                            style={{ cursor: 'pointer' }}
                                            aria-label={`Valorar con ${star} estrella${star > 1 ? 's' : ''}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    className="w-full border border-gray-300 rounded-md p-2 mb-4"
                                    placeholder="Comparte tu experiencia..."
                                    rows={3}
                                    value={reviewText}
                                    onChange={e => setReviewText(e.target.value)}
                                    required
                                />
                                <button
                                    className="bg-blue-800 text-white px-4 py-2 rounded-md font-semibold"
                                    type="submit"
                                    disabled={reviewLoading}
                                >
                                    {reviewLoading ? 'Publicando...' : 'Publicar comentario'}
                                </button>
                            </form>
                        ) : (
                            <p className="text-gray-500 mb-2">Inicia sesión para dejar un comentario.</p>
                        )}
                        <div className="mt-4">
                            {reviews.length === 0 ? (
                                <p className="text-gray-500">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                            ) : (
                                reviews.map((r, idx) => (
                                    <div key={idx} className="border-b py-4 flex items-start justify-between">
                                        <div>
                                            <div className="font-semibold">{r.user || 'Usuario'}</div>
                                            <div className="text-xs text-gray-400">{r.createdAt?.split(' ')[0]}</div>
                                            <div>{r.comment}</div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[1,2,3,4,5].map(star => (
                                                <span key={star} className={star <= r.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                            ))}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Columna lateral */}
                <div className="space-y-8">
                    {user ? (
                        isJoined ? (
                            <div style={{ textAlign: 'center', border: '1px solid #e0e0e0', borderRadius: 8, padding: 16 }}>
                                <div style={{ color: 'green', fontWeight: 'bold', marginBottom: 12 }}>
                                    ¡Ya estás inscrito en este evento!
                                </div>
                                <button
                                    onClick={handleLeave}
                                    style={{
                                        background: '#f5f5f5',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '10px 24px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar asistencia
                                </button>
                            </div>
                        ) : (
                            isPaid ? (
                                <button
                                    onClick={handleBuy}
                                    className="bg-green-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-green-700 transition w-full text-center"
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Redirigiendo...' : `Comprar (${event.price} €)`}
                                </button>
                            ) : (
                                <button
                                    onClick={handleJoin}
                                    style={{
                                        background: '#1976d2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 6,
                                        padding: '10px 24px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Unirse al evento
                                </button>
                            )
                        )
                    ) : (
                        <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
                            <span className="text-gray-500 mb-2">Inicia sesión para unirte a este evento</span>
                            <Link to="/login" className="bg-blue-800 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-900 transition w-full text-center">Iniciar sesión</Link>
                        </div>
                    )}
                    <div className="bg-white rounded-xl shadow p-8">
                        <h3 className="text-lg font-bold mb-2">Organizador</h3>
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
                                    <p className="text-yellow-500 flex items-center gap-1 text-sm">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        4.5
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-gray-500">No disponible</div>
                        )}
                    </div>
                    <div className="bg-white rounded-xl shadow p-8">
                        <h3 className="text-lg font-bold mb-4">Comparte este evento</h3>
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
                    <div className="bg-white rounded-xl shadow p-8">
                        <h3 className="text-lg font-bold mb-2">Eventos relacionados</h3>
                        {relatedEvents.length > 0 ? (
                            <div className="space-y-3">
                                {relatedEvents.map(ev => (
                                    <Link
                                        key={ev.id}
                                        to={`/events/${ev.id}`}
                                        className="flex items-center justify-between border border-gray-100 rounded-lg p-3 hover:bg-gray-50 transition cursor-pointer gap-2"
                                    >
                                        <span className="font-semibold text-gray-800 truncate overflow-hidden whitespace-nowrap max-w-xs block">{ev.title}</span>
                                        {ev.state && (
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full shadow-lg z-10
                                                ${ev.state === "Finalizado" ? "bg-red-600 text-white" : ""}
                                                ${ev.state === "En proceso" ? "bg-gray-500 text-white" : ""}
                                                ${ev.state === "Abierto" ? "bg-blue-600 text-white" : ""}
                                            `}>
                                                {ev.state}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Próximamente eventos similares en esta categoría...</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;