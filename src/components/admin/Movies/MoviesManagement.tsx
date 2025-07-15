import { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { AddMoviePopup } from './AddMoviePopup';
import { api } from '../../../utils/api';
import { Film } from '../../../types';

export const MoviesManagement = () => {
  const [movies, setMovies] = useState<Film[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await api.getAllData();
        if (data.success && data.result?.films) {
          setMovies(data.result.films);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      }
    };
    fetchMovies();
  }, []);

  const handleAddMovie = async (movieData: {
    name: string;
    duration: number;
    description: string;
    country: string;
    poster: File;
  }) => {
    try {
      const response = await api.addMovie(movieData);
      if (response.success) {
        setMovies((prev) => [...prev, response.result.film]);
        setShowAddPopup(false);
      }
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  const handleDeleteMovie = async (id: number) => {
    try {
      await api.deleteMovie(id);
      setMovies((prev) => prev.filter((movie) => movie.id !== id));
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  return (
    <div className="movies-management">
      <Button variant="primary" onClick={() => setShowAddPopup(true)} className="mb-3">
        Добавить фильм
      </Button>

      <div className="movies-grid">
        {movies.map((movie) => (
          <Card key={movie.id} className="movie-card">
            <Card.Img variant="top" src={movie.film_poster} />
            <Card.Body>
              <Card.Title>{movie.film_name}</Card.Title>
              <Card.Text>
                {movie.film_duration} мин • {movie.film_origin}
              </Card.Text>
              <Button variant="danger" onClick={() => handleDeleteMovie(movie.id)}>
                Удалить
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      <AddMoviePopup
        show={showAddPopup}
        onClose={() => setShowAddPopup(false)}
        onSave={handleAddMovie}
      />
    </div>
  );
};
