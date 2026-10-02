import api from './axios';

export const getAODashboardAPI = () => api.get('/dashboard/ao');
export const getANODashboardAPI = () => api.get('/dashboard/ano');
