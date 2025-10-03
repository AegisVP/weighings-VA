import { Loader } from 'components/Loader/Loader';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserError, selectUserIsLoading } from 'redux/selectors';

import { loginUser } from 'redux/user/userOperations';
import { ErrorMessage, StyledButton, StyledEntryField, StyledForm, StyledInputField, StyledLabel } from './LoginForm.styled';

export const LoginForm = () => {
  const [inputTouched, setInputTouched] = useState(false);
  const isLoading = useSelector(selectUserIsLoading);
  const userError = useSelector(selectUserError);
  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    const { email, password } = e.currentTarget.elements;

    setInputTouched(false);
    dispatch(loginUser({ email: email.value, password: password.value }));
  };

  return (
    <StyledForm onSubmit={submitHandler} autoComplete="off">
      <StyledEntryField>
        <StyledLabel>Username:</StyledLabel>
        <StyledInputField type="text" name="email" autoComplete="username" onChange={() => setInputTouched(true)} required />
      </StyledEntryField>

      <StyledEntryField>
        <StyledLabel>Password:</StyledLabel>
        <StyledInputField type="password" name="password" autoComplete="current-password" onChange={() => setInputTouched(true)} required />
      </StyledEntryField>

      <StyledButton type="submit" disabled={isLoading}>
        {isLoading ? <Loader style={{ width: '24px', height: '24px' }} /> : 'Вхід'}
      </StyledButton>

      {!!userError && !inputTouched && <ErrorMessage>{userError}</ErrorMessage>}
    </StyledForm>
  );
};
