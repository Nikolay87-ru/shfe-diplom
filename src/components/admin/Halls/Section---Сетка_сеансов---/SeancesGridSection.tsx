import React, { useState, useEffect } from 'react';
import { AddMoviePopup } from './MoviePopup/AddMoviePopup';
import { AddSeancePopup } from './SeancePopup/AddSeancePopup';
import { useHalls } from '@/context/hooks/useHalls';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import deleteImg from '@assets/delete.png';
import { MdDelete } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import './SeancesGridSection.scss';
import { api } from '@/utils/api';
import { Film, Hall, Seance } from '@/types';
import { ConfirmDeleteModal } from '@/components/modal/ConfirmDeleteModal';

const colors = ['background_1', 'background_2', 'background_3', 'background_4', 'background_5'];
function getColorIdx(i: number) {
  return colors[i % colors.length];
}

export const SeancesGridSection: React.FC = () => {
  const {
    allData: { films: movies = [], halls = [], seances = [] },
    updateLocalData,
  } = useHalls();

  const [showMoviePopup, setShowMoviePopup] = useState(false);
  const [showAddSeancePopup, setShowAddSeancePopup] = useState(false);
  const [popupSeanceHall, setPopupSeanceHall] = useState<Hall | null>(null);
  const [popupSeanceMovie, setPopupSeanceMovie] = useState<Film | null>(null);
  const [draggedMovieId, setDraggedMovieId] = useState<number | undefined>();
  const [dragStartHallId, setDragStartHallId] = useState<number | undefined>();
  const [deleteTargetSeanceId, setDeleteTargetSeanceId] = useState<number | undefined>();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [activeTrashHallId, setActiveTrashHallId] = useState<number | null>(null);
  const [localSeances, setLocalSeances] = useState<Seance[]>(seances);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setLocalSeances(seances);
    setHasChanges(false);
  }, [seances]);

  function getMinutesFromTime(time: string): number {
    const [hh, mm] = time.split(':').map(Number);
    return hh * 60 + mm;
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
    const newSeance = {
      id: Date.now(),
      seance_hallid: hallId,
      seance_filmid: movieId,
      seance_time: time,
    };
    setLocalSeances((prev) => [...prev, newSeance]);
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
    if (!deleteTargetSeanceId) return;

    try {
      const isSavedSeance = seances.some(s => s.id === deleteTargetSeanceId);
      
      if (isSavedSeance) {
        const response = await api.deleteSeance(deleteTargetSeanceId);
        if (response.success) {
          const updatedSeances = localSeances.filter(s => s.id !== deleteTargetSeanceId);
          setLocalSeances(updatedSeances);
          setHasChanges(true);
          
          await updateLocalData('seances', updatedSeances);
          
          toast.success('Сеанс успешно удалён', {
            position: 'top-center',
            autoClose: 3000,
          });
        }
      } else {
        const updatedSeances = localSeances.filter(s => s.id !== deleteTargetSeanceId);
        setLocalSeances(updatedSeances);
        setHasChanges(true);
        
        toast.success('Несохраненный сеанс удалён', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error deleting seance:', error);
      toast.error('Не удалось удалить сеанс', {
        position: 'top-center',
        autoClose: 5000,
      });
    } finally {
      setShowDeletePopup(false);
      setDeleteTargetSeanceId(undefined);
      setActiveTrashHallId(null);
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
      const newSeances = localSeances.filter((ls) => !seances.some((s) => s.id === ls.id));
      const deletedSeances = seances.filter((s) => !localSeances.some((ls) => ls.id === s.id));

      const operations = [];
      
      for (const seance of newSeances) {
        operations.push(
          api.addSeance({
            hallId: seance.seance_hallid,
            movieId: seance.seance_filmid,
            time: seance.seance_time,
          })
        );
      }

      for (const seance of deletedSeances) {
        operations.push(api.deleteSeance(seance.id));
      }

      await Promise.all(operations);
      
      await updateLocalData('seances', localSeances);
      
      toast.success('Изменения успешно сохранены!', {
        position: 'top-center',
        autoClose: 5000,
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Ошибка при сохранении изменений', {
        position: 'top-center',
        autoClose: 5000,
      });
    }
  }

  async function handleDeleteMovie(movieId: number) {
    toast(
      <ConfirmDeleteModal
        title="Удалить фильм?"
        onConfirm={() => confirmDeleteMovie(movieId)}
        onCancel={() => toast.dismiss()}
      />,
      {
        position: 'top-center',
        autoClose: false,
        closeButton: false,
        closeOnClick: false,
        draggable: false,
        style: {
          width: '300px',
          justifyContent: 'center',
        },
      },
    );
  }

  async function confirmDeleteMovie(movieId: number) {
    try {
      const response = await api.deleteMovie(movieId);
      if (response.success && response.result?.films) {
        await updateLocalData('films', response.result.films);
        toast.success('Фильм успешно удалён', {
          position: 'top-center',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast.error('Не удалось удалить фильм', {
        position: 'top-center',
        autoClose: 5000,
      });
    }
  }

  const renderTimelines = () => {
    return halls.map((hall) => {
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
                  <img src={deleteImg} alt="Удалить" className="timeline__delete_image" />
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
                        left: `${leftPercent}%`,
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
    });
  };

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

      <div className="movie-seances__timelines">{renderTimelines()}</div>

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
          try {
            const response = await api.addMovie(movie);
            if (response.success && response.result?.films) {
              updateLocalData('films', response.result.films);
            }
          } catch (error) {
            console.error('Error adding movie:', error);
            toast.error('Не удалось добавить фильм', {
              position: 'top-center',
              autoClose: 5000,
            });
          }
        }}
      />

      <AddSeancePopup
        show={showAddSeancePopup}
        onClose={() => setShowAddSeancePopup(false)}
        onSave={addSeance}
        halls={halls}
        movies={movies}
        seances={seances}
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
