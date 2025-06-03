import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const EventCard = ({ event }) => {
  const {
    id,
    title,
    description,
    date,
    location,
    image,
    category,
    capacity,
    attendees = 0,
    state,
  } = event;

  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const favorites = await api.getFavorites();
        setIsFavorite(favorites.some((ev) => ev.id === id));
      } catch {
        setIsFavorite(false);
      }
    };
    fetchFavorite();
  }, [id]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await api.removeFavorite(id);
        setIsFavorite(false);
      } else {
        await api.addFavorite(id);
        setIsFavorite(true);
      }
    } finally {
      setLoadingFavorite(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden relative transition hover:shadow-lg flex flex-col h-full">
      {/* Favorito */}
      <button
        onClick={handleToggleFavorite}
        disabled={loadingFavorite}
        title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        className={`absolute top-3 left-3 text-xl cursor-pointer hover:scale-110 transition-transform bg-white/80 backdrop-blur-md rounded-full p-1 shadow-md ${
          loadingFavorite ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      {/* Estado visual encima de la imagen */}
      {state === "Finalizado" && (
        <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-lg z-10">
          Finalizado
        </span>
      )}
      {state === "En proceso" && (
        <span className="absolute top-3 right-3 bg-gray-500 text-white text-xs px-3 py-1 rounded-full shadow-lg z-10">
          En proceso
        </span>
      )}
      {state === "Abierto" && (
        <span className="absolute top-3 right-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow-lg z-10">
          Abierto
        </span>
      )}

      {/* Imagen */}
      <Link to={`/events/${id}`}>
        <img
          src={image || "https://picsum.photos/800/400"}
          alt={title}
          className="w-full h-44 object-cover"
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2 h-12 mb-2">{title}</h3>
        <div className="flex flex-col gap-1 flex-1 justify-start">
          {/* Fecha */}
          <div className="flex items-center text-sm text-gray-500 gap-2 mt-0 mb-1">
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
            <span className="truncate w-full">
              {new Date(date).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })} {" "}-{" "}
              {new Date(date).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          {/* Ubicación */}
          <div className="flex items-center text-sm text-gray-500 gap-2 mb-2">
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
            <span className="truncate w-full">{location}</span>
          </div>
        </div>
        {/* Capacidad */}
        <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
          <svg
            className="w-5 h-5 text-teal-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="text-base font-semibold">{attendees} / {capacity}</span>
        </div>
        {/* Botón */}
        <Link
          to={`/events/${id}`}
          className="block w-full text-center bg-teal-500 text-white text-sm font-medium py-2 rounded-lg hover:bg-teal-600 transition mt-auto"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
