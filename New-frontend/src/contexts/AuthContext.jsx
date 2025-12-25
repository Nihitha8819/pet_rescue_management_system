import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

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
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login/`, { email, password });
        const { user: userData, access, refresh } = response.data;
        
        setUser(userData);
        setToken(access);
        
        localStorage.setItem('token', access);
        localStorage.setItem('refresh', refresh);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const register = async (userData) => {
        const response = await axios.post(`${API_URL}/auth/signup/`, userData);
        const { user: newUser, access, refresh } = response.data;
        
        setUser(newUser);
        setToken(access);
        
        localStorage.setItem('token', access);
        localStorage.setItem('refresh', refresh);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refresh');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

