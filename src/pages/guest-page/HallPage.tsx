import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/guest/Header/Header';
import { HallScheme } from '../../components/guest/Hall/HallScheme';
import { api } from '../../utils/api';
// import './HallPage.scss';

export const HallPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [hall, setHall] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<[number, number][]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getAllData();
        const seance = data.seances.find(s => s.id === Number(id));
        if (!seance) {
          navigate('/');
          return;
        }
        
        const film = data.films.find(f => f.id === seance.seance_filmid);
        const hallData = data.halls.find(h => h.id === seance.seance_hallid);
        
        setMovie(film);
        setHall(hallData);
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/');
      }
    };
    
    fetchData();
  }, [id, navigate]);

  const handleSeatSelect = (rowIndex: number, seatIndex: number) => {
    setSelectedSeats(prev => {
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

  if (!movie || !hall) {
    return <div className="loading">Загрузка...</div>;
  }

  const rows = hall.hall_config.map((row: string[], rowIndex: number) => ({
    seats: row.map((seatType, seatIndex) => ({
      type: seatType === 'disabled' ? 'disabled' : 
            seatType === 'vip' ? 'vip' : 'standart',
      selected: selectedSeats.some(([r, s]) => r === rowIndex && s === seatIndex),
      occupied: false 
    }))
  }));

  return (
    <div className="hall-page">
      <Header />
      
      <div className="buying-info">
        <div className="container">
          <div className="movie-info">
            <h3 className="title">{movie.film_name}</h3>
            <p className="time">{hall.hall_name} • {seance.seance_time}</p>
          </div>
        </div>
      </div>
      
      <HallScheme rows={rows} onSeatSelect={handleSeatSelect} />
    </div>
  );
};