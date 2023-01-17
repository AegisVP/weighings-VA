import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

import { LoginForm } from 'components/LoginForm/LoginForm';
import { selectUserIsLoggedIn } from 'redux/selectors';

const LoginPage = () => {
  const isLoggedIn = useSelector(selectUserIsLoggedIn);
  return isLoggedIn ? <Navigate to="/" /> : <LoginForm />;
};

export default LoginPage;
