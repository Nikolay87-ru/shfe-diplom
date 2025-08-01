import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import { Film, Hall, Seance } from '@/types';
import { AddMoviePopup } from './MoviePopup/AddMoviePopup';
import { AddSeancePopup } from './SeancePopup/AddSeancePopup';
import { useHalls } from '@/context/hooks/useHalls';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import deleteImg from '@assets/delete.png';
import { MdDelete } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import './SeancesGridSection.scss';

const colors = ['background_1', 'background_2', 'background_3', 'background_4', 'background_5'];
function getColorIdx(i: number) {
  return colors[i % colors.length];
}

export const SeancesGridSection: React.FC = () => {
  const { halls, update } = useHalls();
  const [movies, setMovies] = useState<Film[]>([]);
  const [seances, setSeances] = useState<Seance[]>([]);
  const [showMoviePopup, setShowMoviePopup] = useState(false);
  const [showAddSeancePopup, setShowAddSeancePopup] = useState(false);
  const [popupSeanceHall, setPopupSeanceHall] = useState<Hall | null>(null);
  const [popupSeanceMovie, setPopupSeanceMovie] = useState<Film | null>(null);

  const [draggedMovieId, setDraggedMovieId] = useState<number | undefined>();
  const [dragStartHallId, setDragStartHallId] = useState<number | undefined>();

  const [deleteTargetSeanceId, setDeleteTargetSeanceId] = useState<number | undefined>();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [activeTrashHallId, setActiveTrashHallId] = useState<number | null>(null);

  const [localSeances, setLocalSeances] = useState<Seance[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getAllData();
        setMovies(res.result?.films || []);
        setSeances(res.result?.seances || []);
        setLocalSeances(res.result?.seances || []);
        setHasChanges(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [halls]);

  async function handleDeleteMovie(movieId: number) {
    const ConfirmToast = () => (
      <div>
        <p style={{ display: 'flex' }}>Удалить фильм? Все связанные сеансы также будут удалены.</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => {
              toast.dismiss();
              confirmDeleteMovie(movieId);
            }}
            style={{
              padding: '5px 10px',
              background: '#16a6af',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            Удалить
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={{
              padding: '5px 10px',
              background: '#63536c',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
            }}
          >
            Отмена
          </button>
        </div>
      </div>
    );

    toast(<ConfirmToast />, {
      position: 'top-center',
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      draggable: false,
      style: {
        width: '350px',
        justifyContent: 'center',
      },
    });
  }

  async function confirmDeleteMovie(movieId: number) {
    try {
      console.log('Попытка удаления фильма ID:', movieId);
      const response = await api.deleteMovie(movieId);

      if (response.success) {
        console.log('Фильм удалён. Обновление данных...');
        const res = await api.getAllData();

        console.log('Новые фильмы:', res.result?.films);
        console.log('Новые сеансы:', res.result?.seances);

        setMovies(res.result?.films || []);
        setSeances(res.result?.seances || []);
        setLocalSeances(res.result?.seances || []);
        setHasChanges(false);

        toast.success('Фильм успешно удалён', {
          position: 'top-center',
          autoClose: 3000,
        });
      } else {
        console.error('Ошибка сервера:', response.error);
        toast.error('Не удалось удалить фильм: ' + (response.error || 'Неизвестная ошибка'), {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      toast.error('Ошибка при удалении фильма', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  function onDragMovieStart(movieId: number) {
    setDraggedMovieId(movieId);
  }
  function onDragMovieEnd() {
    setDraggedMovieId(undefined);
    setActiveTrashHallId(null);
  }

  function onDropMovieToHall(hallId: number) {
    if (!draggedMovieId) return;
    setPopupSeanceHall(halls.find((h) => h.id === hallId) || null);
    setPopupSeanceMovie(movies.find((m) => m.id === draggedMovieId) || null);
    setShowAddSeancePopup(true);
    setDraggedMovieId(undefined);
  }

  async function addSeance(hallId: number, movieId: number, time: string) {
    const newSeance: Seance = {
      id: Date.now(),
      seance_hallid: hallId,
      seance_filmid: movieId,
      seance_time: time,
    };
    setLocalSeances((ses) => [...ses, newSeance]);
    setHasChanges(true);
  }

  function onDragSeanceStart(seanceId: number, hallId: number) {
    setDragStartHallId(hallId);
    setDeleteTargetSeanceId(seanceId);
    setActiveTrashHallId(hallId);
  }

  function onDragSeanceEnd() {
    if (!showDeletePopup) {
      setDeleteTargetSeanceId(undefined);
      setDragStartHallId(undefined);
      setActiveTrashHallId(null);
    }
  }

  function onDragOverTrash(e: React.DragEvent, hallId: number) {
    e.preventDefault();
    if (deleteTargetSeanceId) {
      setActiveTrashHallId(hallId);
    }
  }

  function onDropSeanceToTrash(hallId: number) {
    if (deleteTargetSeanceId && dragStartHallId === hallId) {
      setShowDeletePopup(true);
    } else {
      setActiveTrashHallId(null);
    }
  }

  async function confirmDeleteSeance() {
    if (!deleteTargetSeanceId) {
      console.error('ID сеанса не указан');
      return;
    }

    try {
      console.log('Отправка запроса на удаление сеанса ID:', deleteTargetSeanceId);
      const response = await api.deleteSeance(deleteTargetSeanceId);
      console.log('Ответ сервера:', response);

      if (!response.success) {
        throw new Error(response.error || 'Ошибка сервера');
      }

      setLocalSeances((prev) => prev.filter((s) => s.id !== deleteTargetSeanceId));
      setHasChanges(true);

      setShowDeletePopup(false);
      setDeleteTargetSeanceId(undefined);
      setActiveTrashHallId(null);

      console.log('Сеанс успешно удалён');
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error(
        'Не удалось удалить сеанс: ' + (error instanceof Error ? error.message : 'Ошибка сервера'),
        {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        },
      );
    }
  }

  function cancelDeleteSeance() {
    setShowDeletePopup(false);
    setDeleteTargetSeanceId(undefined);
    setActiveTrashHallId(null);
  }

  function handleCancel() {
    setLocalSeances(seances);
    setHasChanges(false);
  }

  async function handleSave() {
    try {
      for (const s of localSeances) {
        if (!seances.some((ss) => ss.id === s.id)) {
          await api.addSeance({
            hallId: s.seance_hallid,
            movieId: s.seance_filmid,
            time: s.seance_time,
          });
        }
      }

      for (const s of seances) {
        if (!localSeances.some((ss) => ss.id === s.id)) {
          await api.deleteSeance(s.id);
        }
      }

      await update();
      const res = await api.getAllData();

      setMovies(res.result?.films || []);
      setSeances(res.result?.seances || []);
      setLocalSeances(res.result?.seances || []);
      setHasChanges(false);

      toast.success('Изменения успешно сохранены!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      toast.error('Ошибка при сохранении изменений', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  function getMinutesFromTime(time: string): number {
    const [hh, mm] = time.split(':').map(Number);
    return hh * 60 + mm;
  }

  return (
    <div>
      <button
        className="admin__button_movie button"
        onClick={() => setShowMoviePopup(true)}
        style={{ alignSelf: 'center' }}
      >
        Добавить фильм
      </button>
      <div className="movie-seances__wrapper">
        {movies.map((movie, i) => (
          <div
            className={'movie-seances__movie ' + getColorIdx(i)}
            key={movie.id}
            draggable
            tabIndex={0}
            onDragStart={() => onDragMovieStart(movie.id)}
            onDragEnd={onDragMovieEnd}
          >
            <img className="movie-seances__movie_poster" src={movie.film_poster} alt="постер" />
            <div className="movie-seances__movie_info">
              <div>
                <span className="movie_info-title">{movie.film_name}</span>
              </div>
              <div className="movie_info-length">{movie.film_duration} мин</div>
            </div>
            <div
              className="movie-seances__movie_delete"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteMovie(movie.id);
              }}
              title="Удалить фильм"
            >
              <MdDelete size={18} />
            </div>
          </div>
        ))}
      </div>

      <div className="movie-seances__timelines">
        {halls.map((hall) => {
          const hallSeances = localSeances.filter((s) => s.seance_hallid === hall.id);
          return (
            <div className="movie-seances__timeline" key={hall.id}>
              <div className="timeline__hall_title">{hall.hall_name}</div>

              <div className="timeline__seances-container">
                <div
                  className="timeline__seances"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDropMovieToHall(hall.id)}
                >
                  {activeTrashHallId === hall.id && (
                    <div
                      className={`timeline__delete ${activeTrashHallId === hall.id ? 'active' : ''}`}
                      onDragOver={(e) => onDragOverTrash(e, hall.id)}
                      onDrop={() => onDropSeanceToTrash(hall.id)}
                    >
                      <img
                        src={deleteImg}
                        alt="Удалить"
                        className="timeline__delete_image"
                      />
                    </div>
                  )}

                  {hallSeances.map((seance) => {
                    const movie = movies.find((m) => m.id === seance.seance_filmid);
                    if (!movie) return null;

                    const minutes = getMinutesFromTime(seance.seance_time);
                    const leftPercent = (minutes / (24 * 60)) * 100;

                    return (
                      <div
                        key={seance.id}
                        className={`timeline__seances_movie ${getColorIdx(
                          movies.findIndex((m) => m.id === movie.id),
                        )}`}
                        style={
                          {
                            '--left-percent': `${leftPercent}%`,
                            '--time-value': `"${seance.seance_time}"`,
                          } as React.CSSProperties
                        }
                        data-time={seance.seance_time}
                        draggable
                        onDragStart={() => onDragSeanceStart(seance.id, hall.id)}
                        onDragEnd={onDragSeanceEnd}
                      >
                        <div className="timeline__seances_title">{movie.film_name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="movie-seances__buttons">
        <button
          className={
            'admin__button_cancel movie-seances__batton_cancel button' +
            (hasChanges ? '' : ' button_disabled')
          }
          disabled={!hasChanges}
          onClick={handleCancel}
        >
          Отмена
        </button>
        <button
          className={
            'admin__button_save movie-seances__batton_save button' +
            (hasChanges ? '' : ' button_disabled')
          }
          disabled={!hasChanges}
          onClick={handleSave}
        >
          Сохранить
        </button>
      </div>

      <AddMoviePopup
        show={showMoviePopup}
        onClose={() => setShowMoviePopup(false)}
        onSave={async (movie) => {
          console.log('Adding movie:', movie);
          const addResponse = await api.addMovie(movie);
          console.log('Add movie response:', addResponse);

          const res = await api.getAllData();
          console.log('Updated data:', res.result);

          if (res.result?.films) {
            setMovies(res.result.films);
            setSeances(res.result.seances || []);
            setLocalSeances(res.result.seances || []);
            setHasChanges(false);
          } else {
            console.error('No films in response:', res);
          }
        }}
      />
      <AddSeancePopup
        show={showAddSeancePopup}
        onClose={() => setShowAddSeancePopup(false)}
        onSave={addSeance}
        halls={halls}
        movies={movies}
        initialHall={popupSeanceHall || undefined}
        initialMovie={popupSeanceMovie || undefined}
      />

      {showDeletePopup && (
        <div className="popup">
          <div className="popup__container">
            <div className="popup__header">
              <div className="popup__header_text">Удаление сеанса</div>
              <div className="popup__close" onClick={cancelDeleteSeance}>
                <IoClose size={35} style={{ strokeWidth: 40 }} />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>Вы действительно хотите удалить сеанс?</div>
            <div className="popup__buttons" style={{ marginBlock: 20 }}>
              <button className="button" onClick={confirmDeleteSeance}>
                Удалить
              </button>
              <button className="button popup__button_cancel" onClick={cancelDeleteSeance}>
                Отменить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
