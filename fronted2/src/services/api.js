const API_URL = 'http://localhost:8000/api';

export const api = {
    async getEvents() {
        const response = await fetch(`${API_URL}/events`);
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
                'Origin': 'http://localhost:5173'
            },
            mode: 'cors',
            credentials: 'include',
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

        // Decodificar el token para verificar su contenido
        try {
            const tokenParts = data.token.split('.');
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('Token payload:', payload);
        } catch (e) {
            console.error('Error al decodificar el token:', e);
        }

        localStorage.setItem('jwt_token', data.token);

        // Obtener información del usuario
        const token = localStorage.getItem('jwt_token');
        console.log('Token almacenado:', token);

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        console.log('Request headers:', headers);

        const userResponse = await fetch(`${API_URL}/me`, {
            method: 'GET',
            headers: headers
        });

        console.log('User response status:', userResponse.status);
        console.log('User response headers:', Object.fromEntries(userResponse.headers.entries()));

        if (!userResponse.ok) {
            const errorData = await userResponse.json();
            console.error('Error response:', errorData);
            throw new Error(errorData.message || 'Error al obtener la información del usuario');
        }

        const userData = await userResponse.json();
        console.log('User data:', userData);

        return {
            token: data.token,
            user: userData.user
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
    }
};