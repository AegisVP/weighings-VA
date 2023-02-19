import { Calendar } from 'react-calendar';
import { createPortal } from 'react-dom';
import 'react-calendar/dist/Calendar.css';
import { AddButton, CalendarController, HeaderLabel, ModalWrapper } from './WeighingsEntryHeader.styled';
import { date2Obj } from 'utils';

export const WeighingsEntryHeader = ({ sourcesList = [], destinationsList = [], cropsList = [], updateDate, searchDate = new Date(), addNewWeighing }) => {
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

  const handleAddNewEntry = e => {
    e.preventDefault();
    const newEntry = {
      date: date2Obj(searchDate),
      crop: {
        source: e.currentTarget.elements.source.value.toString(),
        id: e.currentTarget.elements.crop.value.toString(),
        destination: e.currentTarget.elements.destination.value.toString(),
      },
      auto: { id: null, driver: null },
      harvesters: [],
      weighing: { tare: null, brutto: null },
    };

    addNewWeighing(newEntry);
  };

  return (
    <div id="weighingsHeader">
      <form onSubmit={handleAddNewEntry}>
        <HeaderLabel>
          Дата:
          <input type="text" onChange={handleShowCalendar} onFocus={handleShowCalendar} value={searchDate.toLocaleDateString('uk-UA', { dateStyle: 'long' })} className="w-fit" />
          {createPortal(
            <ModalWrapper id="modalWrapper">
              <CalendarController type="checkbox" id="showCalendar" />
              <Calendar onChange={handleDateChange} value={searchDate} locale="uk-UA" />
            </ModalWrapper>,
            document.getElementById('root-modal')
          )}
        </HeaderLabel>

        <HeaderLabel>
          Джерело:
          <select id="source" name="source" className="w-fit">
            {sourcesList.length > 0 ? (
              sourcesList.map(i => (
                <option value={i._id} key={i.source}>
                  {i.source}
                </option>
              ))
            ) : (
              <option>--------</option>
            )}
          </select>
        </HeaderLabel>

        <HeaderLabel>
          Місце призначення:
          <select id="destination" name="destination" className="w-fit">
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
          <select name="crop" className="w-fit">
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

        <AddButton type="submit" aria-label="Add weighing">
          +
        </AddButton>
      </form>
    </div>
  );
};
