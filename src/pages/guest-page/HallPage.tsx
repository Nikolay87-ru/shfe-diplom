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
  const [selectedSeats, setSelectedSeats] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getAllData();

        const currentSeance = data.seances.find((s: any) => s.id === Number(id));
        if (!currentSeance) {
          navigate('/');
          return;
        }

        const film = data.films.find((f: any) => f.id === currentSeance.seance_filmid);
        const hallData = data.halls.find((h: any) => h.id === currentSeance.seance_hallid);

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

  const handleSeatSelect = (rowIndex: number, seatIndex: number) => {
    setSelectedSeats((prev) => {
      const existingIndex = prev.findIndex(([r, s]) => r === rowIndex && s === seatIndex);
      if (existingIndex >= 0) {
        return prev.filter((_, i) => i !== existingIndex);
      } else {
        return [...prev, [rowIndex, seatIndex]];
      }
    });
  };

  const handleBuy = () => {
    if (selectedSeats.length === 0) {
      alert('Выберите хотя бы одно место!');
      return;
    }
    navigate(`/payment/${id}`, { state: { selectedSeats } });
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!movie || !hall || !seance) {
    return null;
  }

  const rows = hall.hall_config.map((row: string[], rowIndex: number) => ({
    seats: row.map((seatType, seatIndex) => ({
      type: seatType === 'disabled' ? 'disabled' : seatType === 'vip' ? 'vip' : 'standart',
      selected: selectedSeats.some(([r, s]) => r === rowIndex && s === seatIndex),
      occupied: false,
    })),
  }));

  return (
    <div className="hall-page">
      <Header />

      <div className="buying-info">
        <div className="container">
          <div className="movie-info">
            <h2 className="title">{movie.film_name}</h2>
            <p className="start">Начало сеанса: {seance.seance_time}</p>
            <h3 className="hall-name">{hall.hall_name}</h3>
          </div>
        </div>
      </div>

      <HallScheme rows={rows} onSeatSelect={handleSeatSelect} onBuy={handleBuy} />
    </div>
  );
};
