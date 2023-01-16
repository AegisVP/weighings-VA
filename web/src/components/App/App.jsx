import { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router';

import { authHeader } from 'utils/authHeader';
import { refreshUser } from 'redux/actions';
import { selectUserIsLoggedIn, selectUserIsRefreshing, selectUserToken } from 'redux/selectors';

import { CommonLayout } from 'components/CommonLayout/CommonLayout';

const WeighingsEnrtyPage = lazy(() => import('pages/WeighingsEntry'));
const WeighingsAnalyzePage = lazy(() => import('pages/WeighingsAnalyze'));
const LoginPage = lazy(() => import('pages/LoginPage'));
const ReportsPage = lazy(() => import('pages/ReportsPage'));
const DriverListPage = lazy(() => import('pages/DriverListPage'));
const DriverReport = lazy(() => import('pages/DriverReport'));
const DaySelectPage = lazy(() => import('pages/DaySelectPage'));
const Form78Report = lazy(() => import('pages/Form78Report'));

export const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectUserIsLoggedIn);
  const isRefreshing = useSelector(selectUserIsRefreshing);
  const token = useSelector(selectUserToken);

  // Load user info into redux
  useEffect(() => {
    if (!isLoggedIn && isRefreshing) {
      authHeader.set(token);

      dispatch(refreshUser());
    }
  }, [dispatch, isLoggedIn, isRefreshing, token]);

  return (
    <Suspense fallback={<p>Please wait, loading...</p>}>
      <Routes>
        <Route path="/" element={<CommonLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="weighings" element={<WeighingsEnrtyPage />}>
            <Route path=":params" element={<WeighingsAnalyzePage />} />
          </Route>
          <Route path="reports" element={<ReportsPage />}>
            <Route path="driver" element={<DriverListPage />}>
              <Route path=":driver" element={<DriverReport />} />
            </Route>
            <Route path="daily" element={<DaySelectPage />}>
              <Route path=":day" element={<Form78Report />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};
