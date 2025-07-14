import "./HallsList.scss"; 
interface Hall {
  id: number;
  hall_name: string;
}
interface Props {
  halls: Hall[];
  selectedId: number|undefined;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}
export const HallsList: React.FC<Props> = ({halls,selectedId,onSelect,onDelete}) => (
  <ul className="halls__list">
    {halls.map(hall => (
      <li
        key={hall.id}
        className={
          "halls__list_item" + (selectedId===hall.id ? " hall_item-selected" : "")
        }
        onClick={() => onSelect(hall.id)}
      >
        <span className="halls__list_name" data-id={hall.id}>{hall.hall_name}</span>
        <span className="admin__button_remove hall_remove"
          onClick={e => { e.stopPropagation(); onDelete(hall.id); }}
          title="Удалить">
        </span>
      </li>
    ))}
  </ul>
);