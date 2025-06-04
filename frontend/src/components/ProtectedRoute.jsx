import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user } = useAuth();

    if (!user) {
        // Si no está autenticado, redirige al login
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && (!user.roles || !user.roles.includes('ROLE_ADMIN'))) {
        // Si la ruta es solo para admin y el usuario no es admin, redirige al home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;