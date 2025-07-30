import React, { memo, useState } from 'react';
import { format, addDays, isToday, isSameDay, isBefore, isWeekend } from 'date-fns';
import { ru } from 'date-fns/locale';
import './Calendar.scss';

interface CalendarProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

export const Calendar = memo(({ selectedDate, onChange }: CalendarProps) => {
  const [daysOffset, setDaysOffset] = useState(0);
  
  const today = new Date();
  const days = Array.from({ length: 6 }, (_, i) => addDays(today, i + daysOffset));

  const handlePrevClick = () => {
    if (daysOffset + 7 > 0) {
      setDaysOffset(prev => Math.max(prev - 7, -6));
    }
  };

  const handleNextClick = () => {
    setDaysOffset(prev => prev + 7);
  };

  const hasPastDays = days.some(day => isBefore(day, today));
  const isCurrentWeek = daysOffset === 0;

  return (
    <nav className="calendar-nav">
      <div className="container">
        <ul className="days-list">
          {hasPastDays && (
            <li 
              className="day-item nav__arrow left"
              onClick={handlePrevClick}
            >
              <span className="nav__arrow-text">&lt;</span>
            </li>
          )}

          {!isCurrentWeek && (
            <li 
              className="day-item"
              onClick={() => {
                setDaysOffset(0);
                onChange(today);
              }}
            >
              <span className="nav__text-today">Вернуться в начало</span>
            </li>
          )}

          {days.map((day) => {
            const isDayWeekend = isWeekend(day);
            const isDayToday = isToday(day);
            const isDaySelected = isSameDay(day, selectedDate);

            return (
              <li
                key={day.toString()}
                className={`day-item ${isDayToday ? 'nav__day_today' : ''} ${
                  isDaySelected ? 'nav__day-checked' : ''
                }`}
                onClick={() => onChange(day)}
                data-date={day.toISOString().split('T')[0]}
              >
                {isDayToday ? (
                  <>
                    <span className="nav__text-today">Сегодня</span>
                    <br />
                    <span className={`nav__text-week ${isDayWeekend ? 'nav__day_weekend' : ''}`}>
                      {format(day, 'EEE', { locale: ru })},
                    </span>{' '}
                    <span className={`nav__text-date ${isDayWeekend ? 'nav__day_weekend' : ''}`}>
                      {format(day, 'd')}
                    </span>
                  </>
                ) : (
                  <>
                    <span className={`nav__text-week ${isDayWeekend ? 'nav__day_weekend' : ''}`}>
                      {format(day, 'EEE', { locale: ru })},
                    </span>
                    <span className={`nav__text-date ${isDayWeekend ? 'nav__day_weekend' : ''}`}>
                      {format(day, 'd')}
                    </span>
                  </>
                )}
              </li>
            );
          })}

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
});
