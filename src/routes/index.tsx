import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Home from '../pages/home';
import LoginPage from '../pages/login';
import DashboardSelector from '../pages/dashboard-selector';
import PayrollViewer from '../pages/payroll/payroll-viewer';
import ProtectedRoute from '../components/layout/protected-route';
import { AuthProvider } from '../hooks/use-auth';

const AppLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/dashboards',
        element: (
          <ProtectedRoute>
            <DashboardSelector />
          </ProtectedRoute>
        ),
      },
      {
        path: '/dashboard/:dashboardId',
        element: (
          <ProtectedRoute>
            <PayrollViewer />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
