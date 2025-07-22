import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.scss';

interface Session {
  time: string;
  seanceId: number;
  hallId: number;
  disabled: boolean;
}

interface HallData {
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
    halls: HallData[];
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
            <span className="duration" key="duration">
              {movie.duration} мин
            </span>
            <span className="country" key="country">
              {movie.country}
            </span>
          </div>
        </div>
      </div>

      <div className="sessions">
        {movie.halls.map((hall) => (
          <div key={`hall-${hall.name}-${hall.sessions[0]?.hallId}`} className="hall-sessions">
            <h4 className="hall-name" key={`hall-name-${hall.name}`}>
              {hall.name} {!hall.open && '(продажи закрыты)'}
            </h4>
            <ul className="session-list" key={`session-list-${hall.name}`}>
              {hall.sessions.map((session) => (
                <li key={`session-${session.seanceId}`}>
                  <button
                    className={`session-time ${session.disabled || !hall.open ? 'disabled' : ''}`}
                    onClick={() => handleSessionClick(session)}
                    disabled={session.disabled || !hall.open}
                    key={`btn-${session.seanceId}`}
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
