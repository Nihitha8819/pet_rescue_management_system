import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors for handling JWT token
apiClient.interceptors.request.use(
    (config) => {
        // Try both token storage keys for compatibility
        const token = localStorage.getItem('token') || localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Don't set Content-Type for FormData - let axios set it with boundary
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post(
                        `${process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
                        { refresh: refreshToken }
                    );
                    
                    const { access } = response.data;
                    localStorage.setItem('token', access);
                    localStorage.setItem('access_token', access);
                    
                    originalRequest.headers.Authorization = `Bearer ${access}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
            }
        }
        
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.error('Unauthorized access - redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

export default apiClient;