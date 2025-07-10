import axios from 'axios';

const API_URL = 'https://shfe-diplom.neto-server.ru';

export const api = {
  getAllData: async () => {
    const response = await axios.get(`${API_URL}/alldata`);
    return response.data.result;
  },

  getSeanceData: async (seanceId: number) => {
    const response = await axios.get(`${API_URL}/seance/${seanceId}`);
    return response.data;
  },

  bookTickets: async (seanceId: number, seats: { row: number, seat: number }[]) => {
    const response = await axios.post(`${API_URL}/booking`, {
      seanceId,
      seats
    });
    return response.data;
  }
};