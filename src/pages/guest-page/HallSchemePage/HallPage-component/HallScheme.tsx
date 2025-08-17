import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/utils/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGuest } from '@/context/hooks/useGuest';
import './HallScheme.scss';

interface Seat {
  type: 'standart' | 'vip' | 'disabled' | 'taken';
  selected: boolean;
  occupied: boolean;
}

interface Row {
  seats: Seat[];
}

export const HallScheme = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { movies, halls, seances, selectedDate } = useGuest();
  const [rows, setRows] = useState<Row[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<[number, number][]>([]);
  const [loading, setLoading] = useState(true);

  const seance = seances.find(s => s.id === Number(id));
  const movie = movies.find(m => m.id === seance?.seance_filmid);
  const hall = halls.find(h => h.id === seance?.seance_hallid);

  useEffect(() => {
    if (!seance || !hall) {
      navigate('/');
      return;
    }

    const fetchHallConfig = async () => {
      try {
        const ticketDate = selectedDate.toISOString().split('T')[0];
        const hallConfigResponse = await api.getHallConfig(
          seance.id.toString(),
          ticketDate
        );
        
        const configToUse = hallConfigResponse.success && Array.isArray(hallConfigResponse.result) 
          ? hallConfigResponse.result 
          : hall.hall_config;

        const rowsData = configToUse.map((row: string[]) => ({
          seats: row.map((seatType) => {
            const type = seatType as 'standart' | 'vip' | 'disabled' | 'taken';
            return {
              type,
              selected: false,
              occupied: type === 'disabled' || type === 'taken',
            };
          }),
        }));
        
        setRows(rowsData);
      } catch (error) {
        console.error('Error fetching hall config:', error);
        toast.error('Ошибка загрузки схемы зала');
      } finally {
        setLoading(false);
      }
    };

    fetchHallConfig();
  }, [seance, hall, navigate, selectedDate]);

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
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!hall || !seance || !movie) return;

    try {
      const tickets = selectedSeats.map(([row, seat]) => ({
        row: row + 1,
        place: seat + 1,
        coast: rows[row].seats[seat].type === 'vip' ? hall.hall_price_vip : hall.hall_price_standart,
      }));

      localStorage.setItem('tickets', JSON.stringify(tickets));
      localStorage.setItem('seanceId', id || '');
      localStorage.setItem('movie', JSON.stringify(movie));
      localStorage.setItem('hall', JSON.stringify(hall));
      localStorage.setItem('seance', JSON.stringify(seance));
      localStorage.setItem('seanceDate', selectedDate.toISOString());

      navigate(`/ticket/${id}`);
    } catch (error) {
      console.error('Error booking seats:', error);
      toast.error(
        error instanceof Error ? error.message : 'Произошла ошибка при бронировании мест',
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        },
      );
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
        <button className="buy-button" onClick={handleBuy}>
          Забронировать ({selectedSeats.length})
        </button>
      </div>
    </div>
  );
};