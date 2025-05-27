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
    price,
    categoryId,
    organizer,
    attendees,
    rating
  } = event;

  return (
    <div className="card group hover:shadow-lg transition-shadow duration-300 h-full flex flex-col overflow-hidden">
      <div className="relative">
        {/* Imagen del evento */}
        <Link to={`/events/${id}`} className="block aspect-[16/9] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Overlay con fecha */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-md px-3 py-1 text-xs font-medium text-gray-800">
          {daysUntilEvent(date)}
        </div>
        
        {/* Precio */}
        <div className="absolute top-4 right-4 bg-primary-500 text-white rounded-md px-3 py-1 text-xs font-medium">
          {formatPrice(price)}
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        {/* Título */}
        <Link to={`/events/${id}`} className="block">
          <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-primary-500 transition-colors duration-200">
            {title}
          </h3>
        </Link>
        
        {/* Fecha y ubicación */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{formatDate(date)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location}</span>
        </div>
        
        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 flex-grow">
          {truncateText(description, 120)}
        </p>
        
        {/* Organizador y asistentes */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8">
              <img className="h-8 w-8 rounded-full" src={organizer.avatar} alt={organizer.name} />
            </div>
            <div className="ml-2">
              <p className="text-xs font-medium text-gray-900">{organizer.name}</p>
              <p className="text-xs text-gray-500">Organizador</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-xs font-medium text-gray-600">{rating}</span>
            </div>
            <div className="ml-2 flex items-center">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="ml-1 text-xs font-medium text-gray-600">{attendees}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
