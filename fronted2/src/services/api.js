const API_URL = 'http://localhost:8000/api';

export const api = {
    async getEvents() {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`${API_URL}/events`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error fetching events');
        return response.json();
    },

    async getEventsByCategory(category) {
        const response = await fetch(`${API_URL}/events?category=${category}`);
        if (!response.ok) throw new Error('Error fetching events by category');
        return response.json();
    },

    async searchEvents(query) {
        const response = await fetch(`${API_URL}/events?search=${query}`);
        if (!response.ok) throw new Error('Error searching events');
        return response.json();
    },

    async login(credentials) {
        console.log('Intentando login con:', credentials);
        
        const response = await fetch(`${API_URL}/login_check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password
            })
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Error en el inicio de sesión' }));
            console.error('Error response:', error);
            throw new Error(error.message || 'Error en el inicio de sesión');
        }

        const data = await response.json();
        console.log('Login response:', data);

        if (!data.token) {
            throw new Error('No se recibió el token en la respuesta');
        }

        localStorage.setItem('jwt_token', data.token);
        if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
        }

        return {
            token: data.token,
            user: data.user
        };
    },

    async register(userData) {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userData.email,
                username: userData.username,
                password: userData.password,
                name: userData.name,
                surname: userData.surname,
                birthDate: userData.birthDate
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error en el registro');
        }

        return response.json();
    },

    createEvent: async (eventData) => {
        const token = localStorage.getItem('jwt_token');
        console.log('Datos enviados al backend:', eventData);
        const response = await fetch('http://localhost:8000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(eventData)
        });
        if (!response.ok) throw new Error('No se pudo crear el evento');
        return response.json();
    },

    getEventById: async (id) => {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch(`http://localhost:8000/api/events/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        if (!response.ok) throw new Error('No se pudo obtener el evento');
        return response.json();
    },

};
