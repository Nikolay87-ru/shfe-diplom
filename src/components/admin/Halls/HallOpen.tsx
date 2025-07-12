import { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Hall } from '../../../types';
import { api } from '../../../utils/api';

interface HallOpenProps {
  hall: Hall;
}

export const HallOpen = ({ hall }: HallOpenProps) => {
  const [status, setStatus] = useState(hall.hall_open);
  const [hasSeances, setHasSeances] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSeances = async () => {
      try {
        setLoading(true);
        const data = await api.getAllData();
        const seancesCount = data.success && data.result?.seances 
          ? data.result.seances.filter(s => s.seance_hallid === hall.id).length 
          : 0;
        setHasSeances(seancesCount > 0);
      } catch (error) {
        console.error('Error checking seances:', error);
        setHasSeances(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkSeances();
    setStatus(hall.hall_open);
  }, [hall]);

  const toggleStatus = async () => {
    const newStatus = status === 1 ? 0 : 1;
    
    if (newStatus === 1 && !hasSeances) {
      alert('Добавьте сеансы в зал для открытия продаж');
      return;
    }

    try {
      const response = await api.updateHallStatus(hall.id, newStatus);
      
      if (response.success) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error('Error updating hall status:', error);
    }
  };

  if (loading) {
    return <div>Проверка сеансов...</div>;
  }

  return (
    <div className="hall-open">
      <div className="hall-status">
        {status === 1 ? (
          <>
            <p>Зал открыт для продаж</p>
            <Button variant="danger" onClick={toggleStatus}>
              Приостановить продажи
            </Button>
          </>
        ) : (
          <>
            <p>
              {hasSeances 
                ? 'Всё готово к открытию продаж' 
                : 'Добавьте сеансы в зал для открытия продаж'}
            </p>
            <Button 
              variant="success" 
              onClick={toggleStatus}
              disabled={!hasSeances}
            >
              Открыть продажи
            </Button>
          </>
        )}
      </div>
    </div>
  );
};