import React, { useEffect, useState } from 'react';
import { useHalls } from '@/context/hooks/useHalls';
import { api } from '@/utils/api';
import { HallsList } from '../Section---Управление_залами---/HallsList/HallsList';
import './HallOpen.scss';

export const HallOpenSection: React.FC = () => {
  const { 
    allData: { halls = [], seances = [] }, 
    selectedHallId, 
    setSelectedHallId, 
    updateLocalData 
  } = useHalls();
  const hall = halls.find((h) => h.id === selectedHallId);

  const [hasSeances, setHasSeances] = useState(false);
  const [status, setStatus] = useState<0 | 1>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      setLoading(true);
      if (!hall) return;
      setStatus(hall.hall_open);
      const hallSeances = seances.filter((s) => s.seance_hallid === hall.id);
      setHasSeances(hallSeances.length > 0);
      setLoading(false);
    }
    check();
  }, [hall, seances]);

  const handleToggleSellStatus = async () => {
    if (!hall) return;
    if (status === 0 && !hasSeances) return;
    const response = await api.updateHallStatus(hall.id, status === 1 ? 0 : 1);
    if (response.success && response.result?.halls) {
      updateLocalData('halls', response.result.halls);
      setStatus(status === 1 ? 0 : 1);
    }
  }

  if (!hall) {
    return <div style={{ padding: '1em' }}>Нет залов или не выбран зал</div>;
  }

  return (
    <section className="admin__section open">
      <p className="admin__info">Выберите зал для открытия/закрытия продаж:</p>
      <HallsList halls={halls} selectedId={selectedHallId} onSelect={setSelectedHallId} />
      <div className="open__wrapper">
        <div className="open__info">
          {loading
            ? 'Проверка сеансов...'
            : hall.hall_open === 1
              ? 'Зал открыт для продаж'
              : hasSeances
                ? 'Всё готово к открытию'
                : 'Добавьте сеансы в зал для открытия продаж'}
        </div>
        <button
          className={
            'admin__button_open button' + (status === 0 && !hasSeances ? ' button_disabled' : '')
          }
          disabled={!!(status === 0 && !hasSeances)}
          onClick={handleToggleSellStatus}
        >
          {status === 1 ? 'Приостановить продажи' : 'Открыть продажу билетов'}
        </button>
      </div>
    </section>
  );
};
