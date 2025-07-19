import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Film } from '../types';

interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  country: string;
  poster: string;
}

interface GuestContextType {
  movies: Movie[];
  loading: boolean;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await api.getAllData();
        if (data.success && data.result) {
          const films = (data.result?.films || []).map((film: Film) => ({
            id: film.id,
            title: film.film_name,
            description: film.film_description,
            duration: film.film_duration,
            country: film.film_origin,
            poster: film.film_poster
          }));
          setMovies(films);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedDate]);

  return (
    <GuestContext.Provider value={{ movies, loading, selectedDate, setSelectedDate }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};