import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { HeaderBar } from 'components/HeaderBar/HeaderBar';
import { selectUserIsLoggedIn } from 'redux/selectors';
import { MainBodyWrapper } from './CommonLayout.styled';

export const CommonLayout = () => {
  const isLoggedIn = useSelector(selectUserIsLoggedIn);

  console.log('CommonLayout');

  return (
    <>
      <HeaderBar />
      <MainBodyWrapper>{isLoggedIn ? <Outlet /> : <Navigate to="/login" />}</MainBodyWrapper>
    </>
  );
};
