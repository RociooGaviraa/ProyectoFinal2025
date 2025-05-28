import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatPrice, daysUntilEvent, truncateText } from '../lib/utils';

const EventCard = ({ event }) => {
  const {
    id,
    title,
    description,
    date,
    location,
    image,
    category,
    capacity
  } = event;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/events/${id}`}>
        <img
          src={image || 'https://picsum.photos/800/400'}
          alt={title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-6">
        <div className="text-sm text-purple-600 mb-2">
          {new Date(date).toLocaleDateString('es-ES')} · {new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{location}</p>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {capacity} plazas
          </div>
          <Link
            to={`/events/${id}`}
            className="bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors duration-300"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
