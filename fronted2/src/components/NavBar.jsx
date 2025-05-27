import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
                            Home
                        </Link>
                        <Link to="/create-event" className="flex items-center px-2 py-2 text-gray-700 hover:text-gray-900">
                            Create Event
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="px-2 py-2 text-gray-700 hover:text-gray-900">
                                    Dashboard
                                </Link>
                                <Link to="/profile" className="px-2 py-2 text-gray-700 hover:text-gray-900">
                                    Profile
                                </Link>
                                <button
                                    onClick={logout}
                                    className="px-2 py-2 text-gray-700 hover:text-gray-900"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-2 py-2 text-gray-700 hover:text-gray-900">
                                    Login
                                </Link>
                                <Link to="/register" className="px-2 py-2 text-gray-700 hover:text-gray-900">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;