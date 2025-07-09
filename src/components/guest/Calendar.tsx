import { format, addDays, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';

export const CalendarNav = ({ selectedDate, onChange }) => {
  const days = [0, 1, 2, 3, 4, 5, 6].map(offset => 
    addDays(selectedDate, offset - selectedDate.getDay())
  );

  return (
    <nav className="calendar-nav">
      {days.map(day => (
        <div 
          key={day.toString()}
          className={`calendar-day ${isToday(day) ? 'active' : ''}`}
          onClick={() => onChange(day)}
        >
          <div className="weekday">{format(day, 'EEE', { locale: ru })}</div>
          <div className="date">{format(day, 'd')}</div>
        </div>
      ))}
    </nav>
  );
};