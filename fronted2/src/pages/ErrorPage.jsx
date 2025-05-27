import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
                <p className="text-xl text-gray-600 mb-4">Sorry, an unexpected error has occurred.</p>
                <p className="text-gray-500 mb-8">
                    {error.statusText || error.message}
                </p>
                <Link to="/" className="text-indigo-600 hover:text-indigo-500">
                    Go back to home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;