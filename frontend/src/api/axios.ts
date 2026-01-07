import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api'}/auth/token/refresh/`, {
                    refresh: refreshToken,
                });
                const { access } = response.data;
                localStorage.setItem('accessToken', access);
                // The interceptor will handle setting the Authorization header
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login or handle logout
                console.error('RefreshToken failed', refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
