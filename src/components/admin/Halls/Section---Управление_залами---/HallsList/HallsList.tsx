import './HallsList.scss';
import { MdDelete } from 'react-icons/md';

interface Hall {
  id: number;
  hall_name: string;
}

interface Props {
  halls?: Hall[];
  selectedId: number | undefined;
  onSelect: (id: number) => void;
  onDelete?: (id: number) => void;
  className?: string;
}

export const HallsList: React.FC<Props> = ({
  halls = [],
  selectedId,
  onSelect,
  onDelete,
  className = '',
}) => (
  <ul className={`halls__list ${className}`}>
    {halls.map((hall) => (
      <li
        key={hall.id}
        className={'halls__list_item' + (selectedId === hall.id ? ' hall_item-selected' : '')}
        onClick={() => onSelect(hall.id)}
      >
        <span className="halls__list_name">{hall.hall_name}</span>
        {onDelete && (
          <span
            className="admin__button_remove hall_remove"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(hall.id);
            }}
            title="Удалить"
          >
            <MdDelete size={18} />
          </span>
        )}
      </li>
    ))}
  </ul>
);
