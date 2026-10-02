import api from './axios';

export const loginAPI = (data) => api.post('/auth/login', data);
export const registerAPI = (data) => api.post('/auth/register', data);
export const logoutAPI = () => api.post('/auth/logout');
export const getMeAPI = () => api.get('/auth/me');
