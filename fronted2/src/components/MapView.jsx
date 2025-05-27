import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { truncateText, formatDate } from '../lib/utils';

const MapView = ({ events }) => {
  const mapContainerRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [currentMarkers, setCurrentMarkers] = useState([]);
  const [activeEventId, setActiveEventId] = useState(null);
  
  // Simulación de la API de Google Maps
  useEffect(() => {
    // Este código se reemplazaría por la integración real con Google Maps
    const loadMap = () => {
      setTimeout(() => {
        if (mapContainerRef.current) {
          setMapLoaded(true);
          initializeMap();
        }
      }, 500);
    };
    
    loadMap();
  }, []);
  
  const initializeMap = () => {
    // Simulación de inicialización del mapa
    // Esto sería reemplazado por la API real de Google Maps
    console.log('Mapa inicializado');
    setMap({});
  };
  
  // Simulación de marcadores en el mapa
  useEffect(() => {
    if (map && events.length) {
      // Limpiar marcadores anteriores
      currentMarkers.forEach(marker => {
        // En una implementación real: marker.setMap(null)
      });
      
      // Añadir nuevos marcadores
      const newMarkers = [];
      events.forEach(event => {
        // En una implementación real se crearían marcadores en el mapa
        newMarkers.push({
          id: event.id,
          position: event.coordinates
        });
      });
      
      setCurrentMarkers(newMarkers);
    }
  }, [map, events]);
  
  return (
    <div className="h-full relative">
      {/* Simulación del mapa */}
      <div 
        ref={mapContainerRef}
        className="w-full h-full bg-gray-100 rounded-lg overflow-hidden"
        style={{ 
          backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=37.0902,-95.7129&zoom=4&size=1200x800&key=YOUR_API_KEY_HERE')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {!mapLoaded && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}
      </div>
      
      {/* Eventos mostrados en el mapa */}
      <div className="absolute bottom-4 left-4 right-4 px-4 py-4 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">Eventos en el mapa</h3>
        <div className="space-y-3">
          {events.slice(0, 5).map(event => (
            <Link 
              key={event.id} 
              to={`/events/${event.id}`}
              className={`block p-3 rounded-lg transition-colors ${
                activeEventId === event.id 
                  ? 'bg-primary-50 border border-primary-200' 
                  : 'hover:bg-gray-50'
              }`}
              onMouseEnter={() => setActiveEventId(event.id)}
              onMouseLeave={() => setActiveEventId(null)}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-3 flex-grow min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(event.date)}</p>
                  <p className="text-xs text-gray-500 truncate">{event.location}</p>
                </div>
                <div className="ml-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {event.attendees} asistentes
                  </span>
                </div>
              </div>
            </Link>
          ))}
          
          {events.length > 5 && (
            <div className="text-sm text-center text-gray-500 pt-2">
              Mostrando 5 de {events.length} eventos
            </div>
          )}
          
          {events.length === 0 && (
            <div className="text-center py-6">
              <p className="text-gray-500">No hay eventos disponibles en esta zona</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapView;