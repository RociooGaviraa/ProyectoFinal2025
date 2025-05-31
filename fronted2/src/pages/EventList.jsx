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
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const isAuthenticated = localStorage.getItem('jwt_token');

    useEffect(() => {
        fetchEvents();
        fetchCategories();
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

    const fetchCategories = async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (err) {
            // Si hay error, simplemente deja el array vacío
        }
    };

    console.log('Eventos recibidos:', events);
    console.log('Error:', error);

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Explorar Eventos</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                    <SearchBar onSearch={setSearch} initialValue={search} />
                </div>
                <CategoryFilter categories={categories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events
                            .filter(event => {
                                const searchLower = search.toLowerCase();
                                const matchesSearch =
                                    event.title?.toLowerCase().includes(searchLower) ||
                                    event.description?.toLowerCase().includes(searchLower) ||
                                    event.location?.toLowerCase().includes(searchLower) ||
                                    event.category?.toLowerCase().includes(searchLower);
                                const matchesCategory = !selectedCategory || event.category === selectedCategory || event.category === selectedCategory?.name;
                                return matchesSearch && matchesCategory;
                            })
                            .map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventList;