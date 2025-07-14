import React, { useEffect, useRef, useState } from "react";
import { api } from "../../../utils/api";
import { Film, Hall, Seance } from "../../../types";
import { AddMoviePopup } from "../Movies/AddMoviePopup";
import { AddSeancePopup } from "./AddSeancePopup";
import "./SeancesGridSection.scss"; 

const colors = ["background_1","background_2","background_3","background_4","background_5"];
function getColorIdx(i:number){ return colors[i%colors.length]; }

export const SeancesGridSection: React.FC = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [movies, setMovies] = useState<Film[]>([]);
  const [seances, setSeances] = useState<Seance[]>([]);
  const [showMoviePopup, setShowMoviePopup] = useState(false);
  const [showAddSeancePopup, setShowAddSeancePopup] = useState(false);
  const [popupSeanceHall, setPopupSeanceHall] = useState<Hall|null>(null);
  const [popupSeanceMovie, setPopupSeanceMovie] = useState<Film|null>(null);

  const [draggedMovieId, setDraggedMovieId] = useState<number|undefined>();
  const [dragStartHallId, setDragStartHallId] = useState<number|undefined>();

  const [deleteTargetSeanceId, setDeleteTargetSeanceId] = useState<number|undefined>();
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [localSeances, setLocalSeances] = useState<Seance[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(()=>{
    api.getAllData().then(res=>{
      setHalls(res.result?.halls||[]);
      setMovies(res.result?.films||[]);
      setSeances(res.result?.seances||[]);
      setLocalSeances(res.result?.seances||[]);
      setHasChanges(false);
    })
  },[]);

  function onDragMovieStart(movieId:number) { setDraggedMovieId(movieId);}
  function onDragMovieEnd() { setDraggedMovieId(undefined); }

  function onDropMovieToHall(hallId:number) {
    if (!draggedMovieId) return;
    setPopupSeanceHall(halls.find(h=>h.id===hallId)||null);
    setPopupSeanceMovie(movies.find(m=>m.id===draggedMovieId)||null);
    setShowAddSeancePopup(true);
    setDraggedMovieId(undefined);
  }

  async function addSeance(hallId:number, movieId:number, time:string) {
    const newSeance: Seance = {
      id: Date.now(), // temp
      seance_hallid:hallId, seance_filmid:movieId, seance_time:time
    };
    setLocalSeances(ses=>[...ses, newSeance]);
    setHasChanges(true);
  }

  function onDragSeanceStart(seanceId:number, hallId:number) {
    setDragStartHallId(hallId);
    setDeleteTargetSeanceId(seanceId);
  }
  function onDragSeanceEnd() { setDeleteTargetSeanceId(undefined); setDragStartHallId(undefined);}
  function onDropSeanceToTrash() {
    setShowDeletePopup(true);
  }
  function confirmDeleteSeance() {
    setLocalSeances(cur => cur.filter(s => s.id !== deleteTargetSeanceId));
    setHasChanges(true);
    setShowDeletePopup(false);
    setDeleteTargetSeanceId(undefined);
  }
  function cancelDeleteSeance() {
    setShowDeletePopup(false);
    setDeleteTargetSeanceId(undefined);
  }


  function handleCancel() {
    setLocalSeances(seances);
    setHasChanges(false);
  }
  async function handleSave() {
    for(const s of localSeances) {
      if(!seances.some(ss=>ss.id===s.id)) {
        await api.addSeance({
          hallId:s.seance_hallid,
          movieId:s.seance_filmid,
          time:s.seance_time
        });
      }
    }

    for(const s of seances) {
      if(!localSeances.some(ss=>ss.id===s.id)) {
        await api.deleteSeance(s.id);
      }
    }

    const res = await api.getAllData();
    setSeances(res.result?.seances||[]);
    setLocalSeances(res.result?.seances||[]);
    setHasChanges(false);
  }

  return (
    <div>
      <div className="movie-seances__wrapper">
        {movies.map((movie, i) =>
          <div className={"movie-seances__movie "+getColorIdx(i)}
            key={movie.id}
            draggable
            tabIndex={0}
            onDragStart={()=>onDragMovieStart(movie.id)}
            onDragEnd={onDragMovieEnd}
          >
            <img className="movie-seances__movie_poster" src={movie.film_poster} alt="постер"/>
            <div className="movie-seances__movie_info">
              <div><span className="movie_info-title">{movie.film_name}</span></div>
              <div className="movie_info-length">{movie.film_duration} мин</div>
            </div>
            {/* Кнопка удаления фильма */}
          </div>
        )}

        <button className="admin__button_movie button"
          onClick={()=>setShowMoviePopup(true)}
          style={{height:50,minWidth:130,marginLeft:14,alignSelf:"center"}}>
          Добавить фильм
        </button>
      </div>

      <div className="movie-seances__timelines">
        {halls.map(hall=>{
          const hallSeances = localSeances.filter(s=>s.seance_hallid===hall.id);
          return (
          <div className="movie-seances__timeline" key={hall.id}>
            <div className={"timeline__delete"+(deleteTargetSeanceId?" drop-target":"")}
              onDragOver={e=>{e.preventDefault();}}
              onDrop={onDropSeanceToTrash}
            >
              <img src="/delete.png" className="timeline__delete_image" alt="Удалить сеанс"/>
            </div>
            <div className="timeline__hall_title">{hall.hall_name}</div>
            <div className="timeline__seances"
                onDragOver={e=>{e.preventDefault();}}
                onDrop={()=>onDropMovieToHall(hall.id)}
            >
              {hallSeances.map((seance,idx)=>{
                const movie = movies.find(m=>m.id===seance.seance_filmid)!;
                const [hh,mm] = seance.seance_time.split(":").map(Number);
                const minutes = hh*60+mm;
                const left = (minutes/(24*60))*100;
                const width = (movie.film_duration/(24*60))*100;
                const colorClass = getColorIdx(movies.findIndex(m=>m.id===movie.id));
                return (
                  <div
                    key={seance.id}
                    className={"timeline__seances_movie "+colorClass+(deleteTargetSeanceId===seance.id?" selected":"")}
                    style={{
                      left: left+"%",
                      width: width+"%"
                    }}
                    draggable
                    tabIndex={0}
                    onDragStart={()=>onDragSeanceStart(seance.id,hall.id)}
                    onDragEnd={onDragSeanceEnd}
                  >
                    <div className="timeline__seances_title">{movie.film_name}</div>
                    <div className="timeline__movie_start" data-duration={movie.film_duration}>{seance.seance_time}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )})}
      </div>

      <div className="movie-seances__buttons">
        <button
          className={"admin__button_cancel movie-seances__batton_cancel button"+(hasChanges?"":" button_disabled")}
          disabled={!hasChanges}
          onClick={handleCancel}
        >Отмена</button>
        <button
          className={"admin__button_save movie-seances__batton_save button"+(hasChanges?"":" button_disabled")}
          disabled={!hasChanges}
          onClick={handleSave}
        >Сохранить</button>
      </div>

      <AddMoviePopup show={showMoviePopup}
        onClose={()=>setShowMoviePopup(false)}
        onSave={async movie=>{
          await api.addMovie(movie); 
          const res = await api.getAllData();
          setMovies(res.result?.films||[]);
          setSeances(res.result?.seances||[]);
          setLocalSeances(res.result?.seances||[]);
          setHasChanges(false);
        }}
      />
      <AddSeancePopup
        show={showAddSeancePopup}
        onClose={()=>setShowAddSeancePopup(false)}
        onSave={addSeance}
        halls={halls}
        movies={movies}
        initialHall={popupSeanceHall||undefined}
        initialMovie={popupSeanceMovie||undefined}
      />

      {showDeletePopup && (
        <div className="popup">
          <div className="popup__container">
            <div className="popup__header">
              <div className="popup__header_text">Удаление сеанса</div>
              <div className="popup__close" onClick={cancelDeleteSeance}>
                <img src="/close.png" alt="Закрыть" />
              </div>
            </div>
            <div style={{padding:"22px 28px",textAlign:"center"}}>
              Вы действительно хотите удалить сеанс?
            </div>
            <div className="popup__buttons" style={{marginTop:20}}>
              <button className="button" onClick={confirmDeleteSeance}>Удалить</button>
              <button className="button popup__button_cancel" onClick={cancelDeleteSeance}>Отменить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};