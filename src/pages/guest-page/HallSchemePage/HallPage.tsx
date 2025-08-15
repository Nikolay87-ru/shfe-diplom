import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/guest/Header/Header';
import { HallScheme } from './HallPage-component/HallScheme';
import { useGuest } from '@/context/hooks/useGuest';
import hintImg from '@assets/hint.png';
import './HallPage.scss';

export const HallPage = React.memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isZoomed, setIsZoomed] = useState(false);
  const { movies, halls, seances, loading } = useGuest();

  const { movie, hall, seance } = React.useMemo(() => {
    if (loading || !id) return { movie: null, hall: null, seance: null };

    const currentSeance = seances.find((s) => s.id === Number(id));
    if (!currentSeance) {
      navigate('/');
      return { movie: null, hall: null, seance: null };
    }

    const film = movies.find((f) => f.id === currentSeance.seance_filmid);
    const hallData = halls.find((h) => h.id === currentSeance.seance_hallid);

    return {
      movie: film || null,
      hall: hallData || null,
      seance: currentSeance
    };
  }, [id, movies, halls, seances, loading, navigate]);

  const handleDoubleClick = () => {
    if (window.innerWidth <= 1200) {
      setIsZoomed(!isZoomed);
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!movie || !hall || !seance) {
    return null;
  }

  return (
    <div className="hall-layout">
      <div
        className={`hall-page ${isZoomed ? 'hall-page--zoomed' : ''}`}
        onDoubleClick={handleDoubleClick}
      >
        <Header showLoginButton={false} />

        <div className="buying-info">
          <div className="buying-container">
            <div className="movie-info">
              <h2 className="title">{movie.film_name}</h2>
              <p className="start">Начало сеанса: {seance.seance_time}</p>
              <h3 className="hall-name">{hall.hall_name}</h3>
            </div>
            <div className="click-info">
              <img src={hintImg} alt="Тап" className="hint-image" />
              <div className="hint-text">Тапните дважды, чтобы увеличить</div>
            </div>
          </div>
        </div>

        <HallScheme />
      </div>
    </div>
  );
});