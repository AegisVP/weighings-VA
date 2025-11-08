import { createBrowserRouter, RouterProvider, Navigate, redirect } from 'react-router-dom';
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
import { loadOperator } from '../redux/resources/resourcesOperations/operatorOperations';
import { refreshUser } from '../redux/user/userOperations';
import { userHasFeature } from '../redux/user/userSlice';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { ProtectedRoute } from './ProtectedRoute';
import { menuLinks } from './sections';

const { getState, dispatch } = store;

const waitForLoginRefresh = async () => {
  console.log('waiting for rehydration');
  await waitForRehydration(persistor);

  console.log('setting token and refreshing user');
  const token = getState().auth.token;
  if (token) {
    await dispatch(refreshUser());
  }
};

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
      console.log('Router loader called');
      await waitForLoginRefresh();

      console.log('getting resources data');
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
              console.log('weighing loader called');
              await waitForLoginRefresh();

              if (!userHasFeature(menuLinks.weighing.feature, getState())) return redirect('/');
            },
          },
          {
            path: 'reporting',
            element: <div>Reporting page</div>,
            loader: async () => {
              console.log('reporting loader called');
              await waitForLoginRefresh();

              if (!userHasFeature(menuLinks.reporting.feature, getState())) return redirect('/');
            },
          },
          {
            path: 'settings',
            element: <SettingsPage />,
            loader: async () => {
              console.log('settings loader called');
              await waitForLoginRefresh();

              console.log('Checking access to settings page');
              if (!userHasFeature(menuLinks.settings.feature, getState())) {
                console.log('access failed, redirecting');
                return redirect('/');
              }
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
