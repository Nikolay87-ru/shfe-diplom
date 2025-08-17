import React, { useEffect, useState } from 'react';
import { Header } from '@/components/guest/Header/Header';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGuest } from '@/context/hooks/useGuest';
import { api } from '@/utils/api';
import './TicketPage.scss';

interface Ticket {
  row: number;
  place: number;
  coast: number;
}

export const TicketPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [qrCode, setQrCode] = useState('');
  const [bookingCode, setBookingCode] = useState('');
  const [seanceDate, setSeanceDate] = useState<string | null>(null);
  const { movies, halls, seances, loading } = useGuest();

  const seance = seances.find((s) => s.id === Number(id));
  const movie = movies.find((m) => m.id === seance?.seance_filmid);
  const hall = halls.find((h) => h.id === seance?.seance_hallid);

  useEffect(() => {
    const storedTickets = localStorage.getItem('tickets');
    const storedDate = localStorage.getItem('seanceDate');
    
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    }
    if (storedDate) {
      setSeanceDate(storedDate);
    }
  }, []);

  const handleGetBookingCode = async () => {
    try {
      if (!seance || !hall || !seanceDate) {
        throw new Error('Недостаточно данных для бронирования');
      }

      const seanceId = seance.id.toString();
      const ticketDate = new Date(seanceDate).toISOString().split('T')[0];
      const ticketsData = tickets.map((ticket) => ({
        row: ticket.row,
        place: ticket.place,
        coast: ticket.coast,
      }));

      const hallConfigResponse = await api.getHallConfig(seanceId, ticketDate);
      if (!hallConfigResponse.success || !Array.isArray(hallConfigResponse.result)) {
        throw new Error('Не удалось получить конфигурацию зала');
      }

      const hallConfig = hallConfigResponse.result;

      const invalidSeats = ticketsData.filter((ticket) => {
        const row = ticket.row - 1;
        const seat = ticket.place - 1;
        return (
          row >= hallConfig.length ||
          seat >= hallConfig[row].length ||
          hallConfig[row][seat] === 'disabled' ||
          hallConfig[row][seat] === 'taken'
        );
      });

      if (invalidSeats.length > 0) {
        throw new Error('Некоторые места уже заняты');
      }

      const updatedConfig = [...hallConfig];
      ticketsData.forEach((ticket) => {
        const row = ticket.row - 1;
        const seat = ticket.place - 1;
        if (row < updatedConfig.length && seat < updatedConfig[row].length) {
          updatedConfig[row][seat] = 'taken';
        }
      });

      const formData = new FormData();
      formData.append('seanceId', seanceId);
      formData.append('ticketDate', ticketDate);
      formData.append('tickets', JSON.stringify(ticketsData));

      const response = await fetch('https://shfe-diplom.neto-server.ru/ticket', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setQrCode(data.qrCode || 'booking-code:' + Math.random().toString(36).substring(2, 10));
        setBookingCode(
          data.bookingCode || 'CODE-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        );

        await api.updateHallConfig(hall.id, {
          rowCount: updatedConfig.length,
          placeCount: updatedConfig[0]?.length || 0,
          config: updatedConfig,
        });
      } else {
        throw new Error(data.error || 'Места недоступны для бронирования!');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка соединения с сервером', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate(`/hall/${id}`);
    }
  };

  const calculateTotal = () => {
    return tickets.reduce((sum, ticket) => sum + ticket.coast, 0);
  };

  const formatPlaces = () => {
    return tickets.map((ticket) => `${ticket.row}/${ticket.place}`).join(', ');
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (!movie || !hall || !seance || tickets.length === 0) {
    return (
      <div className="ticket-error">
        <h2>Информация о билетах не найдена</h2>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    );
  }

  return (
    <div className="ticket-layout">
      <div className="ticket-page">
        <Header showLoginButton={false} />

        <main className="ticket-main">
          <div className="payment__header">
            <h2 className="payment__header-text">Вы выбрали билеты:</h2>
          </div>

          <section className="ticket__info-wrapper">
            <div className="ticket__info">
              <p className="ticket__info-text">
                На фильм:{' '}
                <span className="ticket__info-movie ticket__info-bold">{movie.film_name}</span>
              </p>
              <p className="ticket__info-text">
                Ряд/Место:{' '}
                <span className="ticket__info-places ticket__info-bold">{formatPlaces()}</span>
              </p>
              <p className="ticket__info-text">
                В зале:{' '}
                <span className="ticket__info-hall ticket__info-bold">{hall.hall_name}</span>
              </p>
              <p className="ticket__info-text">
                Начало сеанса:{' '}
                <span className="ticket__info-time ticket__info-bold">{seance.seance_time}</span>
              </p>
              <p className="ticket__info-text">
                Дата сеанса:{' '}
                <span className="ticket__info-date ticket__info-bold">
                  {seanceDate ? new Date(seanceDate).toLocaleDateString('ru-RU') : 'Не указана'}
                </span>
              </p>
              <p className="ticket__info-text">
                Стоимость:{' '}
                <span className="ticket__info-price ticket__info-bold">{calculateTotal()}</span>{' '}
                рублей
              </p>
            </div>

            {!qrCode ? (
              <button className="ticket__button button" onClick={handleGetBookingCode}>
                Получить код бронирования
              </button>
            ) : (
              <div className="ticket-qr">
                <QRCodeSVG value={qrCode} size={200} />
                <p className="ticket-code">Код бронирования: {bookingCode}</p>
                <p className="ticket-code">Билет действителен строго на свой сеанс!</p>
              </div>
            )}

            <div className="ticket__hint">
              <p className="ticket__hint-text">
                После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите
                QR-код нашему контроллёру у входа в зал.
              </p>
              <p className="ticket__hint-text">Приятного просмотра!</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};
