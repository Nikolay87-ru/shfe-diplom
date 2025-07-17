import axios from 'axios';
import { Film, Hall, Seance } from '../types';

const API_URL = '/api';

export interface ApiResponse {
  success: boolean;
  result: {
    films: Film[];
    halls: Hall[];
    seances: Seance[];
  };
  error?: string;
}

export const api = {
  // Общие
  getAllData: async (): Promise<ApiResponse> => {
    try {
      const response = await axios.get(`${API_URL}/alldata`);
      return {
        success: true,
        result: {
          films: response.data.result?.films || [],
          halls: response.data.result?.halls || [],
          seances: response.data.result?.seances || [],
        },
      };
    } catch (error) {
      console.error('Error fetching all data:', error);
      return {
        success: false,
        error: 'Failed to fetch data',
      };
    }
  },

  // Залы
  getHalls: async (): Promise<ApiResponse> => {
    try {
      const response = await axios.get(`${API_URL}/alldata`);
      return response.data;
    } catch (error) {
      console.error('Error fetching halls:', error);
      throw error;
    }
  },

  addHall: async (name: string): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.set('hallName', name);
    try {
      const response = await axios.post(`${API_URL}/hall`, formData);
      return response.data;
    } catch (error) {
      console.error('Error adding hall:', error);
      throw error;
    }
  },

  updateHallConfig: async (
    hallId: number,
    config: {
      rowCount: number;
      placeCount: number;
      config: string[][];
    },
  ): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.set('rowCount', config.rowCount.toString());
    formData.set('placeCount', config.placeCount.toString());
    formData.set('config', JSON.stringify(config.config));
    try {
      const response = await axios.post(`${API_URL}/hall/${hallId}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating hall config:', error);
      throw error;
    }
  },

  updateHallPrices: async (
    hallId: number,
    prices: {
      standartPrice: number;
      vipPrice: number;
    },
  ): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.set('priceStandart', prices.standartPrice.toString());
    formData.set('priceVip', prices.vipPrice.toString());
    try {
      const response = await axios.post(`${API_URL}/price/${hallId}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating hall prices:', error);
      throw error;
    }
  },

  updateHallStatus: async (hallId: number, status: number): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.set('hallOpen', status.toString());
    try {
      const response = await axios.post(`${API_URL}/open/${hallId}`, formData);
      return response.data;
    } catch (error) {
      console.error('Error updating hall status:', error);
      throw error;
    }
  },

  deleteHall: async (hallId: number): Promise<ApiResponse> => {
    try {
      const response = await axios.delete(`${API_URL}/hall/${hallId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting hall:', error);
      throw error;
    }
  },

  // Фильмы
  getMovies: async (): Promise<ApiResponse> => {
    try {
      const response = await axios.get(`${API_URL}/alldata`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  addMovie: async (movieData: {
    name: string;
    duration: number;
    description: string;
    country: string;
    poster: File;
  }): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('filmName', movieData.name);
    formData.append('filmDuration', movieData.duration.toString());
    formData.append('filmDescription', movieData.description);
    formData.append('filmOrigin', movieData.country);
    formData.append('filePoster', movieData.poster);

    console.log('--- FormData содержимое перед отправкой ---');
    for (const [key, value] of formData.entries()) {
      console.log(key, value instanceof File ? `File: ${value.name}` : `Text: ${value}`);
    }

    try {
      const response = await axios.post(`${API_URL}/film`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data' 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error adding movie:', error);
      throw error;
    }
  },

  deleteMovie: async (movieId: number): Promise<ApiResponse> => {
    try {
      const response = await axios.delete(`${API_URL}/film/${movieId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  },

  // Сеансы
  getSeances: async (): Promise<ApiResponse> => {
    try {
      const response = await axios.get(`${API_URL}/alldata`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seances:', error);
      throw error;
    }
  },

  addSeance: async (seanceData: {
    hallId: number;
    movieId: number;
    time: string;
  }): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.set('seanceHallid', seanceData.hallId.toString());
    formData.set('seanceFilmid', seanceData.movieId.toString());
    formData.set('seanceTime', seanceData.time);
    try {
      const response = await axios.post(`${API_URL}/seance`, formData);
      return response.data;
    } catch (error) {
      console.error('Error adding seance:', error);
      throw error;
    }
  },

  deleteSeance: async (seanceId: number): Promise<ApiResponse> => {
    try {
      const response = await axios.delete(`${API_URL}/seance/${seanceId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting seance:', error);
      throw error;
    }
  },
};
