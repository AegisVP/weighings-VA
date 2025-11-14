import { createBrowserRouter, RouterProvider, Navigate, redirect } from 'react-router-dom';

import { menuLinks } from './sections';
import { CommonLayout } from '../layouts/CommonLayout';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { LogoutPage } from '../pages/LogoutPage';
import { MainMenuPage } from '../pages/MainMenuPage';
import { SettingsPage } from '../pages/SettingsPage';
import { WeighingEntry } from '../pages/WeighingEntry';
import { AnalyzePage } from '../pages/AnalyzePage';
import { store, persistor, waitForRehydration } from '../redux/store';
import { loadCrop } from '../redux/resources/resourcesOperations/cropOperations';
import { loadLocation } from '../redux/resources/resourcesOperations/locationOperations';
import { loadMachine } from '../redux/resources/resourcesOperations/machineOperations';
import { loadOperator } from '../redux/resources/resourcesOperations/operatorOperations';
import { refreshUser } from '../redux/user/userOperations';
import { userHasFeature } from '../redux/user/userSlice';
import { searchWeighing } from '../redux/weighings/weighingsOperations';

const { getState, dispatch } = store;

const waitForLoginRefresh = async () => {
  await waitForRehydration(persistor);

  const token = getState().auth.token;
  if (token) {
    await dispatch(refreshUser());
  }
};

const loadTodaysWeighings = async () => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);

  await dispatch(searchWeighing({ startDate: todayStart.toISOString(), endDate: todayEnd.toISOString() }));
};

const router = createBrowserRouter([
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    loader: async () => {
      await waitForLoginRefresh();

      await Promise.all([
        dispatch(loadCrop()),
        dispatch(loadOperator()),
        dispatch(loadLocation()),
        dispatch(loadMachine()),
      ]);

      return null;
    },
    children: [
      {
        path: '/',
        element: <CommonLayout />,
        children: [
          {
            index: true,
            element: <MainMenuPage />,
          },
          {
            path: 'weighing',
            element: <WeighingEntry />,
            loader: async () => {
              await waitForLoginRefresh();

              if (!userHasFeature(menuLinks.weighing.feature, getState())) return redirect('/');

              await loadTodaysWeighings();
              return null;
            },
          },
          {
            path: 'reporting',
            element: <AnalyzePage />,
            loader: async () => {
              await waitForLoginRefresh();

              if (!userHasFeature(menuLinks.reporting.feature, getState())) return redirect('/');

              await loadTodaysWeighings();
              return null;
            },
          },
          {
            path: 'settings',
            element: <SettingsPage />,
            loader: async () => {
              await waitForLoginRefresh();

              if (!userHasFeature(menuLinks.settings.feature, getState())) return redirect('/');
              return null;
            },
          },
          {
            path: 'logout',
            element: <LogoutPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
