import './styles/normalize.scss';
import { Calendar } from './components/calendar/Calendar';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="calendarApp">
        <Calendar />
      </div>
    </DndProvider>
  );
};
