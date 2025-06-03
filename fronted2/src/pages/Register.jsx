import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "sonner";
import logo from '../assets/logo.png';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        name: '',
        surname: '',
        birthDate: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            toast.success("¡Registro exitoso!");
            navigate('/login');
        } catch (error) {
            toast.error(error.message || "Error en el registro");
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-pink-100 via-blue-50 to-yellow-50">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg flex flex-col items-center -mt-8 mb-8">
                <img src={logo} alt="Eventfy Logo" className="h-16 w-16 mb-0 drop-shadow-lg" />
                <h2 className="text-center text-3xl font-bold text-blue-900 mb-1 tracking-tight">Crea tu cuenta</h2>
                <p className="text-center text-base text-pink-600 font-semibold mb-4">¡Únete a Eventfy!</p>
                <div className="mt-2 w-full">
                    <div className="bg-white py-4 px-8 shadow-xl rounded-2xl border border-pink-200">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-blue-900">Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-pink-300 shadow-sm focus:border-pink-400 focus:ring-pink-200 bg-pink-50/40 text-blue-900"
                                    placeholder="ejemplo@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-900">Usuario</label>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-pink-300 shadow-sm focus:border-pink-400 focus:ring-pink-200 bg-pink-50/40 text-blue-900"
                                    placeholder="ej: juanperez23"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-900">Contraseña</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-pink-300 shadow-sm focus:border-pink-400 focus:ring-pink-200 bg-pink-50/40 text-blue-900"
                                    placeholder="Mínimo 8 caracteres"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-900">Nombre</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-pink-300 shadow-sm focus:border-pink-400 focus:ring-pink-200 bg-pink-50/40 text-blue-900"
                                    placeholder="ej: Juan"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-900">Apellido</label>
                                <input
                                    name="surname"
                                    type="text"
                                    required
                                    value={formData.surname}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-pink-300 shadow-sm focus:border-pink-400 focus:ring-pink-200 bg-pink-50/40 text-blue-900"
                                    placeholder="ej: Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-900">Fecha de nacimiento</label>
                                <input
                                    name="birthDate"
                                    type="date"
                                    required
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-pink-300 shadow-sm focus:border-pink-400 focus:ring-pink-200 bg-pink-50/40 text-blue-900"
                                    placeholder="ej: 2000-01-31"
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 rounded-md shadow-md text-base font-bold text-white transition-all duration-200 bg-gradient-to-r from-pink-500 via-blue-500 to-yellow-400 hover:from-pink-600 hover:via-blue-600 hover:to-yellow-500"
                                >
                                    Registrarse
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;