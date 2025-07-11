import { useState, useEffect } from 'react';
import { Button, Card } from 'react-bootstrap';
import { AddMoviePopup } from './AddMoviePopup';
import { api } from '../../../utils/api';
import { Film } from '../../../types/index';

export const MoviesManagement = () => {
  const [movies, setMovies] = useState<Film[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await api.getAllData();
      setMovies(data.films);
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
    const formData = new FormData();
    formData.set('filmName', movieData.name);
    formData.set('filmDuration', movieData.duration.toString());
    formData.set('filmDescription', movieData.description);
    formData.set('filmOrigin', movieData.country);
    formData.set('filePoster', movieData.poster);
    setShowAddPopup(false);
  };

  const handleDeleteMovie = async (id: number) => {
  };

  return (
    <div className="movies-management">
      <Button 
        variant="primary" 
        onClick={() => setShowAddPopup(true)}
        className="mb-3"
      >
        Добавить фильм
      </Button>

      <div className="movies-grid">
        {movies.map(movie => (
          <Card key={movie.id} className="movie-card">
            <Card.Img variant="top" src={movie.film_poster} />
            <Card.Body>
              <Card.Title>{movie.film_name}</Card.Title>
              <Card.Text>
                {movie.film_duration} мин • {movie.film_origin}
              </Card.Text>
              <Button 
                variant="danger"
                onClick={() => handleDeleteMovie(movie.id)}
              >
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