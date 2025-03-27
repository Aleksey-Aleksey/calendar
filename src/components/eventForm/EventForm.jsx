import './EventForm.scss';
import { useState, useEffect } from 'react';
import cn from 'classnames';

export const EventForm = ({ onSave, onCancel, initialData, onDelete }) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#0d6efd');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setColor(initialData.color || '#0d6efd');

      const start = new Date(initialData.start);
      const end = new Date(initialData.end);

      setDate(start.toISOString().split('T')[0]);
      setStartTime(start.toTimeString().slice(0, 5));
      setEndTime(end.toTimeString().slice(0, 5));
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};
    const now = new Date();
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    if (!title.trim()) {
      validationErrors.title = 'Title is required.';
    } else if (title.length > 30) {
      validationErrors.title = 'Title must be at most 30 characters.';
    }

    if (!date) {
      validationErrors.date = 'Date is required.';
    }

    if (!startTime) {
      validationErrors.startTime = 'Start time is required.';
    }

    if (!endTime) {
      validationErrors.endTime = 'End time is required.';
    }

    if (date && start >= end) {
      validationErrors.endTime = 'End time must be after start time.';
    }

    if (date && start < now) {
      validationErrors.startTime = 'Start time cannot be in the past.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSave({ title, start, end, color });

    setTitle('');
    setColor('#0d6efd');
    setDate('');
    setStartTime('');
    setEndTime('');
    setErrors({});
  };

  return (
    <div className='event-form'>
      <form
        className='event-form__container'
        onSubmit={handleSubmit}
      >
        <button
          type='button'
          className='event-form__close'
          onClick={onCancel}
          aria-label='Close'
        >
          &times;
        </button>

        <h3 className='event-form__title'>Add New Event</h3>

        <input
          type='text'
          placeholder='Event title'
          className={cn('event-form__input', {
            'event-form__input--error': errors.title,
          })}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={30}
        />
        {errors.title && <div className='event-form__error-message'>{errors.title}</div>}

        <input
          type='color'
          className='event-form__color'
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <label className='event-form__field'>
          <span className='event-form__label'>Choose day</span>
          <input
            type='date'
            className={cn('event-form__input', {
              'event-form__input--error': errors.date,
            })}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && <div className='event-form__error-message'>{errors.date}</div>}
        </label>

        <label className='event-form__field'>
          <span className='event-form__label'>Event start</span>
          <input
            type='time'
            className={cn('event-form__input', {
              'event-form__input--error': errors.startTime,
            })}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          {errors.startTime && <div className='event-form__error-message'>{errors.startTime}</div>}
        </label>

        <label className='event-form__field'>
          <span className='event-form__label'>Event end</span>
          <input
            type='time'
            className={cn('event-form__input', {
              'event-form__input--error': errors.endTime,
            })}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
          {errors.endTime && <div className='event-form__error-message'>{errors.endTime}</div>}
        </label>

        <div className='event-form__buttons'>
          {initialData ? (
            <>
              <button
                type='button'
                className='event-form__discard'
                onClick={() => onDelete(initialData)}
              >
                Discard
              </button>
              <button
                type='submit'
                className='event-form__save'
              >
                Edit
              </button>
            </>
          ) : (
            <>
              <button
                type='button'
                className='event-form__cancel'
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type='submit'
                className='event-form__save'
              >
                Save
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
