import { format, addDays, isToday } from 'date-fns';
import { ru } from 'date-fns/locale';
import './Calendar.scss';

interface CalendarProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export const Calendar = ({ selectedDate, onChange }: CalendarProps) => {
  const days = Array.from({ length: 7 }, (_, i) =>
    addDays(selectedDate, i - selectedDate.getDay()),
  );

  return (
    <nav className="calendar-nav">
      <div className="container">
        <ul className="days-list">
          {days.map((day) => (
            <li
              key={day.toString()}
              className={`day-item ${isToday(day) ? 'active' : ''}`}
              onClick={() => onChange(day)}
            >
              <span className="weekday">{format(day, 'EEE', { locale: ru })}</span>
              <span className="date">{format(day, 'd')}</span>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};
