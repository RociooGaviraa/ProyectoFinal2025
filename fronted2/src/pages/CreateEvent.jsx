import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        type: 'conference',
        maxParticipants: 50,
        state: '',
        subcategory: false,
        price: ''
    });
    const [isFree, setIsFree] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError('');
            setSuccess('');
            const now = new Date();
            const eventDate = new Date(formData.date);
            let state = "abierto";
            if (eventDate < now) {
                state = "finalizado";
            } else if (
                eventDate.toDateString() === now.toDateString() &&
                eventDate.getHours() <= now.getHours() &&
                eventDate.getHours() + 2 > now.getHours() // Evento dura 2h
            ) {
                state = "en proceso";
            }

            if (!formData.subcategory && (!formData.price || parseFloat(formData.price) <= 0)) {
                setError('Debes indicar un precio válido para eventos de pago.');
                setLoading(false);
                return;
            }

            // Solo enviar los datos del evento, sin stripeProductId ni stripePriceId
            const eventData = {
                title: formData.title,
                description: formData.description,
                date: formData.date,
                location: formData.location,
                category: formData.type,
                capacity: formData.maxParticipants,
                subcategory: formData.subcategory,
                price: formData.price,
                image: formData.imageUrl || null
            };

            await api.createEvent(eventData);
            setSuccess('¡Evento creado correctamente!');
            setTimeout(() => {
                navigate('/events');
            }, 1500); // Redirige después de 1.5 segundos
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Crear nuevo evento</h1>
                <p className="text-gray-600 mb-6">Completa la información de tu evento para publicarlo.</p>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                        {success}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 space-y-6">
                    {/* Información básica */}
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles del evento</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Título del evento *</label>
                        <input
                            type="text"
                            required
                            placeholder="Ej: Taller de cocina italiana"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción *</label>
                        <textarea
                            required
                            placeholder="Describe tu evento y lo que los asistentes pueden esperar..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            rows={4}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha *</label>
                            <input
                                type="date"
                                required
                                value={formData.date ? formData.date.split('T')[0] : ''}
                                onChange={(e) => setFormData({...formData, date: e.target.value + (formData.date ? formData.date.substring(10) : '')})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="dd/mm/aaaa"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Hora *</label>
                            <input
                                type="time"
                                required
                                value={formData.date ? formData.date.split('T')[1] || '' : ''}
                                onChange={(e) => setFormData({...formData, date: (formData.date ? formData.date.split('T')[0] : '') + 'T' + e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder="--:--"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Categoría *</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="Conciertos y Festivales">Conciertos y Festivales</option>
                            <option value="Moda">Moda</option>
                            <option value="Cine y Teatro">Cine y Teatro</option>
                            <option value="Deporte">Deporte</option>
                            <option value="Gastronomía">Gastronomía</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Límite de asistentes (opcional)</label>
                        <input
                            type="number"
                            min="1"
                            placeholder="Deja vacío para plazas ilimitadas"
                            value={formData.maxParticipants || ''}
                            onChange={(e) => setFormData({...formData, maxParticipants: e.target.value ? parseInt(e.target.value, 10) : ''})}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    {/* Ubicación */}
                    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Ubicación</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ubicación *</label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: Calle Principal, 123 - Granada."
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                    {/* Imagen */}
                    <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Imagen</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL de la imagen (opcional)</label>
                        <input
                            type="url"
                            placeholder="Ej: https://example.com/mi-imagen.jpg"
                            value={formData.imageUrl || ''}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Si no proporciona una imagen, se utilizará una imagen predeterminada.</p>
                    </div>
                    {/* Otros campos adicionales */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.subcategory}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setFormData({
                                    ...formData,
                                    subcategory: checked,
                                    price: checked ? 0 : ''
                                });
                            }}
                            className="mr-2"
                            id="subcategory"
                        />
                        <label htmlFor="subcategory" className="text-sm font-medium text-gray-700">Gratis</label>
                    </div>
                    {!formData.subcategory && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Precio</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    )}
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={() => navigate('/events')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                loading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {loading ? 'Creando...' : 'Crear evento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvent;