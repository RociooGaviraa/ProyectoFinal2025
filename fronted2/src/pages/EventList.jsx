import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { api } from '../services/api';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const isAuthenticated = localStorage.getItem('jwt_token');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await api.getEvents();
            setEvents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        setSearch('');
        setSelectedCategory('');
        setFechaInicio('');
        setFechaFin('');
        setSelectedState('');
    };

    const categoriasUnicas = Array.from(new Set(events.map(e => e.category).filter(Boolean)));

    const eventosFiltrados = events.filter(evento => {
        const texto = (evento.title + ' ' + evento.description).toLowerCase();
        const cumpleBusqueda = texto.includes(search.toLowerCase());

        const cumpleCategoria = selectedCategory ? evento.category === selectedCategory : true;

        const fechaEvento = new Date(evento.date);
        const cumpleFechaInicio = fechaInicio ? fechaEvento >= new Date(fechaInicio) : true;
        const cumpleFechaFin = fechaFin ? fechaEvento <= new Date(fechaFin) : true;

        const cumpleEstado = selectedState
            ? evento.state && evento.state.trim() === selectedState.trim()
            : true;

        return cumpleBusqueda && cumpleCategoria && cumpleFechaInicio && cumpleFechaFin && cumpleEstado;
    });

    // Determina si hay algún filtro activo
    const hayFiltros = Boolean(search || selectedCategory || selectedState || fechaInicio || fechaFin);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Explorar Eventos</h1>

                {/* Filtros visualmente mejorados */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                    <div className="sm:col-span-2">
                        <SearchBar onSearch={setSearch} initialValue={search} />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Desde</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={e => setFechaInicio(e.target.value)}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Hasta</label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={e => setFechaFin(e.target.value)}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                        <select
                            value={selectedState}
                            onChange={e => setSelectedState(e.target.value)}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 px-3 py-2"
                        >
                            <option value="">Todos</option>
                            <option value="Abierto">Abierto</option>
                            <option value="En proceso">En proceso</option>
                            <option value="Finalizado">Finalizado</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 px-3 py-2"
                        >
                            <option value="">Todas</option>
                            {categoriasUnicas.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="sm:col-span-2 md:col-span-1 flex justify-start md:justify-end">
                        {hayFiltros && (
                            <button
                                onClick={limpiarFiltros}
                                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-xl shadow-sm transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {eventosFiltrados.length === 0 ? (
                            <div className="col-span-full text-center text-gray-600">No hay eventos que coincidan con los filtros.</div>
                        ) : (
                            eventosFiltrados.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventList;
