import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout.jsx';
import CitizenLayout from './layouts/CitizenLayout.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import FeedbackPage from './pages/FeedbackPage.jsx';
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

const CitizenOnlyRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (user && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};

const App = () => (
  <Routes>
    {/* Citizen Routes */}
    <Route element={<CitizenLayout />}>
      <Route path="/" element={<CitizenOnlyRoute><HomePage /></CitizenOnlyRoute>} />
      <Route path="/about" element={<ProtectedRoute><CitizenOnlyRoute><AboutPage /></CitizenOnlyRoute></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><CitizenOnlyRoute><ContactPage /></CitizenOnlyRoute></ProtectedRoute>} />
      <Route path="/feedback" element={<ProtectedRoute><CitizenOnlyRoute><FeedbackPage /></CitizenOnlyRoute></ProtectedRoute>} />
      <Route path="/login" element={<CitizenOnlyRoute><LoginPage /></CitizenOnlyRoute>} />
      <Route path="/register" element={<CitizenOnlyRoute><RegisterPage /></CitizenOnlyRoute>} />
    </Route>

    {/* Admin Routes */}
    <Route path="/admin" element={<AdminLayout />}>
      <Route
        path="dashboard"
        element={
          <ProtectedRoute requireAdmin>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Route>

    {/* Catch all */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
