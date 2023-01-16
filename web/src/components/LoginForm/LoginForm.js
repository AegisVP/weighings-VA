import { useDispatch } from 'react-redux';

import { loginUser } from 'redux/user/userOperations';

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
    <form onSubmit={submitHandler}>
      <label>
        Username:
        <input type="text" name="email" autoComplete="username" />
      </label>

      <label>
        Password:
        <input type="password" name="password" autoComplete="current-password" />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};
