import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { SeanceItem } from './SeanceItem';
import { Seance } from '../../../types';

interface SeancesTimelineProps {
  seances: Seance[];
  onSeanceMove: (activeId: number, overId: number) => void;
}

export const SeancesTimeline = ({ seances, onSeanceMove }: SeancesTimelineProps) => {
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onSeanceMove(Number(active.id), Number(over.id));
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={seances.map(s => s.id)}>
        {seances.map(seance => (
          <SeanceItem key={seance.id} seance={seance} />
        ))}
      </SortableContext>
    </DndContext>
  );
};