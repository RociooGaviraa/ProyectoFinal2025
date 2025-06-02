import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const eventCategories = [
    {
        type: 'conference',
        title: 'Conferences',
        description: 'Professional gatherings and industry events',
        icon: '🎤'
    },
    {
        type: 'workshop',
        title: 'Workshops',
        description: 'Hands-on learning and skill development sessions',
        icon: '🛠️'
    },
    {
        type: 'seminar',
        title: 'Seminars',
        description: 'Educational presentations and discussions',
        icon: '📚'
    },
    {
        type: 'networking',
        title: 'Networking',
        description: 'Connect with professionals in your field',
        icon: '🤝'
    },
    {
        type: 'cultural',
        title: 'Cultural Events',
        description: 'Art, music, and cultural celebrations',
        icon: '🎨'
    },
    {
        type: 'sports',
        title: 'Sports Events',
        description: 'Athletic competitions and activities',
        icon: '⚽'
    }
];

// Icono por defecto para los marcadores
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Simula coordenadas si no tienes en tus eventos
const getEventPosition = (event, idx) => {
  if (event.lat && event.lng) {
    return [Number(event.lat), Number(event.lng)];
  }
  // Si no tiene, simula posiciones en Granada:
  const baseLat = 37.1773;
  const baseLng = -3.5986;
  return [baseLat + 0.01 * idx, baseLng + 0.01 * idx];
};

// Componente auxiliar para ajustar el mapa a los eventos
const FitBoundsToEvents = ({ events }) => {
  const map = useMap();
  useEffect(() => {
    if (events.length === 0) return;
    const bounds = events
      .filter(ev => ev.lat && ev.lng)
      .map(ev => [ev.lat, ev.lng]);
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [events, map]);
  return null;
};

const Home = () => {
    const { user } = useAuth();
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                let events = await api.getEvents();
                if (Array.isArray(events) && Array.isArray(events[0])) {
                    events = events.flat();
                }
                if (!Array.isArray(events)) {
                    setError('Formato de datos incorrecto recibido del servidor.');
                    return;
                }
                const validEvents = events.filter(event => event && typeof event === 'object' && event.id);
                setAllEvents(validEvents);
                const featured = validEvents.length > 3 
                    ? validEvents.sort(() => 0.5 - Math.random()).slice(0, 3) 
                    : validEvents;
                setFeaturedEvents(featured);
                setError(null);
            } catch (err) {
                setError('No se pudieron cargar los eventos. Por favor, inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    // Antes de renderizar el mapa
    console.log('Eventos en el mapa:', allEvents.map(ev => ({
      id: ev.id,
      title: ev.title,
      lat: ev.lat,
      lng: ev.lng
    })));

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            

            {/* Espacio para header fijo */}
            <div className="h-20" />

            {/* Hero Section */}
            <section className="w-full bg-gradient-to-br from-blue-900 via-teal-800 to-teal-600 text-white py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            Descubre, Conecta, Experimenta
                        </h1>
                        <p className="text-xl mb-10">
                            Encuentra los mejores eventos cerca de ti y conecta con personas que comparten tus intereses.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/events" className="bg-white text-blue-900 font-semibold px-6 py-3 rounded-md hover:bg-gray-100 transition">
                                Explorar Eventos
                            </Link>
                            <Link to="/create-event" className="bg-transparent border-2 border-white text-white font-semibold px-6 py-3 rounded-md hover:bg-white/10 transition">
                                Crear Evento
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Events Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Eventos Destacados</h2>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 p-4 bg-red-100 rounded-lg">
                            {error}
                        </div>
                    ) : featuredEvents.length === 0 ? (
                        <div className="text-center text-gray-600 p-4">
                            No hay eventos disponibles en este momento.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredEvents.map(event => (
                                <div key={event.id || Math.random()} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                                    <div className="relative">
                                        <img 
                                            src={event.image || 'https://picsum.photos/800/400?random=' + (event.id || Math.random())} 
                                            alt={event.title || 'Event'} 
                                            className="w-full h-48 object-cover" 
                                        />
                                        <span className="absolute top-4 right-4 bg-blue-800 text-white text-sm font-semibold px-3 py-1 rounded-full">
                                            {event.category || 'General'}
                                        </span>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold mb-2">{event.title || 'Sin título'}</h3>
                                        <div className="flex items-center text-gray-600 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{event.date ? new Date(event.date).toLocaleString('es-ES', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'Fecha no disponible'}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="text-gray-600 text-sm">
                                                Capacidad: {event.capacity}
                                            </div>
                                        </div>
                                        <Link to={`/events/${event.id}`} className="block text-center mt-auto bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition">
                                            Ver detalles
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="text-center mt-10">
                        <Link to="/events" className="inline-block bg-blue-800 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900 transition">
                            Ver todos los eventos
                        </Link>
                    </div>
                </div>
            </section>

            {/* Map & Beneficios Section */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Descubre Eventos Cercanos</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Mapa oculto */}
                        <div className="lg:col-span-2 bg-gray-200 rounded-lg h-96 flex items-center justify-center" style={{ display: 'none' }} />
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h3 className="text-2xl font-bold mb-6">¿Por qué unirte a EventHorizon?</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500 flex items-center justify-center text-white mr-3">✓</div>
                                    <p>Descubre eventos que coincidan con tus intereses y aficiones</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500 flex items-center justify-center text-white mr-3">✓</div>
                                    <p>Conoce a personas con gustos similares en tu ciudad</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500 flex items-center justify-center text-white mr-3">✓</div>
                                    <p>Crea tus propios eventos y construye una comunidad</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-teal-500 flex items-center justify-center text-white mr-3">✓</div>
                                    <p>Sistema de valoraciones para encontrar los mejores eventos</p>
                                </li>
                            </ul>
                            <Link to="/register" className="block text-center mt-8 bg-blue-800 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-900 transition w-full">
                                Únete ahora
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map of Nearby Events */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Mapa de Eventos Cercanos</h2>
                    <div className="w-full h-96 rounded-lg overflow-hidden shadow-lg">
                        <MapContainer center={[37.1773, -3.5986]} zoom={12} style={{ height: "100%", width: "100%" }}>
                            <FitBoundsToEvents events={allEvents} />
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {allEvents.map((event, idx) => (
                                <Marker key={event.id} position={getEventPosition(event, idx)}>
                                    <Popup>
                                        <strong>{event.title}</strong><br />
                                        {event.location}
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-4">EventHorizon</h3>
                            <p className="text-gray-400">
                                Conectando personas a través de experiencias compartidas.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Enlaces rápidos</h3>
                            <ul className="space-y-2">
                                <li><Link to="/events" className="text-gray-400 hover:text-white transition">Eventos</Link></li>
                                <li><Link to="/map" className="text-gray-400 hover:text-white transition">Mapa</Link></li>
                                <li><Link to="/about" className="text-gray-400 hover:text-white transition">Sobre nosotros</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Contacto</h3>
                            <p className="text-gray-400 mb-2">info@eventhorizon.com</p>
                            <p className="text-gray-400">+34 123 456 789</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>© 2025 EventHorizon. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;