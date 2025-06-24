import apiClient from './apiClient';

export const fetchSeances = async () => {
  const response = await apiClient.get('/alldata');
  return response.data;
};

export const createSeance = async (formData: FormData) => {
  const response = await apiClient.post('/seance', formData);
  return response.data;
};

export const deleteSeance = async (id: number) => {
  const response = await apiClient.delete(`/seance/${id}`);
  return response.data;
};