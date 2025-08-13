import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import './AddSeancePopup.scss';
import { Film, Hall } from '@/types';

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (hallId: number, movieId: number, time: string) => Promise<void> | void;
  halls: Hall[];
  movies: Film[];
  initialHall?: Hall;
  initialMovie?: Film;
  seances: Array<{
    id: number;
    seance_filmid: number;
    seance_hallid: number;
    seance_time: string;
  }>;
}

export const AddSeancePopup: React.FC<Props> = ({ 
  show, 
  onClose, 
  onSave, 
  halls, 
  movies,
  seances,
  initialHall,
  initialMovie
}) => {
  const [selectedHall, setSelectedHall] = useState<number | undefined>(initialHall?.id);
  const [selectedMovie, setSelectedMovie] = useState<number | undefined>(initialMovie?.id);
  const [time, setTime] = useState('00:00');
  const [conflicts, setConflicts] = useState<string[]>([]);

  useEffect(() => {
    if (show) {
      setSelectedHall(initialHall?.id || halls[0]?.id);
      setSelectedMovie(initialMovie?.id || movies[0]?.id);
      setTime('00:00');
      setConflicts([]);
    }
  }, [halls, movies, show, initialHall, initialMovie]);

  function checkConflicts(): string[] {
    if (!selectedHall || !selectedMovie) return [];
    
    const movie = movies.find((m) => m.id === selectedMovie);
    if (!movie) return [];
    
    const [h, m] = time.split(':').map(Number);
    const start = h * 60 + m;
    const end = start + movie.film_duration;
      
    const conflicts: string[] = [];
    
    const hallSeances = seances.filter(s => s.seance_hallid === selectedHall);
      
    for (const s of hallSeances) {
      const mo = movies.find((m) => m.id === s.seance_filmid);
      if (!mo) continue;
      
      const [sh, sm] = s.seance_time.split(':').map(Number);
      const sStart = sh * 60 + sm;
      const sEnd = sStart + mo.film_duration;
        
      if (
        (start >= sStart && start < sEnd) ||
        (end > sStart && end <= sEnd) ||
        (start <= sStart && end >= sEnd)
      ) {
        conflicts.push(`Конфликт с "${mo.film_name}" в ${s.seance_time}`);
      }
    }
    
    return conflicts;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedHall || !selectedMovie || !time) return;
    const found = checkConflicts();
    setConflicts(found);
    if (found.length === 0) {
      onSave(selectedHall, selectedMovie, time);
      onClose();
    }
  }

  if (!show) return null;
  
  const currentHall = halls.find(h => h.id === selectedHall);
  const currentMovie = movies.find(m => m.id === selectedMovie);

  return (
    <div className="popup">
      <div className="popup__container">
        <div className="popup__header">
          <div className="popup__header_text">Добавление сеанса</div>
          <div className="popup__close" onClick={onClose}>
            <IoClose size={35} style={{ strokeWidth: 40 }}/>
          </div>
        </div>
        <form className="popup__form" onSubmit={handleSubmit}>
          <label className="admin_label add-seance_label">
            Название зала
            <div className="add-seance__static-value">
              {currentHall?.hall_name || 'Не выбран'}
            </div>
          </label>

          <label className="admin_label add-seance_label">
            Название фильма
            <div className="add-seance__static-value">
              {currentMovie?.film_name || 'Не выбран'}
            </div>
          </label>

          <label className="admin_label add-seance_label" id="seance_time">
            Время начала
            <input
              type="time"
              className="admin_input add-seans__input_time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </label>
          {conflicts.length > 0 && (
            <div style={{ color: 'red', lineHeight: '1.4', marginTop: 8 }}>
              <span style={{ fontWeight: 700 }}>Обнаружены конфликты:</span>
              <ul style={{ margin: '3px 0 0 17px', padding: 0 }}>
                {conflicts.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="popup__buttons">
            <button type="button" className="button popup__button_cancel" onClick={onClose}>
              Отменить
            </button>
            <button
              type="submit"
              className={
                'button' + (!(selectedHall && selectedMovie && time) ? ' button_disabled' : '')
              }
              disabled={!(selectedHall && selectedMovie && time)}
            >
              Добавить сеанс
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
