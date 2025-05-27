import React from 'react';
import { Link } from 'react-router-dom';

const eventCategories = [
    {
        type: 'conference',
        title: 'Conferences',
        description: 'Professional gatherings and industry events',
        icon: '🎤'
    },
    {
        type: 'workshop',
        title: 'Workshops',
        description: 'Hands-on learning and skill development sessions',
        icon: '🛠️'
    },
    {
        type: 'seminar',
        title: 'Seminars',
        description: 'Educational presentations and discussions',
        icon: '📚'
    },
    {
        type: 'networking',
        title: 'Networking',
        description: 'Connect with professionals in your field',
        icon: '🤝'
    },
    {
        type: 'cultural',
        title: 'Cultural Events',
        description: 'Art, music, and cultural celebrations',
        icon: '🎨'
    },
    {
        type: 'sports',
        title: 'Sports Events',
        description: 'Athletic competitions and activities',
        icon: '⚽'
    }
];

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Discover Amazing Events
                    </h1>
                    <p className="text-xl text-gray-600">
                        Find and join events that match your interests
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventCategories.map((category) => (
                        <Link
                            key={category.type}
                            to={`/events/category/${category.type}`}
                            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-200 hover:scale-105"
                        >
                            <div className="p-6">
                                <div className="text-4xl mb-4">{category.icon}</div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    {category.title}
                                </h2>
                                <p className="text-gray-600">
                                    {category.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Link
                        to={`/events/category/${event.category}`} 
                        className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                        Ver más eventos de {event.category}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;