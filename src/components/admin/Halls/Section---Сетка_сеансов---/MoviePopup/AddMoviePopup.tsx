import React, { useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import './AddMoviePopup.scss';

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    duration: number;
    description: string;
    country: string;
    poster: File;
  }) => Promise<void> | void;
}

export const AddMoviePopup: React.FC<Props> = ({ show, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [poster, setPoster] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [posterPreview, setPosterPreview] = useState<string | undefined>();
  const inputPosterRef = useRef<HTMLInputElement>(null);

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    if (file.size > 3 * 1024 * 1024) {
      setError('Размер файла не более 3 Mb!');
      return;
    }

    if (file.type !== 'image/png') {
      setError('Только PNG файлы разрешены!');
      return;
    }

    setPoster(file);
    setPosterPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !duration || !description || !country || !poster) {
      setError('Заполните все обязательные поля!');
      return;
    }
    onSave({
      name: name.trim(),
      duration: Number(duration),
      description: description.trim(),
      country: country.trim(),
      poster,
    });
    setName('');
    setDuration('');
    setDescription('');
    setCountry('');
    setPoster(null);
    setPosterPreview('');
    onClose();
  };

  const preventMathSigns = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '-' || e.key === '+') {
      e.preventDefault();
    }
  };

  if (!show) return null;

  return (
    <div className="popup">
      <div className="popup__container">
        <div className="popup__header">
          <div className="popup__header_text">Добавление фильма</div>
          <div className="popup__close" onClick={onClose}>
            <IoClose size={35} style={{ strokeWidth: 40 }} />
          </div>
        </div>
        <form className="popup__form" onSubmit={handleSubmit} autoComplete="off">
          <label className="admin_label">
            Название фильма
            <input
              type="text"
              className="admin_input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, «Гражданин Кейн»"
              required
            />
          </label>
          <label className="admin_label">
            Продолжительность фильма (мин.)
            <input
              type="number"
              className="admin_input"
              min={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              onKeyDown={preventMathSigns}
              required
            />
          </label>
          <label className="admin_label">
            Описание фильма
            <input
              className="admin_input add-movie_synopsis_input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label className="admin_label">
            Страна
            <input
              type="text"
              className="admin_input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>
          <div className="admin_poster" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {posterPreview && (
              <img className="popup__poster_preview" src={posterPreview} alt="preview" />
            )}
            <label className="popup__add-poster_button">
              {posterPreview ? 'Изменить постер' : 'Загрузить постер'}
              <input
                type="file"
                accept="image/*"
                ref={inputPosterRef}
                onChange={handlePosterChange}
              />
            </label>
            <span style={{ color: '#555', fontSize: 11, marginLeft: 4 }}>До 3MB</span>
          </div>
          {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

          <div className="popup__buttons">
            <button
              type="submit"
              className={
                'button' +
                (!(name && duration && description && country && poster) ? ' button_disabled' : '')
              }
              disabled={!(name && duration && description && country && poster)}
            >
              Добавить фильм
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
