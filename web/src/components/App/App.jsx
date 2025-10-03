import { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useNavigate } from 'react-router';

import { authHeader } from 'utils';
import { refreshUser } from 'redux/actions';
import { selectUserIsLoggedIn, selectUserIsRefreshing, selectUserToken } from 'redux/selectors';

import { CommonLayout } from 'components/CommonLayout/CommonLayout';

const WelcomePage = lazy(() => import('pages/WelcomePage'));
const WeighingsPage = lazy(() => import('pages/WeighingsPage'));
const WeighingsAnalyzePage = lazy(() => import('pages/WeighingsAnalyzePage'));
const LoginPage = lazy(() => import('pages/LoginPage'));
const ReportsPage = lazy(() => import('pages/ReportsPage'));
const DriverListPage = lazy(() => import('pages/DriverListPage'));
const DriverReportPage = lazy(() => import('pages/DriverReportPage'));
const DaySelectPage = lazy(() => import('pages/DaySelectPage'));
const Form78ReportPage = lazy(() => import('pages/Form78ReportPage'));

export const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isRefreshing = useSelector(selectUserIsRefreshing);
  const isLoggedIn = useSelector(selectUserIsLoggedIn);
  const token = useSelector(selectUserToken);

  // Load user info into redux
  useEffect(() => {
    if (isRefreshing) {
      authHeader.set(token);
      dispatch(refreshUser());
    } else {
      if (!isLoggedIn) navigate('/login');
    }
  }, [dispatch, isLoggedIn, isRefreshing, navigate, token]);

  return (
    <Suspense fallback={<p>Please wait, loading...</p>}>
      <Routes>
        <Route path="/" element={<CommonLayout />}>
          <Route index element={<WelcomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="weighings" element={<WeighingsPage />}>
            <Route path=":params" element={<WeighingsAnalyzePage />} />
          </Route>
          <Route path="reports" element={<ReportsPage />}>
            <Route path="driver" element={<DriverListPage />}>
              <Route path=":driver" element={<DriverReportPage />} />
            </Route>
            <Route path="history" element={<DaySelectPage />}>
              <Route path=":day" element={<Form78ReportPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};
