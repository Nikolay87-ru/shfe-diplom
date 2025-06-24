import { useState, useEffect } from 'react';
import { fetchMovies, createMovie, deleteMovie } from '../../../api/movieService';
import AdminSection from '../../../components/ui/AdminSection';
import MovieForm from './MovieForm';
import { type Movie } from '../../../types/movie';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

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

  const handleAddMovie = async (movieData: FormData) => {
    try {
      const data = await createMovie(movieData);
      setMovies(data.result.films);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const handleDeleteMovie = async (id: number) => {
    try {
      const data = await deleteMovie(id);
      setMovies(data.result.films);
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <AdminSection title="Сетка сеансов">
      <div className="admin__wrapper">
        <button 
          className="admin__button_movie button"
          onClick={() => setShowAddForm(true)}
        >
          Добавить фильм
        </button>

        <div className="movie-seances__wrapper">
          {movies.map((movie, index) => (
            <div 
              key={movie.id} 
              className={`movie-seances__movie background_${(index % 5) + 1}`}
              draggable="true"
            >
              <img 
                src={movie.film_poster} 
                alt="постер" 
                className="movie-seances__movie_poster" 
              />

              <div className="movie-seances__movie_info">
                <p className="movie_info-title">{movie.film_name}</p>
                <p className="movie_info-length">{movie.film_duration} минут</p>
              </div>
              
              <span 
                className="admin__button_remove movie-seances__movie_delete"
                onClick={() => handleDeleteMovie(movie.id)}
              ></span>
            </div>
          ))}
        </div>

        {showAddForm && (
          <MovieForm 
            onSave={handleAddMovie}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </div>
    </AdminSection>
  );
};

export default MoviesPage;