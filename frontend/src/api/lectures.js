import api from './axios';

export const submitLectureAPI = (data) => api.post('/lectures/submit', data);
export const getMyLecturesAPI = () => api.get('/lectures/my');
export const getAllLecturesAPI = () => api.get('/lectures/all');
export const getLecturesByAssignmentAPI = (assignmentId) => api.get(`/lectures/assignment/${assignmentId}`);
export const deleteLectureAPI = (id) => api.delete(`/lectures/${id}`);
