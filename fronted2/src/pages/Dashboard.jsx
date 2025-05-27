import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Bienvenido, {user?.username || 'Usuario'}
                    </h1>
                    <p className="text-gray-600">
                        Esta es tu página de dashboard donde podrás ver tus eventos y actividades.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard; 