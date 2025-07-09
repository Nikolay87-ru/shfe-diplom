import './MovieCard.scss';

export const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card">
      <div className="poster-container">
        <img src={movie.poster} alt={movie.title} className="poster" />
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="synopsis">{movie.description}</p>
        <div className="meta">
          <span>{movie.duration} мин.</span>
          <span>{movie.country}</span>
        </div>
      </div>
      <div className="sessions">
        {movie.halls.map(hall => (
          <div key={hall.id} className="hall-sessions">
            <h4>{hall.name}</h4>
            <div className="session-times">
              {hall.sessions.map(session => (
                <button 
                  key={session.time} 
                  className="session-time"
                  disabled={session.disabled}
                >
                  {session.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};