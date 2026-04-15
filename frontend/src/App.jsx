import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './layouts/AppLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireAdmin>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default App;
