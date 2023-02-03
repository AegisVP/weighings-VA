import { Calendar } from 'react-calendar';
import { createPortal } from 'react-dom';
import 'react-calendar/dist/Calendar.css';
import { CalendarController, ModalWrapper } from './WeighingsEntryHeader.styled';

export const WeighingsEntryHeader = ({ destinationsList = [], cropsList = [], updateDate, searchDate = new Date(), dailyTotal }) => {
  const showCalendarCheckEl = document.getElementById('showCalendar');
  const modalWrapperEl = document.getElementById('modalWrapper');

  const closeCalendar = () => {
    modalWrapperEl.removeEventListener('click', handleClick);
    document.removeEventListener('keydown', handleKeyPress);

    showCalendarCheckEl.checked = false;
  };

  const handleShowCalendar = e => {
    if (showCalendarCheckEl.checked) return;

    showCalendarCheckEl.checked = true;
    modalWrapperEl.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyPress);
  };

  const handleDateChange = e => {
    updateDate(e);
    closeCalendar();
  };

  const handleKeyPress = e => {
    if (e.code !== 'Escape') return;

    closeCalendar();
  };

  const handleClick = e => {
    if (e.target !== e.currentTarget) return;

    closeCalendar();
  };

  return (
    <div id="weighingsHeader">
      <label>
        Дата
        <input type="text" onChange={handleShowCalendar} onFocus={handleShowCalendar} value={searchDate.toLocaleDateString('uk-UA', { dateStyle: 'long' })} />
        {createPortal(
          <ModalWrapper id="modalWrapper">
            <CalendarController type="checkbox" id="showCalendar" />
            <Calendar onChange={handleDateChange} value={searchDate} locale="uk-UA" />
          </ModalWrapper>,
          document.getElementById('root-modal')
        )}
      </label>

      <label>
        Місце призначення
        <select id="destination" name="destination">
          {destinationsList.length > 0 ? (
            destinationsList.map(i => (
              <option value={i._id} key={i.destination}>
                {i.destination}
              </option>
            ))
          ) : (
            <option>--------</option>
          )}
        </select>
      </label>

      <label>
        Культура
        <select name="crop">
          {cropsList.length > 0 ? (
            cropsList.map(i => (
              <option key={i._id} value={i._id}>
                {i.crop}
              </option>
            ))
          ) : (
            <option>--------</option>
          )}
        </select>
      </label>

      <button type="button" aria-label="Add weighing">
        +
      </button>

      <label>
        <span className="pr-2">За день</span>
        <input type="text" name="dailyTotal" value={`${dailyTotal} кг`} readOnly />
      </label>
    </div>
  );
};
