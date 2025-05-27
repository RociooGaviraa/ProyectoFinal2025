import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('jwt_token');
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                const data = await api.getEventById(id);
                setEvent(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleJoinEvent = async () => {
        try {
            setJoining(true);
            await api.joinEvent(id);
            // Refresh event data
            const updatedEvent = await api.getEventById(id);
            setEvent(updatedEvent);
        } catch (err) {
            setError(err.message);
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    {error}
                </div>
            </div>
        );
    }

    if (!event) return null;

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="text-lg">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Location</p>
                            <p className="text-lg">{event.location}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Type</p>
                            <p className="text-lg capitalize">{event.type}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className="text-lg">{event.status}</p>
                        </div>
                    </div>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                        <p className="text-gray-700">{event.description}</p>
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="text-indigo-600 hover:text-indigo-500"
                        >
                            Back to Events
                        </button>
                        {isAuthenticated && (
                            <button
                                onClick={handleJoinEvent}
                                disabled={joining}
                                className={`${
                                    joining 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-indigo-600 hover:bg-indigo-700'
                                } text-white px-4 py-2 rounded-md`}
                            >
                                {joining ? 'Joining...' : 'Join Event'}
                            </button>
                        )}
                        {!isAuthenticated && (
                            <Link
                                to="/login"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
                            >
                                Login to Join Event
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;