import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';
import GuestRoute from './components/GuestRoute';
import MainLayout from './MainLayout';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import WatchListPage from './pages/WatchList';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
import SearchPage from './pages/SearchPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotFound from './components/NotFound';
import { fetchWatchlist } from './slice/watchListSlice';
function App() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);

  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
  }, [pathname]);

  useEffect(() => {
    if (user) {
      dispatch(fetchWatchlist());
    }
  }, [user]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Routes>
        {/* Routes with Navbar */}
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <PrivateRoute>
                <MovieDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-list"
            element={
              <PrivateRoute>
                <WatchListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/account"
            element={
              <PrivateRoute>
                <Account />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Routes WITHOUT Navbar */}
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/auth/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
