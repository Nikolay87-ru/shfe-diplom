import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../../components/guest/Header/Header';
import { HallScheme } from './HallPage-component/HallScheme';
import { api } from '../../../utils/api';
import './HallPage.scss';

interface Film {
  id: number;
  film_name: string;
  film_poster: string;
}

interface Hall {
  id: number;
  hall_name: string;
}

interface Seance {
  id: number;
  seance_time: string;
  seance_filmid: number;
  seance_hallid: number;
}

export const HallPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<Film | null>(null);
  const [hall, setHall] = useState<Hall | null>(null);
  const [seance, setSeance] = useState<Seance | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getAllData();

        const currentSeance = data.result?.seances?.find((s: Seance) => s.id === Number(id));
        if (!currentSeance) {
          navigate('/');
          return;
        }

        const film = data.result?.films?.find((f: Film) => f.id === currentSeance.seance_filmid);
        const hallData = data.result?.halls?.find(
          (h: Hall) => h.id === currentSeance.seance_hallid,
        );

        setMovie(film || null);
        setHall(hallData || null);
        setSeance(currentSeance);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

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
            <img src="/assets/hint.png" alt="Тап" className="hint-image" />
            <div className="hint-text">Тапните дважды, чтобы увеличить</div>
          </div>
        </div>
      </div>

      <HallScheme />
    </div>
  );
};
