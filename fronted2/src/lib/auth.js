export const isAuthenticated = () => {
    const token = localStorage.getItem('jwt_token');
    return !!token;
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
};

export const setAuthData = (token, user) => {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user', JSON.stringify(user));
};