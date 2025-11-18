import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';
import Container from '@mui/material/Container';
import Skeleton from '@mui/material/Skeleton';

import { useAppDispatch, useAppSelector } from '../redux/hooks.ts';
import { HeaderBar } from '../components/HeaderBar/HeaderBar.tsx';
import { useAuth } from '../hooks/useAuth.ts';
import { selectUserIsLoading } from '../redux/user/userSelectors.ts';
import { refreshUser } from '../redux/user/userOperations.ts';

export const CommonLayout = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectUserIsLoading);
  const { isLoggedIn, isRefreshing } = useAuth();

  useEffect(() => {
    if (isLoggedIn || !isRefreshing) return;
    dispatch(refreshUser());
  }, [dispatch, isLoggedIn, isRefreshing]);

  return (
    <Container disableGutters maxWidth={false} sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <HeaderBar />
      <Container component="main" sx={{ flexGrow: 1, py: 2 }} maxWidth="xl">
        {isLoggedIn ? (
          <Outlet />
        ) : isLoading || isRefreshing ? (
          <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Skeleton animation="pulse" width="80%" variant="rounded" sx={{ height: 100 }} />
          </Container>
        ) : (
          <Navigate to="/login" />
        )}
      </Container>
      <Container component="footer" sx={{ py: 2, backgroundColor: '#f5f5f5' }} maxWidth={false}>
        <Container sx={{ textAlign: 'center', color: '#888' }} maxWidth="xl">
          © {new Date().getFullYear()} Vital-AGRO. All rights reserved.
        </Container>
      </Container>
    </Container>
  );
};
