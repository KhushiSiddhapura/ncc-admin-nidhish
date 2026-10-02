import api from './axios';

export const createAssignmentAPI = (data) => api.post('/assignments', data);
export const getAllAssignmentsAPI = () => api.get('/assignments');
export const getAssignmentByIdAPI = (id) => api.get(`/assignments/${id}`);
export const updateAssignmentAPI = (id, data) => api.put(`/assignments/${id}`, data);
export const deleteAssignmentAPI = (id) => api.delete(`/assignments/${id}`);
export const getAllANOsAPI = () => api.get('/assignments/anos');
export const getANOProgressAPI = (anoId) => api.get(`/assignments/ano-progress/${anoId}`);
