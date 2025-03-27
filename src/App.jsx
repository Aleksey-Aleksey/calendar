import './styles/normalize.scss';
import './App.scss';
import { Calendar } from './components/calendar/Calendar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isTouchDevice } from './utils/isTouchDevice';

const backend = isTouchDevice() ? TouchBackend : HTML5Backend;

export const App = () => {
  return (
    <DndProvider backend={backend}>
      <div className="calendarApp">
        <Calendar />
      </div>
    </DndProvider>
  );
};
