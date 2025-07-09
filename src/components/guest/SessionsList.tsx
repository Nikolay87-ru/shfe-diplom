import React from 'react';
import { type Session } from '../../types/Session';

type Props = {
  sessions: Session[];
  onSelect: (session: Session) => void;
};

export const SessionsList: React.FC<Props> = ({ sessions, onSelect }) => (
  <div>
    <table className="table">
      <thead>
        <tr>
          <th>Время</th>
          <th>Цена</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {sessions.map(s => (
          <tr key={s.id}>
            <td>{s.time}</td>
            <td>{s.price} ₽</td>
            <td>
              <button className="btn btn-sm btn-primary" onClick={() => onSelect(s)}>
                Купить
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);