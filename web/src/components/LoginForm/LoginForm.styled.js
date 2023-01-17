import styled from 'styled-components';

export const StyledButton = styled.button`
  margin: 10px;
  padding: 10px 20px;
  min-width: 120px;
  min-height: 45px;

  outline: none;
  border: none;
  border-radius: 10px;

  background-color: #ffffee;
  box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.1);

  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    color: #666666;
  }

  &:hover,
  &:focus {
    box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.1), inset -2px -2px 3px 1px rgba(0, 0, 0, 0.1);
  }

  &:active {
    box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.1), inset 2px 2px 3px 1px rgba(0, 0, 0, 0.3);
  }
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`;

export const StyledEntryField = styled.label`
  margin: 10px auto;
`;

export const StyledLabel = styled.span`
  margin: 0 5px;
`;

export const StyledInputField = styled.input`
  margin: 0 5px;
  padding: 5px 10px;
  outline: none;
  border: 1px solid #cccccc;
  border-bottom: 3px solid #888888;
  border-radius: 5px;
  background-color: #ffffee;
`;
