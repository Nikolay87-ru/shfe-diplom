import apiClient from './apiClient';

export const fetchMovies = async () => {
  const response = await apiClient.get('/alldata');
  return response.data;
};

export const createMovie = async (formData: FormData) => {
  const response = await apiClient.post('/film', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteMovie = async (id: number) => {
  const response = await apiClient.delete(`/film/${id}`);
  return response.data;
};