import React, { createContext, useContext, useState } from 'react';
import { toast } from "sonner";
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const register = async (userData) => {
        try {
            const response = await api.register(userData);
            toast.success("Registration successful!");
            return response;
        } catch (error) {
            toast.error(error.message || 'Registration failed');
            throw error;
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.login(credentials);
            setUser(response.user);
            toast.success("Login successful!");
            return response;
        } catch (error) {
            toast.error(error.message || 'Login failed');
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('jwt_token');
        toast.success("Logged out successfully");
    };

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