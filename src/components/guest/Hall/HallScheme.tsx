import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../../utils/api';
import { Hall, Seance, Film } from '../../../types/index';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './HallScheme.scss';

interface Seat {
  type: 'standart' | 'vip' | 'disabled';
  selected: boolean;
  occupied: boolean;
}

interface Row {
  seats: Seat[];
}

export const HallScheme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState<Film | null>(null);
  const [hall, setHall] = useState<Hall | null>(null);
  const [seance, setSeance] = useState<Seance | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<[number, number][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await api.getAllData();
        
        const currentSeance = data.result?.seances?.find((s: any) => s.id === Number(id));
        if (!currentSeance) {
          navigate('/');
          return;
        }
  
        const film = data.result?.films?.find((f: any) => f.id === currentSeance.seance_filmid);
        const hallData = data.result?.halls?.find((h: any) => h.id === currentSeance.seance_hallid);
  
        setMovie(film || null);
        setHall(hallData || null);
        setSeance(currentSeance);
  
        const rowsData = hallData?.hall_config.map((row: string[], rowIndex: number) => ({
          if (hallData) {
            setRows(rowsData || []);
          },
          seats: row.map((seatType, seatIndex) => ({
            type: seatType === 'disabled' ? 'disabled' : 
                 seatType === 'vip' ? 'vip' : 'standart',
            selected: false,
            occupied: seatType === 'disabled' 
          })),
        }));
  
        setRows(rowsData);
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
    if (rows[rowIndex]?.seats[seatIndex]?.occupied) return;

    setSelectedSeats((prev) => {
      const existingIndex = prev.findIndex(([r, s]) => r === rowIndex && s === seatIndex);
      if (existingIndex >= 0) {
        return prev.filter((_, i) => i !== existingIndex);
      } else {
        return [...prev, [rowIndex, seatIndex]];
      }
    });

    setRows((prev) => {
      const newRows = [...prev];
      const seat = newRows[rowIndex].seats[seatIndex];
      newRows[rowIndex].seats[seatIndex] = {
        ...seat,
        selected: !seat.selected,
      };
      return newRows;
    });
  };

  async function handleBuy() {
    if (selectedSeats.length === 0) {
      toast.info('Выберите хотя бы одно место!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
  
    try {
      const tickets = selectedSeats.map(([row, seat]) => ({
        row: row + 1,
        place: seat + 1,
        coast: rows[row].seats[seat].type === 'vip' 
          ? hall?.hall_price_vip 
          : hall?.hall_price_standart,
      }));
  
      if (!hall) return;

      const currentConfig = [...hall.hall_config];
      await api.updateHallConfig(hall.id, {
        rowCount: hall.hall_rows,
        placeCount: hall.hall_places,
        config: currentConfig
      });
  
      await api.updateHallConfig(hall.id, {
        rowCount: hall.hall_rows,
        placeCount: hall.hall_places,
        config: currentConfig
      });
  
      localStorage.setItem('tickets', JSON.stringify(tickets));
      localStorage.setItem('seanceId', id || '');
      localStorage.setItem('movie', JSON.stringify(movie));
      localStorage.setItem('hall', JSON.stringify(hall));
      localStorage.setItem('seance', JSON.stringify(seance));
  
      navigate(`/ticket/${id}`);
    } catch (error) {
      console.error('Error booking seats:', error);
      toast.error('Произошла ошибка при бронировании мест', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!movie || !hall || !seance) {
    return null;
  }

  return (
    <div className="hall-scheme">
      <div className="screen"></div>

      <div className="rows">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.seats.map((seat, seatIndex) => (
              <button
                key={seatIndex}
                className={`seat ${seat.type} ${seat.selected ? 'selected' : ''} ${seat.occupied ? 'occupied' : ''}`}
                onClick={() => handleSeatSelect(rowIndex, seatIndex)}
                disabled={seat.occupied || seat.type === 'disabled'}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="seat standart"></div>
          <span>Обычные ({hall.hall_price_standart} руб)</span>
        </div>
        <div className="legend-item">
          <div className="seat vip"></div>
          <span>VIP ({hall.hall_price_vip} руб)</span>
        </div>
        <div className="legend-item">
          <div className="seat occupied"></div>
          <span>Занято</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Выбрано</span>
        </div>
      </div>

      <div className="container-button">
        {' '}
        <button className="buy-button" onClick={handleBuy}>
          Забронировать ({selectedSeats.length})
        </button>
      </div>
    </div>
  );
};
