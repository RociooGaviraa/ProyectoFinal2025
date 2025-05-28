import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });

    // Si quieres, puedes hacer lo mismo para el token:
    // const [token, setToken] = useState(() => localStorage.getItem('jwt_token'));

    const register = async (userData) => {
        try {
            const response = await api.register(userData);
            toast.success("¡Registro exitoso!");
            return response;
        } catch (error) {
            toast.error(error.message || 'Error en el registro');
            throw error;
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.login(credentials);
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('jwt_token', response.token);
            toast.success("¡Inicio de sesión exitoso!");
            return response;
        } catch (error) {
            toast.error(error.message || 'Error al iniciar sesión');
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        toast.success("Sesión cerrada correctamente");
    };

    // Si quieres, puedes agregar un efecto para mantener sincronizado el usuario con el localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};