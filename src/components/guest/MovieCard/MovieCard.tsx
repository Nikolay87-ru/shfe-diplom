import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.scss';

interface Session {
  time: string;
  seanceId: number;
  hallId: number;
  disabled: boolean;
}

interface Hall {
  name: string;
  open: boolean;
  sessions: Session[];
}

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    description: string;
    duration: number;
    country: string;
    poster: string;
    halls: Hall[];
  };
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();

  const handleSessionClick = (session: Session) => {
    if (!session.disabled) {
      localStorage.setItem('seanceId', session.seanceId.toString());
      navigate(`/hall/${session.seanceId}`);
    }
  };

  const hasOpenHalls = movie.halls.some(hall => 
    hall.open && hall.sessions.some(session => !session.disabled)
  );

  return (
    <div className="movie-card">
      <div className="movie-info">
        <div className="poster-container">
          <img src={movie.poster} alt={movie.title} className="poster" />
        </div>
        <div className="description">
          <h3 className="title">{movie.title}</h3>
          <p className="synopsis">{movie.description}</p>
          <div className="meta">
            <span className="duration">{movie.duration} мин</span>
            <span className="country">{movie.country}</span>
          </div>
        </div>
      </div>

      <div className="sessions">
        {movie.halls.map((hall) => (
          <div key={hall.name} className="hall-sessions">
            <h4 className="hall-name">{hall.name} {!hall.open && '(продажи закрыты)'}</h4>
            <ul className="session-list">
              {hall.sessions.map((session, index) => (
                <li key={index}>
                  <button
                    className={`session-time ${session.disabled || !hall.open ? 'disabled' : ''}`}
                    onClick={() => handleSessionClick(session)}
                    disabled={session.disabled || !hall.open}
                  >
                    {session.time}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};