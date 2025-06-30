import { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const TimeTablePage = ({ movies }) => {
  const [schedule, setSchedule] = useState([]);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newSchedule = Array.from(schedule);
    const [movedMovie] = newSchedule.splice(result.source.index, 1);
    newSchedule.splice(result.destination.index, 0, movedMovie);
    setSchedule(newSchedule);
  };

  return (
    <Droppable droppableId="schedule">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          {schedule.map((movie, index) => (
            <Draggable key={movie.id} draggableId={movie.id} index={index}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                  {movie.title}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TimeTablePage;