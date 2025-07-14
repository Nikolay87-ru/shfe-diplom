import React from 'react';
import './HallConfig.scss';

interface Props {
  halls: {id:number, hall_name:string}[];
  selectedId: number|undefined;
  onSelect: (id:number)=>void;
  className?: string;
}
export const HallsChoose: React.FC<Props> = ({halls, selectedId, onSelect, className=""}) =>
  <ul className={"halls_choose "+className}>
    {halls.map(hall=>
      <li
        key={hall.id}
        className={"hall__item hall-config__item"+(selectedId===hall.id?' hall_item-selected':'')}
        tabIndex={0}
        onClick={()=>onSelect(hall.id)}
        onKeyDown={e=>{if(e.key==='Enter') onSelect(hall.id)}}
      >{hall.hall_name}</li>
    )}
  </ul>;