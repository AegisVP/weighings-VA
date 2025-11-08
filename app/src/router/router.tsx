import { createBrowserRouter, RouterProvider, Navigate, Outlet, redirect } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Your auth hook
import { CommonLayout } from '../layouts/CommonLayout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { LogoutPage } from '../pages/LogoutPage';
import { MainMenuPage } from '../pages/MainMenuPage';
import { SettingsPage } from '../pages/SettingsPage';
import { WeighingEntry } from '../pages/WeighingEntry';
import { store, persistor, waitForRehydration } from '../redux/store';
import { loadCrop } from '../redux/resources/resourcesOperations/cropOperations';
import { loadLocation } from '../redux/resources/resourcesOperations/locationOperations';
import { loadMachine } from '../redux/resources/resourcesOperations/machineOperations';
import { loadMachineType } from '../redux/resources/resourcesOperations/machineTypeOperations';
import { loadOperator } from '../redux/resources/resourcesOperations/operatorOperations';
import { refreshUser } from '../redux/user/userOperations';
import { userHasFeature } from '../redux/user/userSlice';
import { menuLinks } from './sections';

const ProtectedRoute = () => {
  const { isLoggedIn, isRefreshing } = useAuth();
  return isLoggedIn || isRefreshing ? <Outlet /> : <Navigate to="/login" />;
};

const PublicOnlyRoute = () => {
  const { isLoggedIn, isRefreshing } = useAuth();
  return isLoggedIn || isRefreshing ? <Navigate to="/" /> : <Outlet />;
};

const { getState, dispatch } = store;

// Create the router
const router = createBrowserRouter([
  {
    // Public-only routes (login/register)
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
    // Protected routes with CommonLayout
    element: <ProtectedRoute />,
    loader: async () => {
      await waitForRehydration(persistor);

      const token = getState().auth.token;
      if (token) {
        await dispatch(refreshUser());
      }

      await Promise.all([
        dispatch(loadCrop()),
        dispatch(loadOperator()),
        dispatch(loadLocation()),
        dispatch(loadMachineType()),
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
              if (!userHasFeature(menuLinks.weighing.feature, getState())) return redirect('/');
            },
          },
          {
            path: 'reporting',
            element: <div>Reporting page</div>,
            loader: async () => {
              if (!userHasFeature(menuLinks.reporting.feature, getState())) return redirect('/');
            },
          },
          {
            path: 'settings',
            element: <SettingsPage />,
            loader: async () => {
              if (!userHasFeature(menuLinks.settings.feature, getState())) return redirect('/');
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
    // Catch-all route - redirect to root
    path: '*',
    element: <Navigate to="/" />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
