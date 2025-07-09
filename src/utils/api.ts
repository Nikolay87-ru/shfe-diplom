import axios from 'axios';
import { Hall, Movie, Seance } from '../types/index';

const API_URL = 'https://shfe-diplom.neto-server.ru';

export const api = {
  // Получение всех данных
  getAllData: async () => {
    const response = await axios.get(`${API_URL}/alldata`);
    return response.data.result;
  },

  // Работа с залами
  getHalls: async () => (await api.getAllData()).halls,
  createHall: async (name: string) => {
    const formData = new FormData();
    formData.set('hallName', name);
    return axios.post(`${API_URL}/hall`, formData);
  },
  deleteHall: async (id: number) => axios.delete(`${API_URL}/hall/${id}`),

  // Работа с фильмами
  getMovies: async () => (await api.getAllData()).films,
  createMovie: async (movie: Omit<Movie, 'id'>) => {
    const formData = new FormData();
    Object.entries(movie).forEach(([key, value]) => 
      formData.set(`film${key.charAt(0).toUpperCase() + key.slice(1)}`, value)
    );
    return axios.post(`${API_URL}/film`, formData);
  },
  deleteMovie: async (id: number) => axios.delete(`${API_URL}/film/${id}`),

  // Работа с сеансами
  getSeances: async () => (await api.getAllData()).seances,
  createSeance: async (seance: Omit<Seance, 'id'>) => {
    const formData = new FormData();
    formData.set('seanceHallid', seance.hallId.toString());
    formData.set('seanceFilmid', seance.filmId.toString());
    formData.set('seanceTime', seance.time);
    return axios.post(`${API_URL}/seance`, formData);
  },
  deleteSeance: async (id: number) => axios.delete(`${API_URL}/seance/${id}`),
};