import styled from 'styled-components';

export const StyledButton = styled.button`
  margin: ${p => p.theme.mp(2)};
  padding: ${p => p.theme.mp(2, 3)};
  min-width: 120px;
  min-height: 45px;

  outline: none;
  border: none;
  border-radius: ${p => p.theme.mp(2)};

  background-color: ${p => p.theme.colors.background.secondBackground};
  box-shadow: ${p => p.theme.shadow.button.default};

  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    color: ${p => p.theme.colors.text.mediumText};
  }

  &:hover,
  &:focus {
    box-shadow: ${p => p.theme.shadow.button.default}, ${p => p.theme.shadow.button.hover};
  }

  &:active {
    box-shadow: ${p => p.theme.shadow.button.default}, ${p => p.theme.shadow.button.active};
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
  margin: ${p => p.theme.mp(2, 'auto')};
`;

export const StyledLabel = styled.span`
  margin: ${p => p.theme.mp(0, 1)};
`;

export const StyledInputField = styled.input`
  margin: ${p => p.theme.mp(0, 1)};
  padding: ${p => p.theme.mp(1, 0)};
  outline: none;
  border: 1px solid #cccccc;
  border-bottom: 3px solid #888888;
  border-radius: ${p => p.theme.radii.normal};
  background-color: ${p => p.theme.colors.background.secondBackground};
`;

export const ErrorMessage = styled.div`
  color: ${p => p.theme.colors.errorText};
  font-weight: ${p => p.theme.fontWeights.bold};
`;
