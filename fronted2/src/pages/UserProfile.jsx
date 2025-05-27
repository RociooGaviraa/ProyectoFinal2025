import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import EventCard from '../components/EventCard';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [userEvents, setUserEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        bio: ''
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const [profileData, eventsData] = await Promise.all([
                api.getUserProfile(),
                api.getUserEvents()
            ]);
            setProfile(profileData);
            setUserEvents(eventsData);
            setFormData({
                username: profileData.username,
                email: profileData.email,
                bio: profileData.bio || ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.updateUserProfile(formData);
            setProfile({ ...profile, ...formData });
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile</h2>
                        {isEditing ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Username</label>
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Username</h3>
                                    <p className="mt-1 text-lg">{profile.username}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                    <p className="mt-1 text-lg">{profile.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                                    <p className="mt-1 text-lg">{profile.bio || 'No bio added yet.'}</p>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">My Events</h2>
                    {userEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userEvents.map(event => (
                                <div key={event.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                                        <p className="text-gray-600 mb-4">{event.description}</p>
                                        <div className="flex justify-between items-center text-sm text-gray-500">
                                            <span>{new Date(event.date).toLocaleDateString()}</span>
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-600">You haven't joined any events yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;