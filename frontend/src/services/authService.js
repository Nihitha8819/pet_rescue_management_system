import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/';

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}users/register/`, userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_URL}users/login/`, credentials);
    return response.data;
};

export const logoutUser = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const getUsers = async () => {
    const response = await axios.get(`${API_URL}users/users/`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await axios.delete(`${API_URL}users/${userId}/`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

export const updateProfile = async (userData) => {
    const response = await axios.put(`${API_URL}users/profile/`, userData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return response.data;
};

const authService = {
    register: registerUser,
    login: loginUser,
    logout: logoutUser,
    getCurrentUser,
    updateProfile,
    getUsers,
    deleteUser
};

export default authService;