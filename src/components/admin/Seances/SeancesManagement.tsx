import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { SeanceItem } from './SeanceItem';
import { SeancesTimeline } from './SeancesTimeline';
import { AddSeancePopup } from './AddSeancePopup';
import { api } from '../../../utils/api';
import { Film, Hall, Seance } from '../../../types/index';

export const SeancesManagement = () => {
  const [movies, setMovies] = useState<Film[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [seances, setSeances] = useState<Seance[]>([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Film | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getAllData();
      setMovies(data.films);
      setHalls(data.halls);
      setSeances(data.seances);
    };
    fetchData();
  }, []);

  const handleAddSeance = async (hallId: number, movieId: number, time: string) => {
    const formData = new FormData();
    formData.set('seanceHallid', hallId.toString());
    formData.set('seanceFilmid', movieId.toString());
    formData.set('seanceTime', time);
    setShowAddPopup(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      // logic will be here in future
    }
  };

  return (
    <div className="seances-management">
      <div className="movies-list">
        <h3>Фильмы</h3>
        <div className="movies-grid">
          {movies.map(movie => (
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
        <DndContext onDragEnd={handleDragEnd}>
          {halls.map(hall => (
            <SeanceTimeline 
              key={hall.id}
              hall={hall}
              seances={seances.filter(s => s.seance_hallid === hall.id)}
              movies={movies}
            />
          ))}
        </DndContext>
      </div>

      <Button 
        variant="primary"
        onClick={() => setShowAddPopup(true)}
        className="add-seance-btn"
      >
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