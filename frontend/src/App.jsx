import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import PageLoader from './components/PageLoader.jsx';

const CitizenLayout = lazy(() => import('./layouts/CitizenLayout.jsx'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout.jsx'));

const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'));
const AdminMessagesPage = lazy(() => import('./pages/AdminMessagesPage.jsx'));
const AdminFeedbackPage = lazy(() => import('./pages/AdminFeedbackPage.jsx'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage.jsx'));
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));

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
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route
        element={
          <Suspense fallback={<PageLoader text="Loading layout..." />}>
            <CitizenLayout />
          </Suspense>
        }
      >
        <Route path="/" element={<CitizenOnlyRoute><HomePage /></CitizenOnlyRoute>} />
        <Route path="/about" element={<ProtectedRoute><CitizenOnlyRoute><AboutPage /></CitizenOnlyRoute></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute><CitizenOnlyRoute><ContactPage /></CitizenOnlyRoute></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><CitizenOnlyRoute><FeedbackPage /></CitizenOnlyRoute></ProtectedRoute>} />
        <Route path="/login" element={<CitizenOnlyRoute><LoginPage /></CitizenOnlyRoute>} />
        <Route path="/register" element={<CitizenOnlyRoute><RegisterPage /></CitizenOnlyRoute>} />
      </Route>

      <Route
        path="/admin"
        element={
          <Suspense fallback={<PageLoader text="Loading admin..." />}>
            <AdminLayout />
          </Suspense>
        }
      >
        <Route
          path="dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="messages"
          element={
            <ProtectedRoute requireAdmin>
              <AdminMessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="feedback"
          element={
            <ProtectedRoute requireAdmin>
              <AdminFeedbackPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

export default App;
