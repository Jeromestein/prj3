import { apiClient } from './client';

export const signupRequest = (payload) => apiClient.post('/auth/signup', payload);

export const loginRequest = (payload) => apiClient.post('/auth/login', payload);

export const logoutRequest = () => apiClient.post('/auth/logout');

export const meRequest = () => apiClient.get('/auth/me');
