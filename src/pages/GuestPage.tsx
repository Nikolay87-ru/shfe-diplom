import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/guest/Header';
import { Calendar } from '../components/guest/Calendar';
import { MoviesList } from '@/components/guest/MoviesList';

export const GuestPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  return (
    <div className="guest-page">
      <Header />
      <CalendarNav 
        selectedDate={selectedDate}
        onChange={setSelectedDate}
      />
      <MoviesList 
        onSelectMovie={(movieId) => navigate(`/hall/${movieId}`)}
      />
    </div>
  );
};