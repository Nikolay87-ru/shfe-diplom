import { useState, useEffect } from 'react';
import { Header } from '../../components/guest/Header/Header';
import { Calendar } from '../../components/guest/Calendar/Calendar';
import { MovieCard } from '../../components/guest/MovieCard/MovieCard';
import { api } from '../../utils/api';
import './GuestPage.scss';

export const GuestPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getAllData();
        const films = data.films;
        const seances = data.seances;
        
        const moviesData = films.map(film => {
          const filmSeances = seances.filter(s => s.seance_filmid === film.id);
          
          const hallsMap = new Map();
          filmSeances.forEach(seance => {
            const hall = data.halls.find(h => h.id === seance.seance_hallid);
            if (!hallsMap.has(hall.hall_name)) {
              hallsMap.set(hall.hall_name, []);
            }
            hallsMap.get(hall.hall_name).push({
              time: seance.seance_time,
              disabled: false 
            });
          });
          
          return {
            id: film.id,
            title: film.film_name,
            description: film.film_description,
            duration: film.film_duration,
            country: film.film_origin,
            poster: film.film_poster,
            halls: Array.from(hallsMap.entries()).map(([name, sessions]) => ({
              name,
              sessions
            }))
          };
        });
        
        setMovies(moviesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedDate]);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="guest-page">
      <Header />
      <Calendar selectedDate={selectedDate} onChange={setSelectedDate} />
      
      <div className="container">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};