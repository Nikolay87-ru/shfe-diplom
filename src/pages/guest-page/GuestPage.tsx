import React, { useMemo } from 'react';
import { Header } from '@/components/guest/Header/Header';
import { Calendar } from '@/components/guest/Calendar/Calendar';
import { MovieCard } from '@/components/guest/MovieCard/MovieCard';
import { useGuest } from '@/context/hooks/useGuest';
import { GuestProvider } from '@/context/provider/GuestProvider';
import './GuestPage.scss';

const GuestPageContent = React.memo(() => {
  const { movies, halls, seances, loading, selectedDate, setSelectedDate } = useGuest();

  const filteredMovies = useMemo(() => {
    if (loading) return [];
    
    const currentDate = new Date();
    const isToday = 
      selectedDate.getDate() === currentDate.getDate() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear();

    return movies.map((movie) => {
      const filmSeances = seances.filter((s) => s.seance_filmid === movie.id);

      const hallsData = halls
        .filter((hall) => hall.hall_open === 1)
        .map((hall) => {
          const hallSeances = filmSeances
            .filter((s) => s.seance_hallid === hall.id)
            .map((seance) => {
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
        ...movie,
        halls: hallsData,
      };
    }).filter((movie) => movie.halls.length > 0);
  }, [movies, halls, seances, loading, selectedDate]);

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="guest-page">
      <Header />
      <Calendar selectedDate={selectedDate} onChange={setSelectedDate} />

      <div className="container">
        {filteredMovies.map((movie) => (
          <MovieCard 
            key={movie.id} 
            movie={{
              ...movie,
              halls: movie.halls.map(hallData => ({
                name: hallData.hall.hall_name,
                open: hallData.hall.hall_open === 1,
                sessions: hallData.sessions
              }))
            }} 
          />
        ))}
      </div>
    </div>
  );
});

export const GuestPage = () => (
  <GuestProvider>
    <GuestPageContent />
  </GuestProvider>
);
