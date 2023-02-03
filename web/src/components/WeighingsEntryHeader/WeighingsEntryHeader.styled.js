import styled from 'styled-components';

export const ModalWrapper = styled.div`
  padding: 115px 0 0 20px;
  display: none;
  box-sizing: border-box;

  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;

  background-color: transparent;

  &:has(#showCalendar:checked) {
    display: block;
    pointer-events: unset;
  }
`;

export const CalendarController = styled.input`
  position: absolute;
  left: -99999px;
  opacity: 0;
  height: 1px;
  width: 1px;
`;
