import { useEffect, useState } from 'react';
import { fetchMovies } from '../../api/movieService';
import { type Movie } from '../../types/movie';
// import MovieCard from '../../components/guest/MovieCard';
import DateSelector from '../../pages/guest/DateSelector';

const HomePage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchMovies();
        setMovies(data.result.films);
      } catch (error) {
        console.error('Error loading movies:', error);
      }
    };

    loadMovies();
  }, []);

  return (
    <div className="container py-4">
      <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      
      <div className="mt-4">
        {movies.map(movie => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            selectedDate={selectedDate}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;