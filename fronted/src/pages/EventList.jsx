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

    const handleSearchChange = (value) => {
        setSearch(value);
    };

    const categoriasUnicas = Array.from(new Set(events.map(e => e.category).filter(Boolean)));

    const eventosFiltrados = events.filter(evento => {
        const texto = (evento.title + ' ' + evento.description + ' ' + evento.location).toLowerCase();
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
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Hero */}
            <section className="w-full bg-gradient-to-br from-teal-800 to-teal-500 text-white py-8 md:py-10 mb-6 shadow-lg animate-gradient-x bg-[length:200%_200%] saturate-150">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 md:mb-4 drop-shadow-lg animate-fade-in">Explorar Eventos</h1>
                    <p className="text-lg md:text-xl mb-4 md:mb-6 text-white/90 animate-fade-in delay-200">Encuentra y filtra los mejores eventos cerca de ti, según tus intereses y fechas.</p>
                </div>
            </section>

            {/* Filtros visualmente mejorados */}
            <div className="max-w-5xl mx-auto mt-0 z-10 relative w-full px-2 md:px-0">
                <div className="bg-white/90 rounded-2xl shadow-2xl p-6 md:p-8 mb-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end border border-gray-200 transition-all duration-300">
                    <div className="sm:col-span-2">
                        <SearchBar onSearch={handleSearchChange} initialValue={search} realTime />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Desde</label>
                        <input
                            type="date"
                            value={fechaInicio}
                            onChange={e => setFechaInicio(e.target.value)}
                            className="w-full rounded-xl border-gray-200 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-100 px-3 py-2 bg-white text-gray-700 font-semibold transition-all duration-200 hover:bg-teal-50 hover:scale-105"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Hasta</label>
                        <input
                            type="date"
                            value={fechaFin}
                            onChange={e => setFechaFin(e.target.value)}
                            className="w-full rounded-xl border-gray-200 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-100 px-3 py-2 bg-white text-gray-700 font-semibold transition-all duration-200 hover:bg-teal-50 hover:scale-105"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                        <select
                            value={selectedState}
                            onChange={e => setSelectedState(e.target.value)}
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-100 px-3 py-2 bg-white text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-50 hover:scale-105"
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
                            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-100 px-3 py-2 bg-white text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-50 hover:scale-105"
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
                                className="flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-bold px-6 py-1.5 rounded-xl shadow-md transition-all duration-200 border border-teal-400 hover:scale-105 hover:shadow-xl w-full"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-2 md:px-0 mt-0">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200 animate-fade-in">
                        {error}
                    </div>
                )}
                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {eventosFiltrados.length === 0 ? (
                                <div className="col-span-full text-center text-gray-600 animate-fade-in">No hay eventos que coincidan con los filtros.</div>
                            ) : (
                                eventosFiltrados.map(event => (
                                    <div className="transition-all duration-300 hover:scale-105 hover:shadow-2xl" key={event.id}>
                                        <EventCard event={event} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventList;
