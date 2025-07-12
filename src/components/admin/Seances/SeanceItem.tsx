import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Seance } from '../../../types';

interface SeanceItemProps {
  seance: Seance;
}

export const SeanceItem = ({ seance }: SeanceItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: seance.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="seance-item"
    >
      <div className="seance-content">
        <div className="seance-title">{seance.seance_time}</div>
      </div>
    </div>
  );
};