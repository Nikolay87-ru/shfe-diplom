import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Film, Hall } from '../../../types/index';
import { api } from '../../../utils/api';

interface AddSeancePopupProps {
  show: boolean;
  onClose: () => void;
  onSave: (hallId: number, movieId: number, time: string) => void;
  movies: Film[];
  halls: Hall[];
}

export const AddSeancePopup = ({ 
  show, 
  onClose, 
  onSave, 
  movies, 
  halls 
}: AddSeancePopupProps) => {
  const [selectedHallId, setSelectedHallId] = useState<number>(0);
  const [selectedMovieId, setSelectedMovieId] = useState<number>(0);
  const [time, setTime] = useState('00:00');
  const [movieDuration, setMovieDuration] = useState(0);
  const [conflicts, setConflicts] = useState<string[]>([]);

  useEffect(() => {
    if (selectedMovieId) {
      const movie = movies.find(m => m.id === selectedMovieId);
      if (movie) {
        setMovieDuration(movie.film_duration);
      }
    }
  }, [selectedMovieId, movies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedHallId || !selectedMovieId || !time) {
      alert('Выберите зал, фильм и время');
      return;
    }

    const conflicts = await checkTimeConflicts();
    if (conflicts.length > 0) {
      setConflicts(conflicts);
      return;
    }

    onSave(selectedHallId, selectedMovieId, time);
    resetForm();
  };

  const checkTimeConflicts = async (): Promise<string[]> => {
    const data = await api.getAllData();
    const hallSeances = data.seances.filter(s => s.seance_hallid === selectedHallId);
    
    const [hours, minutes] = time.split(':').map(Number);
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + movieDuration;
    
    const newConflicts: string[] = [];
    
    hallSeances.forEach(seance => {
      const movie = movies.find(m => m.id === seance.seance_filmid);
      if (!movie) return;
      
      const [sHours, sMinutes] = seance.seance_time.split(':').map(Number);
      const sStart = sHours * 60 + sMinutes;
      const sEnd = sStart + movie.film_duration;
      
      if ((startMinutes >= sStart && startMinutes < sEnd) || 
          (endMinutes > sStart && endMinutes <= sEnd) ||
          (startMinutes <= sStart && endMinutes >= sEnd)) {
        newConflicts.push(
          `Конфликт с сеансом "${movie.film_name}" в ${seance.seance_time}`
        );
      }
    });
    
    return newConflicts;
  };

  const resetForm = () => {
    setSelectedHallId(0);
    setSelectedMovieId(0);
    setTime('00:00');
    setConflicts([]);
    onClose();
  };

  return (
    <Modal show={show} onHide={resetForm} centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавление сеанса</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Название зала</Form.Label>
            <Form.Select
              value={selectedHallId}
              onChange={(e) => setSelectedHallId(Number(e.target.value))}
              required
            >
              <option value="">Выберите зал</option>
              {halls.map(hall => (
                <option key={hall.id} value={hall.id}>
                  {hall.hall_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Название фильма</Form.Label>
            <Form.Select
              value={selectedMovieId}
              onChange={(e) => setSelectedMovieId(Number(e.target.value))}
              required
            >
              <option value="">Выберите фильм</option>
              {movies.map(movie => (
                <option key={movie.id} value={movie.id}>
                  {movie.film_name} ({movie.film_duration} мин)
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Время начала</Form.Label>
            <Form.Control
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </Form.Group>

          {conflicts.length > 0 && (
            <div className="alert alert-danger">
              <h6>Обнаружены конфликты:</h6>
              <ul>
                {conflicts.map((conflict, i) => (
                  <li key={i}>{conflict}</li>
                ))}
              </ul>
            </div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={resetForm}>
          Отменить
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Добавить сеанс
        </Button>
      </Modal.Footer>
    </Modal>
  );
};