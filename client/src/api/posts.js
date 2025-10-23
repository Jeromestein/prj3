import { apiClient } from './client';

export const fetchPosts = (params) =>
  apiClient.get('/posts', {
    params,
  });

export const fetchPost = (postId) => apiClient.get(`/posts/${postId}`);

export const createPost = (payload) => apiClient.post('/posts', payload);

export const updatePost = (postId, payload) => apiClient.put(`/posts/${postId}`, payload);
