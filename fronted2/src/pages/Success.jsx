import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api'; // Asegúrate de importar tu api

const Success = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Intentar obtener el eventId del estado de navegación o de la query string
  let eventId = location.state?.eventId;
  if (!eventId) {
    const params = new URLSearchParams(location.search);
    eventId = params.get('eventId');
  }

  // Inscribir al usuario automáticamente al evento pagado
  useEffect(() => {
    if (eventId && user) {
      api.joinEvent(eventId).catch(() => {}); // Ignora errores si ya está inscrito
    }
  }, [eventId, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-teal-600 mb-4">¡Pago realizado con éxito!</h1>
        <p className="text-lg text-dark mb-2">Gracias por tu compra.</p>
        <p className="text-lg text-dark mb-2">
          Hemos mandado la entrada al correo <span className="font-semibold text-teal-700">{user?.email}</span>
        </p>
        <p className="text-lg text-dark mb-6">Te esperamos en el evento.</p>
        <div className="flex flex-col gap-3 items-center">
          <Link to="/events" className="px-6 py-2 bg-gradient-to-r from-pink-400 to-pink-600 text-white rounded-md font-semibold shadow-lg hover:from-pink-500 hover:to-pink-700 transition">Ver más eventos</Link>
          {eventId && (
            <Link to={`/events/${eventId}`} className="px-6 py-2 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-md font-semibold shadow-lg hover:from-teal-600 hover:to-teal-800 transition">
              Volver al evento
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Success;