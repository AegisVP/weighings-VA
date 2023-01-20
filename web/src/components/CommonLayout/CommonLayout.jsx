import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { HeaderBar } from 'components/HeaderBar/HeaderBar';
import { selectUserIsLoggedIn, selectUserIsRefreshing } from 'redux/selectors';
import { MainBodyWrapper } from './CommonLayout.styled';
import LoginPage from 'pages/LoginPage';

export const CommonLayout = () => {
  const isLoggedIn = useSelector(selectUserIsLoggedIn);
  const isRefreshing = useSelector(selectUserIsRefreshing);

  return (
    <>
      <HeaderBar />
      <MainBodyWrapper>{isLoggedIn ? <Outlet /> : !isRefreshing ? <LoginPage /> : 'Please wait, attempting to log in...'}</MainBodyWrapper>
    </>
  );
};
