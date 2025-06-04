import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(formData);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center -mt-16 mb-16">
                <img src={logo} alt="Eventfy Logo" className="h-16 w-16 mb-0 drop-shadow-lg" />
                <h2 className="text-center text-3xl font-bold text-blue-900 mb-1 tracking-tight">Inicia sesión en tu cuenta</h2>
                <p className="text-center text-base text-pink-600 font-semibold mb-4">¡Bienvenido de nuevo a Eventfy!</p>
                <div className="mt-4 w-full">
                    <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-pink-200">
                        {error && (
                            <div className="bg-pink-50 text-pink-700 p-4 rounded-md mb-6 border border-pink-200">
                                {error}
                            </div>
                        )}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-blue-900">Email</label>
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-pink-300 shadow-sm focus:border-pink-400 focus:ring-pink-200 bg-pink-50/40 text-blue-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-900">Contraseña</label>
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-pink-300 shadow-sm focus:border-pink-400 focus:ring-pink-200 bg-pink-50/40 text-blue-900"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2 px-4 rounded-md shadow-md text-base font-bold text-white transition-all duration-200
                                        ${loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-400 hover:from-pink-600 hover:via-blue-600 hover:to-yellow-500'}`}
                                >
                                    {loading ? 'Entrando...' : 'Iniciar sesión'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;