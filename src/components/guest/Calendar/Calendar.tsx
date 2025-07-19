import { useState } from 'react';
import { format, addDays, isToday, isSameDay, isWeekend } from 'date-fns';
import { ru } from 'date-fns/locale';
import './Calendar.scss';

interface CalendarProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export const Calendar = ({ selectedDate, onChange }: CalendarProps) => {
  const [daysOffset, setDaysOffset] = useState(0);
  
  const days = Array.from({ length: 7 }, (_, i) => 
    addDays(selectedDate, i - selectedDate.getDay() + daysOffset)
  );

  const handlePrevClick = () => {
    setDaysOffset(prev => prev - 7);
  };

  const handleNextClick = () => {
    setDaysOffset(prev => prev + 7);
  };

  const isCurrentWeek = days.some(day => isToday(day));

  return (
    <nav className="calendar-nav">
      <div className="container">
        <ul className="days-list">
          {isCurrentWeek ? (
            <li 
              className="day-item nav__arrow left"
              onClick={handlePrevClick}
            >
              <span className="nav__arrow-text">&lt;</span>
            </li>
          ) : (
            <>
              <li 
                className="day-item nav__arrow left"
                onClick={handlePrevClick}
              >
                <span className="nav__arrow-text">&lt;</span>
              </li>
              <li 
                className="day-item"
                onClick={() => {
                  setDaysOffset(0);
                  onChange(new Date());
                }}
              >
                <span className="nav__text-today">Сегодня</span>
              </li>
            </>
          )}

          {days.map((day) => (
            <li
              key={day.toString()}
              className={`day-item ${isToday(day) ? 'nav__day_today' : ''} ${
                isSameDay(day, selectedDate) ? 'nav__day-checked' : ''
              }`}
              onClick={() => onChange(day)}
              data-date={day.toISOString().split('T')[0]}
            >
              {isToday(day) ? (
                <>
                  <span className="nav__text-today">Сегодня</span>
                  <br />
                  <span className={`nav__text-week ${isWeekend(day) ? 'nav__day_weekend' : ''}`}>
                    {format(day, 'EEE', { locale: ru })},
                  </span>{' '}
                  <span className={`nav__text-date ${isWeekend(day) ? 'nav__day_weekend' : ''}`}>
                    {format(day, 'd')}
                  </span>
                </>
              ) : (
                <>
                  <span className={`nav__text-week ${isWeekend(day) ? 'nav__day_weekend' : ''}`}>
                    {format(day, 'EEE', { locale: ru })},
                  </span>
                  <span className={`nav__text-date ${isWeekend(day) ? 'nav__day_weekend' : ''}`}>
                    {format(day, 'd')}
                  </span>
                </>
              )}
            </li>
          ))}

          <li 
            className="day-item nav__arrow right"
            onClick={handleNextClick}
          >
            <span className="nav__arrow-text">&gt;</span>
          </li>
        </ul>
      </div>
    </nav>
  );
};