import { useState, useEffect } from 'react';
import { format, addDays, isToday, isWeekend } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DateSelector = ({ selectedDate, onDateChange }: DateSelectorProps) => {
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    const today = new Date();
    const nextDates = Array.from({ length: 7 }, (_, i) => addDays(today, i));
    setDates(nextDates);
  }, []);

  return (
    <div className="d-flex overflow-auto py-2">
      {dates.map((date) => {
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const today = isToday(date);
        const weekend = isWeekend(date);
        
        return (
          <button
            key={date.toString()}
            className={`btn mx-1 ${isSelected ? 'btn-primary' : 'btn-outline-primary'} ${
              weekend ? 'text-danger' : ''
            }`}
            style={{ minWidth: '100px' }}
            onClick={() => onDateChange(date)}
          >
            <div className="d-flex flex-column">
              <span>{format(date, 'EEE', { locale: ru })}</span>
              <span className="fw-bold">
                {today ? 'Сегодня' : format(date, 'd')}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default DateSelector;