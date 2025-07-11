import axios from 'axios';

const API_URL = '/api'; 

interface ApiResponse {
  films(films: any): unknown;
  success: boolean;
  result: unknown;
  error?: string;
}

export const api = {
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

  updateHallConfig: async (hallId: number, config: {
    rowCount: number;
    placeCount: number;
    config: string[][];
  }): Promise<ApiResponse> => {
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
    formData.set('filmName', movieData.name);
    formData.set('filmDuration', movieData.duration.toString());
    formData.set('filmDescription', movieData.description);
    formData.set('filmOrigin', movieData.country);
    formData.set('filePoster', movieData.poster);
    try {
      const response = await axios.post(`${API_URL}/film`, formData);
      return response.data;
    } catch (error) {
      console.error('Error adding movie:', error);
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

  // Общие
  getAllData: async (): Promise<ApiResponse> => {
    try {
      const response = await axios.get(`${API_URL}/alldata`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all data:', error);
      throw error;
    }
  },
};