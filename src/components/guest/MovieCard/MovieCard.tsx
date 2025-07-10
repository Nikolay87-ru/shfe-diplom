import './MovieCard.scss';

interface Session {
  time: string;
  disabled: boolean;
}

interface Hall {
  name: string;
  sessions: Session[];
}

interface MovieCardProps {
  movie: {
    title: string;
    description: string;
    duration: number;
    country: string;
    poster: string;
    halls: Hall[];
  };
}

export const MovieCard = ({ movie }: MovieCardProps) => {
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
        {movie.halls.map(hall => (
          <div key={hall.name} className="hall-sessions">
            <h4 className="hall-name">{hall.name}</h4>
            <ul className="session-list">
              {hall.sessions.map((session, index) => (
                <li key={index}>
                  <button 
                    className={`session-time ${session.disabled ? 'disabled' : ''}`}
                    disabled={session.disabled}
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