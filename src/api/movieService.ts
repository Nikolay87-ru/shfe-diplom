import apiClient from "./apiClient";

export const fetchMovies = async () => {
  const response = await apiClient.get('/alldata');
  return response.data;
};

export const createMovie = async (movieData: FormData) => {
  const response = await apiClient.post('/movie', movieData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};