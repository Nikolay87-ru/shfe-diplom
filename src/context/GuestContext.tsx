import { createContext } from 'react';
import { Hall, Seance } from '../types';

interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  country: string;
  poster: string;
}

export interface GuestContextType {
  movies: Movie[];
  loading: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  halls: Hall[];
  seances: Seance[];
  fetchData: () => Promise<void>;
}

export const GuestContext = createContext<GuestContextType | undefined>(undefined);




