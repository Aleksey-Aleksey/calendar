import './Calendar.scss';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { EventForm } from '../eventForm/EventForm';
import { DnDCalendarEvent } from './DnDCalendarEvent';
import { useState, useEffect } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import enUS from 'date-fns/locale/en-US';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      const parsed = JSON.parse(storedEvents);
      const revived = parsed.map((ev) => ({
        ...ev,
        start: new Date(ev.start),
        end: new Date(ev.end),
      }));
      setEvents(revived);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleEventDrop = ({ event, start, end }) => {
    const updatedEvent = { ...event, start, end };
    const updatedEvents = events.map((ev) => (isSameEvent(ev, event) ? updatedEvent : ev));

    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const handleAddEvent = () => {
    setIsFormOpen(true);
  };

  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setIsFormOpen(true);
  };

  const isSameEvent = (a, b) => {
    return (
      a.title === b.title &&
      new Date(a.start).getTime() === new Date(b.start).getTime() &&
      new Date(a.end).getTime() === new Date(b.end).getTime()
    );
  };

  const handleSaveEvent = (newEvent) => {
    let updatedEvents;

    if (eventToEdit) {
      updatedEvents = events.map((ev) => (isSameEvent(ev, eventToEdit) ? newEvent : ev));
    } else {
      updatedEvents = [...events, newEvent];
    }

    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    setIsFormOpen(false);
    setEventToEdit(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEventToEdit(null);
  };

  const handleDelete = (eventToDelete) => {
    setEvents((prev) => prev.filter((ev) => ev !== eventToDelete));
    setIsFormOpen(false);
    setEventToEdit(null);
  };

  const DragAndDropCalendar = withDragAndDrop(BigCalendar);

  return (
    <div className='calendar'>
      <div className='calendar__toolbar'>
        <button
          className='calendar__button'
          onClick={handleAddEvent}
        >
          Add event
        </button>
      </div>

      {isFormOpen && (
        <EventForm
          onSave={handleSaveEvent}
          onCancel={handleCancel}
          initialData={eventToEdit}
          onDelete={handleDelete}
        />
      )}

      <div className='calendar__core'>
        <div className='calendar__core-inner'>
          <DragAndDropCalendar
            onSelectEvent={handleEditEvent}
            localizer={localizer}
            events={events}
            startAccessor='start'
            endAccessor='end'
            defaultView='month'
            views={['month', 'week', 'day', 'agenda']}
            draggableAccessor={() => true}
            onEventDrop={handleEventDrop}
            components={{ event: DnDCalendarEvent }}
          />
        </div>
      </div>
    </div>
  );
};
