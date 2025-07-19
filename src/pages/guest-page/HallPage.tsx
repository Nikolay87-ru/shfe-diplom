import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/guest/Header/Header';
import { HallScheme } from '../../components/guest/Hall/HallScheme';
import { api } from '../../utils/api';
import './HallPage.scss';

export const HallPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<unknown>(null);
  const [hall, setHall] = useState<unknown>(null);
  const [seance, setSeance] = useState<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getAllData();

        const currentSeance = data.result?.seances?.find((s: unknown) => s.id === Number(id));
        if (!currentSeance) {
          navigate('/');
          return;
        }

        const film = data.result?.films?.find((f: unknown) => f.id === currentSeance.seance_filmid);
        const hallData = data.result?.halls?.find((h: unknown) => h.id === currentSeance.seance_hallid);

        setMovie(film);
        setHall(hallData);
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

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!movie || !hall || !seance) {
    return null;
  }

  return (
    <div className="hall-page">
      <Header />

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
