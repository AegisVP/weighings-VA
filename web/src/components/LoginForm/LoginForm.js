import { useDispatch } from 'react-redux';

import { loginUser } from 'redux/user/userOperations';
import { StyledButton, StyledEntryField, StyledForm, StyledInputField, StyledLabel } from './LoginForm.styled';

export const LoginForm = () => {
  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    const email = e.currentTarget.elements.email.value;
    const password = e.currentTarget.elements.password.value;

    console.log({
      email,
      password,
    });

    dispatch(loginUser({ email, password }));
  };

  return (
    <StyledForm onSubmit={submitHandler} autoComplete="off">
      <StyledEntryField>
        <StyledLabel>Username:</StyledLabel>
        <StyledInputField type="text" name="email" autoComplete="username" />
      </StyledEntryField>

      <StyledEntryField>
        <StyledLabel>Password:</StyledLabel>
        <StyledInputField type="password" name="password" autoComplete="current-password" />
      </StyledEntryField>

      <StyledButton type="submit">Submit</StyledButton>
    </StyledForm>
  );
};
