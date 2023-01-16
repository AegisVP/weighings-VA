import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { HeaderBar } from 'components/HeaderBar/HeaderBar';
import { LoginForm } from 'components/LoginForm/LoginForm';
import { selectUserIsLoggedIn } from 'redux/selectors';

export const CommonLayout = () => {
  const isLoggedIn = useSelector(selectUserIsLoggedIn);

  return (
    <>
      <HeaderBar />
      {isLoggedIn ? <Outlet /> : <LoginForm />}
    </>
  );
};
