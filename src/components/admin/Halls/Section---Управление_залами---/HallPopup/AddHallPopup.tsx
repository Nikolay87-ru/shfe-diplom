import React, { useEffect, useRef, useState } from 'react';
import { IoClose } from "react-icons/io5";
import './AddHallPopup.scss';

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void> | void;
}
export const AddHallPopup: React.FC<Props> = ({ show, onClose, onSave }) => {
  const [hallName, setHallName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (show) setTimeout(() => inputRef.current?.focus(), 100);
    if (!show) setHallName('');
  }, [show]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hallName.trim()) {
      setError('Введите название зала');
      return;
    }
    Promise.resolve(onSave(hallName.trim()))
      .then(() => setHallName(''))
      .then(onClose)
      .catch(() => setError('Ошибка при добавлении зала'));
  }

  if (!show) return null;
  return (
    <div className="popup">
      <div className="popup__container">
        <div className="popup__header">
          <div className="popup__header_text">Добавление зала</div>
          <div className="popup__close" onClick={onClose}>
            <IoClose size={35} style={{ strokeWidth: 40 }}/>
          </div>
        </div>
        <form className="popup__form" onSubmit={handleSubmit} autoComplete="off">
          <label className="admin_label">
            Название зала
            <input
              type="text"
              className="admin_input"
              placeholder="Например, «Зал 1»"
              ref={inputRef}
              value={hallName}
              onChange={(e) => {
                setError('');
                setHallName(e.target.value);
              }}
              required
            />
          </label>
          {error && <div className="popup__error">{error}</div>}

          <div className="popup__buttons">
            <button
              type="submit"
              className={'button' + (hallName.trim() ? '' : ' button_disabled')}
              disabled={!hallName.trim()}
            >
              Добавить зал
            </button>
            <button type="button" className="button popup__button_cancel" onClick={onClose}>
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
