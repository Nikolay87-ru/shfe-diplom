import React, { useEffect, useState } from "react";
import "./AddSeancePopup.scss";
import { Film, Hall } from "../../../types";
import { api } from "../../../utils/api";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: (hallId:number, movieId:number, time:string)=>Promise<void>|void;
  halls: Hall[];
  movies: Film[];
}
export const AddSeancePopup: React.FC<Props> = ({
  show, onClose, onSave, halls, movies
}) => {
  const [selectedHall, setSelectedHall] = useState<number|undefined>();
  const [selectedMovie, setSelectedMovie] = useState<number|undefined>();
  const [time, setTime] = useState("00:00");
  const [conflicts, setConflicts] = useState<string[]>([]);

  useEffect(()=>{
    if (show) {
      setSelectedHall(halls[0]?.id); 
      setSelectedMovie(movies[0]?.id); 
      setTime("00:00"); setConflicts([]);
    }
  },[show]);

  async function checkConflicts(): Promise<string[]> {
    if(!selectedHall || !selectedMovie) return [];
    const data = await api.getAllData();
    const hallSeances = data.result?.seances.filter(s=>s.seance_hallid===selectedHall) || [];
    const movie = movies.find(m=>m.id===selectedMovie);
    if(!movie) return [];
    const [h,m] = time.split(":").map(Number);
    const start = h*60+m, end = start+movie.film_duration;
    const conflicts: string[] = [];
    for(const s of hallSeances){
      const mo = movies.find(m=>m.id===s.seance_filmid);
      if(!mo) continue;
      const [sh,sm] = s.seance_time.split(":").map(Number);
      const sStart = sh*60+sm, sEnd = sStart+mo.film_duration;
      if((start>=sStart&&start<sEnd)||(end>sStart&&end<=sEnd)||(start<=sStart&&end>=sEnd)){
        conflicts.push(`Конфликт с "${mo.film_name}" в ${s.seance_time}`);
      }
    }
    return conflicts;
  }

  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault();
    if(!selectedHall || !selectedMovie || !time) return;
    const found = await checkConflicts();
    setConflicts(found);
    if(found.length === 0) {
      onSave(selectedHall, selectedMovie, time);
      onClose();
    }
  }

  if(!show) return null;
  return (
    <div className="popup">
      <div className="popup__container">
        <div className="popup__header">
          <div className="popup__header_text">Добавление сеанса</div>
          <div className="popup__close" onClick={onClose}>
            <img src="/close.png" alt="Закрыть" />
          </div>
        </div>
        <form className="popup__form" onSubmit={handleSubmit}>
          <label className="admin_label add-seance_label">
            Название зала
            <select
              className="select__add-seance select__add-seance_hall"
              value={selectedHall}
              onChange={e=>setSelectedHall(Number(e.target.value))}
              required
            >
              {halls.map(hall=>
                <option key={hall.id} value={hall.id}>{hall.hall_name}</option>
              )}
            </select>
          </label>
          <label className="admin_label add-seance_label">
            Название фильма
            <select
              className="select__add-seance select__add-seance_movie"
              value={selectedMovie}
              onChange={e=>setSelectedMovie(Number(e.target.value))}
              required
            >
              {movies.map(movie=>
                <option key={movie.id} value={movie.id}>
                  {movie.film_name} ({movie.film_duration} мин)
                </option>
              )}
            </select>
          </label>
          <label className="admin_label add-seance_label" id="seance_time">
            Время начала
            <input
              type="time"
              className="admin_input add-seans__input_time"
              value={time}
              onChange={e=>setTime(e.target.value)}
              required
            />
          </label>
          {conflicts.length>0 && (
            <div style={{color:'red',lineHeight:'1.4',marginTop:8}}>
              <span style={{fontWeight:700}}>Обнаружены конфликты:</span>
              <ul style={{margin:"3px 0 0 17px",padding:0}}>
                {conflicts.map((c,i)=><li key={i}>{c}</li>)}
              </ul>
            </div>
          )}

          <div className="popup__buttons">
            <button type="button" className="button popup__button_cancel"
              onClick={onClose}>Отменить</button>
            <button type="submit"
              className={"button"+(!(selectedHall&&selectedMovie&&time)?" button_disabled":"")}
              disabled={!(selectedHall&&selectedMovie&&time)}
            >Добавить сеанс</button>
          </div>
        </form>
      </div>
    </div>
  );
};