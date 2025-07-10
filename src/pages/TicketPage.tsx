import { useParams } from 'react-router-dom';

export const TicketPage = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Билет для сеанса {id}</h1>
      {/* Реализация отображения билета */}
    </div>
  );
};