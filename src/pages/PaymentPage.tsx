import { useParams } from 'react-router-dom';

export const PaymentPage = () => {
  const { id } = useParams();
  return (
    <div>
      <h1>Оплата для сеанса {id}</h1>
      {/* Реализация формы оплаты */}
    </div>
  );
};