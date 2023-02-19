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

export const HeaderLabel = styled.label`
  margin: 0 15px 0 0;
`;

export const AddButton = styled.button`
  width: 35px;
  height: 24px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0 15px 0 0;
  border: 1px solid black;
  border-radius: 5px;
  background-color: #b2e74e;
`;
