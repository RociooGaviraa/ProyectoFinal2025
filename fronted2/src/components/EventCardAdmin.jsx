import React from "react";
import { api } from "../services/api";

const EventCardAdmin = ({ event, userId, onUnsubscribe }) => {
  const { id, title, date, location, image, category } = event;

  const handleUnsubscribe = async () => {
    if (window.confirm("¿Seguro que quieres cancelar la suscripción de este usuario a este evento?")) {
      try {
        await api.cancelUserSubscription(userId, id);
        if (onUnsubscribe) onUnsubscribe(id);
      } catch (e) {
        alert("No se pudo cancelar la suscripción");
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden relative transition hover:shadow-lg">
      <img
        src={image || "/no-image.png"}
        alt={title}
        className="w-full h-44 object-cover"
      />
      <span className="absolute top-4 right-4 bg-gray-800 text-white text-xs px-3 py-0.5 rounded-full">
        {category || "Categoría"}
      </span>
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
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
          {new Date(date).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          -{" "}
          {new Date(date).toLocaleTimeString("es-ES", {
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
          {location}
        </div>
        <button
          className="block w-full text-center mt-2 bg-red-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-red-600 transition"
          onClick={handleUnsubscribe}
        >
          Cancelar suscripción
        </button>
      </div>
    </div>
  );
};

export default EventCardAdmin;
