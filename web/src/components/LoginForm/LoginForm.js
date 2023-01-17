import { Loader } from 'components/Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserIsLoading } from 'redux/selectors';

import { loginUser } from 'redux/user/userOperations';
import { StyledButton, StyledEntryField, StyledForm, StyledInputField, StyledLabel } from './LoginForm.styled';

export const LoginForm = () => {
  const isLoading = useSelector(selectUserIsLoading);
  const dispatch = useDispatch();

  const submitHandler = e => {
    e.preventDefault();
    const { email, password } = e.currentTarget.elements;

    dispatch(loginUser({ email: email.value, password: password.value }));
  };

  return (
    <StyledForm onSubmit={submitHandler} autoComplete="off">
      <StyledEntryField>
        <StyledLabel>Username:</StyledLabel>
        <StyledInputField type="text" name="email" autoComplete="username" required />
      </StyledEntryField>

      <StyledEntryField>
        <StyledLabel>Password:</StyledLabel>
        <StyledInputField type="password" name="password" autoComplete="current-password" required />
      </StyledEntryField>

      <StyledButton type="submit" disabled={isLoading}>
        {isLoading ? <Loader style={{ width: '24px', height: '24px' }} /> : 'Вхід'}
      </StyledButton>
    </StyledForm>
  );
};
