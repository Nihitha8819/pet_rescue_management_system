import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Ensure API_URL doesn't have trailing slash
const getApiUrl = () => {
    const url = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

const API_URL = getApiUrl();

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user and token from localStorage on mount
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const loginUrl = `${API_URL}/auth/login/`;
            console.log('Attempting login to:', loginUrl);

            const response = await axios.post(loginUrl, { email, password }, {
                timeout: 100000, // 10 second timeout
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const { user: userData, access, refresh } = response.data;

            if (!userData || !access) {
                throw new Error('Invalid response from server');
            }

            setUser(userData);
            setToken(access);

            localStorage.setItem('token', access);
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('refresh_token', refresh); // Also store as refresh_token for compatibility
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Login error details:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                url: `${API_URL}/auth/login/`,
            });

            // Handle network errors specifically
            if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
                throw new Error(`Cannot connect to server. Please ensure the backend is running on ${API_URL}`);
            }

            // Extract error message from response
            const data = error.response?.data;
            let errorMessage = 'Login failed. Please check your credentials.';

            if (data) {
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.non_field_errors) {
                    errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
                } else if (typeof data === 'object') {
                    const fieldErrors = Object.values(data).flat();
                    if (fieldErrors.length > 0) errorMessage = fieldErrors[0];
                }
            }
            throw new Error(errorMessage);
        }
    };

    const register = async (userData) => {
        try {
            // Ensure user_type has a default value
            const registrationData = {
                ...userData,
                user_type: userData.user_type || 'adopter'
            };

            const signupUrl = `${API_URL}/auth/signup/`;
            console.log('Attempting registration to:', signupUrl);

            const response = await axios.post(signupUrl, registrationData, {
                timeout: 1000, // 10 second timeout
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const { user: newUser, access, refresh } = response.data;

            if (!newUser || !access) {
                throw new Error('Invalid response from server');
            }

            setUser(newUser);
            setToken(access);

            localStorage.setItem('token', access);
            localStorage.setItem('refresh', refresh);
            localStorage.setItem('refresh_token', refresh); // Also store as refresh_token for compatibility
            localStorage.setItem('user', JSON.stringify(newUser));
        } catch (error) {
            console.error('Registration error details:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                url: `${API_URL}/auth/signup/`,
            });

            // Handle network errors specifically
            if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
                throw new Error(`Cannot connect to server. Please ensure the backend is running on ${API_URL}`);
            }

            // Extract error message from response
            const data = error.response?.data;
            let errorMessage = 'Registration failed. Please try again.';

            if (data) {
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.non_field_errors) {
                    errorMessage = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
                } else if (typeof data === 'object') {
                    // Collect all field errors (e.g., { email: ["exists"], password: ["short"] })
                    const fieldErrors = Object.values(data).flat();
                    if (fieldErrors.length > 0) errorMessage = fieldErrors[0];
                }
            }

            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};