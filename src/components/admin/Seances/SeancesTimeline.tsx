import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

export const SeancesTimeline = () => {
  const { seances, moveSeance } = useSeances();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      moveSeance(active.id, over.id);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={seances}>
        {seances.map(seance => (
          <SeanceItem key={seance.id} seance={seance} />
        ))}
      </SortableContext>
    </DndContext>
  );
};