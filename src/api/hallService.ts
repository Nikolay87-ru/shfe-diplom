import apiClient from './apiClient';

export const fetchHalls = async () => {
  const response = await apiClient.get('/alldata');
  return response.data;
};

export const createHall = async (formData: FormData) => {
  const response = await apiClient.post('/hall', formData);
  return response.data;
};

export const deleteHall = async (id: number) => {
  const response = await apiClient.delete(`/hall/${id}`);
  return response.data;
};

export const updateHallConfig = async (hallId: number, formData: FormData) => {
  const response = await apiClient.post(`/hall/${hallId}`, formData);
  return response.data;
};

export const updateHallPrices = async (hallId: number, formData: FormData) => {
  const response = await apiClient.post(`/price/${hallId}`, formData);
  return response.data;
};

export const updateHallStatus = async (hallId: number, formData: FormData) => {
  const response = await apiClient.post(`/open/${hallId}`, formData);
  return response.data;
};