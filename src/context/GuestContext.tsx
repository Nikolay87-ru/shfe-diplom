import { createContext } from 'react';
import { Hall, Seance } from '@/types';

interface Movie {
  id: number;
  film_name: string;
  film_description: string;
  film_duration: number;
  film_origin: string;
  film_poster: string;
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




