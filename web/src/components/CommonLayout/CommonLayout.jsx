import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { HeaderBar } from 'components/HeaderBar/HeaderBar';
import { selectUserIsLoggedIn } from 'redux/selectors';
import { MainBodyWrapper } from './CommonLayout.styled';
import LoginPage from 'pages/LoginPage';

export const CommonLayout = () => {
  const isLoggedIn = useSelector(selectUserIsLoggedIn);

  return (
    <>
      <HeaderBar />
      <MainBodyWrapper>{isLoggedIn ? <Outlet /> : <LoginPage />}</MainBodyWrapper>
    </>
  );
};
