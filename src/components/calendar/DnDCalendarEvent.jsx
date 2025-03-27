import { useDrag } from 'react-dnd';

export const DnDCalendarEvent = ({ event, onSelect }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'event',
    item: { ...event },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      onClick={() => onSelect?.(event)}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: event.color || '#0d6efd',
        padding: '2px 4px',
        borderRadius: '4px',
        color: '#fff',
        fontSize: '12px',
        cursor: 'pointer',
      }}
    >
      {event.title}
    </div>
  );
};
