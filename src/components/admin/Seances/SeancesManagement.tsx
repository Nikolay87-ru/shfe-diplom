import { useState, useEffect } from 'react';
import { SeancesTimeline } from './SeancesTimeline';
import { AddSeancePopup } from './AddSeancePopup';
import { api } from '../../../utils/api';
import { Film, Hall, Seance } from '../../../types/index';
import { Button } from 'react-bootstrap';

export const SeancesManagement = () => {
  const [movies, setMovies] = useState<Film[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [seances, setSeances] = useState<Seance[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getAllData();
        if (data.success && data.result) {
          setMovies(data.result.films || []);
          setHalls(data.result.halls || []);
          setSeances(data.result.seances || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddSeance = async (hallId: number, movieId: number, time: string) => {
    try {
      const response = await api.addSeance({
        hallId,
        movieId,
        time,
      });
      if (response.success) {
        setSeances((prev) => [...prev, response.result.seance]);
        setShowAddPopup(false);
      }
    } catch (error) {
      console.error('Error adding seance:', error);
    }
  };

  const handleSeanceMove = async (activeId: number, overId: number) => {
    console.log(`Move seance ${activeId} to ${overId}`);
  };

  const handleDeleteSeance = async (id: number) => {
    try {
      await api.deleteSeance(id);
      setSeances((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Error deleting seance:', error);
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="seances-management">
      <div className="movies-list">
        <h3>Фильмы</h3>
        <div className="movies-grid">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={`movie-card ${selectedMovie?.id === movie.id ? 'selected' : ''}`}
              onClick={() => setSelectedMovie(movie)}
              draggable
            >
              <img src={movie.film_poster} alt={movie.film_name} />
              <div className="movie-info">
                <h4>{movie.film_name}</h4>
                <p>{movie.film_duration} мин</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="timelines">
        {halls.map((hall) => (
          <div key={hall.id} className="timeline">
            <h3 className="hall-title">{hall.hall_name}</h3>
            <SeancesTimeline
              seances={seances.filter((s) => s.seance_hallid === hall.id)}
              onSeanceMove={handleSeanceMove}
            />
          </div>
        ))}
      </div>

      <Button variant="primary" onClick={() => setShowAddPopup(true)} className="add-seance-btn">
        Добавить сеанс
      </Button>

      <AddSeancePopup
        show={showAddPopup}
        onClose={() => setShowAddPopup(false)}
        onSave={handleAddSeance}
        movies={movies}
        halls={halls}
      />
    </div>
  );
};
