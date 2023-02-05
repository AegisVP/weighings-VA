import { Calendar } from 'react-calendar';
import { createPortal } from 'react-dom';
import 'react-calendar/dist/Calendar.css';
import { AddButton, CalendarController, HeaderLabel, ModalWrapper } from './WeighingsEntryHeader.styled';

export const WeighingsEntryHeader = ({ destinationsList = [], cropsList = [], updateDate, searchDate = new Date(), dailyTotal, addNewWeighing }) => {
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
      <HeaderLabel>
        Дата:
        <input type="text" onChange={handleShowCalendar} onFocus={handleShowCalendar} value={searchDate.toLocaleDateString('uk-UA', { dateStyle: 'long' })} />
        {createPortal(
          <ModalWrapper id="modalWrapper">
            <CalendarController type="checkbox" id="showCalendar" />
            <Calendar onChange={handleDateChange} value={searchDate} locale="uk-UA" />
          </ModalWrapper>,
          document.getElementById('root-modal')
        )}
      </HeaderLabel>

      <HeaderLabel>
        Місце призначення:
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
      </HeaderLabel>

      <HeaderLabel>
        Культура:
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
      </HeaderLabel>

      <AddButton type="button" aria-label="Add weighing" onClick={addNewWeighing}>
        +
      </AddButton>

      <HeaderLabel>
        За день:
        <input type="text" name="dailyTotal" value={`${dailyTotal} кг`} readOnly />
      </HeaderLabel>
    </div>
  );
};
