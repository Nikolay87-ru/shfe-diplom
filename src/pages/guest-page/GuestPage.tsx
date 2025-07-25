import { useState, useEffect } from 'react';
import { Header } from '../../components/guest/Header/Header';
import { Calendar } from '../../components/guest/Calendar/Calendar';
import { MovieCard } from '../../components/guest/MovieCard/MovieCard';
import { api } from '../../utils/api';
import './GuestPage.scss';
import { Hall, Seance, Film } from '../../types';

export const GuestPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [movies, setMovies] = useState<
    {
      id: number;
      title: string;
      description: string;
      duration: number;
      country: string;
      poster: string;
      halls: {
        hall: Hall;
        sessions: {
          time: string;
          seanceId: number;
          hallId: number;
          disabled: boolean;
        }[];
      }[];
    }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getAllData();

        if (data.success && data.result) {
          const films = data.result.films || [];
          const seances = data.result.seances || [];
          const halls = data.result.halls || [];

          const currentDate = new Date();
          const isToday =
            selectedDate.getDate() === currentDate.getDate() &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear();

          const moviesData = films.map((film: Film) => {
            const filmSeances = seances.filter((s: Seance) => s.seance_filmid === film.id);

            const hallsData = halls
              .filter((hall: Hall) => hall.hall_open === 1)
              .map((hall: Hall) => {
                const hallSeances = filmSeances
                  .filter((s: Seance) => s.seance_hallid === hall.id)
                  .map((seance: Seance) => {
                    let disabled = false;
                    if (isToday) {
                      const [hours, minutes] = seance.seance_time.split(':').map(Number);
                      const seanceTime = new Date();
                      seanceTime.setHours(hours, minutes, 0, 0);

                      if (seanceTime < currentDate) {
                        disabled = true;
                      }
                    }

                    return {
                      time: seance.seance_time,
                      seanceId: seance.id,
                      hallId: hall.id,
                      disabled,
                    };
                  })
                  .sort((a, b) => a.time.localeCompare(b.time));

                return {
                  hall,
                  sessions: hallSeances,
                };
              })
              .filter((hallData) => hallData.sessions.length > 0);

            return {
              id: film.id,
              title: film.film_name,
              description: film.film_description,
              duration: film.film_duration,
              country: film.film_origin,
              poster: film.film_poster,
              halls: hallsData,
            };
          });

          setMovies(moviesData.filter((movie) => movie.halls.length > 0));
        }
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
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={{
              ...movie,
              halls: movie.halls.map((hallData) => ({
                name: hallData.hall.hall_name,
                open: hallData.hall.hall_open === 1,
                sessions: hallData.sessions,
              })),
            }}
          />
        ))}
      </div>
    </div>
  );
};
