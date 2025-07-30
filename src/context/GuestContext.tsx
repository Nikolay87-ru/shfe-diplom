import { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../utils/api';
import { Film, Hall, Seance } from '../types';

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
  halls: Hall[];
  seances: Seance[];
  fetchData: () => Promise<void>;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider = ({ children }: { children: ReactNode }) => {
  const [moviesData, setMoviesData] = useState<{
    films: Film[];
    halls: Hall[];
    seances: Seance[];
  }>({ films: [], halls: [], seances: [] });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAllData();
      if (data.success && data.result) {
        setMoviesData({
          films: data.result.films || [],
          halls: data.result.halls || [],
          seances: data.result.seances || []
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const movies = useMemo(() => {
    return moviesData.films.map((film: Film) => ({
      id: film.id,
      title: film.film_name,
      description: film.film_description,
      duration: film.film_duration,
      country: film.film_origin,
      poster: film.film_poster
    }));
  }, [moviesData.films]);

  const value = useMemo(() => ({
    movies,
    loading,
    selectedDate,
    setSelectedDate,
    halls: moviesData.halls,
    seances: moviesData.seances,
    fetchData
  }), [movies, loading, selectedDate, moviesData.halls, moviesData.seances, fetchData]);

  return (
    <GuestContext.Provider value={value}>
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
