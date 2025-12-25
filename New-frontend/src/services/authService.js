import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

const storeAuthData = (access, refresh, user) => {
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
  if (user) localStorage.setItem("user", JSON.stringify(user));
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register/`, userData);
  const { access, refresh, user } = response.data;

  storeAuthData(access, refresh, user);

  return user;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login/`, credentials);
  const { access, refresh, user } = response.data;

  storeAuthData(access, refresh, user);

  return user;
};

export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
};

export const getUsers = async () => {
  const token = localStorage.getItem("access_token");

  const response = await axios.get(`${API_URL}/auth/users/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteUser = async (userId) => {
  const token = localStorage.getItem("access_token");

  const response = await axios.delete(`${API_URL}/auth/users/${userId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProfile = async (userData) => {
  const token = localStorage.getItem("access_token");

  const response = await axios.put(`${API_URL}/auth/profile/`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const updatedUser = response.data;
  localStorage.setItem("user", JSON.stringify(updatedUser));

  return updatedUser;
};

const authService = {
  register: registerUser,
  login: loginUser,
  logout: logoutUser,
  getCurrentUser,
  getUsers,
  deleteUser,
  updateProfile,
};

export default authService;
