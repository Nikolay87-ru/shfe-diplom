import { useState, useRef } from 'react';
import './MovieForm.css';

interface MovieFormProps {
  onSave: (formData: FormData) => void;
  onCancel: () => void;
}

const MovieForm = ({ onSave, onCancel }: MovieFormProps) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('');
  const [poster, setPoster] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !duration || !description || !country || !poster) {
      alert('Заполните все поля и загрузите постер');
      return;
    }

    const formData = new FormData();
    formData.append('filmName', name);
    formData.append('filmDuration', duration);
    formData.append('filmDescription', description);
    formData.append('filmOrigin', country);
    if (poster) {
      formData.append('filePoster', poster);
    }

    onSave(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files[0].size > 3000000) {
        alert('Размер файла должен быть не более 3 Mb');
        return;
      }
      setPoster(e.target.files[0]);
    }
  };

  return (
    <div className="popup popup__movie_add">
      <div className="popup__container">
        <div className="popup__header">
          <h2 className="popup__header_text">Добавление фильма</h2>
          <div className="popup__close" onClick={onCancel}>
            <img src="./images/close.png" alt="Кнопка 'Закрыть окно'" />
          </div>
        </div>

        <form className="popup__form popup__form_add-movie" onSubmit={handleSubmit}>
          <label className="admin_label add-movie_label">
            Название фильма
            <input
              type="text"
              className="admin_input add-movie_name_input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например, «Джон Уик»"
              required
            />
          </label>

          <label className="admin_label add-movie_label">
            Продолжительность фильма (мин.)
            <input
              type="number"
              className="admin_input add-movie_time_input"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </label>

          <label className="admin_label add-movie_label">
            Описание фильма
            <textarea
              className="admin_input add-movie_synopsis_input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <label className="admin_label add-movie_label">
            Страна
            <input
              type="text"
              className="admin_input add-movie_country_input"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>

          <div className="popup__buttons">
            <button type="submit" className="popup__button_save popup__add-movie_button button">
              Добавить фильм
            </button>

            <label className="popup__button_save popup__add-poster_button button">
              Загрузить постер
              <input
                type="file"
                ref={fileInputRef}
                accept=".png"
                className="input_add_poster"
                onChange={handleFileChange}
                required
              />
            </label>

            <button
              type="button"
              className="popup__button_cancel popup__add-movie_button_cancel button"
              onClick={onCancel}
            >
              Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;