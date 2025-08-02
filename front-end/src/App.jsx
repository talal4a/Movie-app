import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PrivateRoute from './components/Routes/PrivateRoute';
import GuestRoute from './components/Routes/GuestRoute';
import MainLayout from './MainLayout';
import { fetchWatchlist } from './redux/slice/watchListSlice';
import Modal from './components/Modals/Modal';
import { AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import {
  prefetchGroupedMovies,
  prefetchHeroMovie,
} from './utils/prefecthUtils';
import Spinner from './components/ui/Spinner';
const Home = lazy(() => import('./pages/Home'));
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const WatchListPage = lazy(() => import('./pages/WatchList'));
const Account = lazy(() => import('./pages/Account'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const MoviePage = lazy(() => import('./pages/MoviePage'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NotFound = lazy(() => import('./components/ui/NotFound'));
export default function App() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user?.user);
  const location = useLocation();

  // In App.jsx
  useEffect(() => {
    // This will show on real page loads only
    console.log('Performance navigation type:', performance.navigation.type);
    console.log('0 = normal navigation, 1 = reload, 2 = back/forward');

    // Add visual indicator
    if (performance.navigation.type === 1) {
      console.log('🚨 ACTUAL PAGE RELOAD DETECTED!');
    } else {
      console.log('✅ Client-side navigation (no reload)');
    }
  }, []);
  useEffect(() => {
    if (user) {
      dispatch(fetchWatchlist());
      prefetchGroupedMovies(queryClient);
      prefetchHeroMovie(queryClient);
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          import('./pages/MoviePage');
          import('./pages/MovieDetail');
          import('./pages/WatchList');
        });
      }
    }
  }, [user, dispatch, queryClient]);
  useEffect(() => {
    const prefetchBasedOnRoute = () => {
      switch (location.pathname) {
        case '/':
          prefetchHeroMovie(queryClient);
          break;
        case '/movies':
          prefetchGroupedMovies(queryClient);
          break;
        default:
          break;
      }
    };
    prefetchBasedOnRoute();
  }, [location.pathname, queryClient]);
  return (
    <Modal>
      <main className="min-h-screen bg-black text-white">
        <Suspense fallback={<Spinner />}>
          <Routes location={location} key={location.pathname}>
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
              <Route
                path="/movies"
                element={
                  <PrivateRoute>
                    <MoviePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <PrivateRoute>
                    <SearchPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="*"
                element={
                  <PrivateRoute>
                    <NotFound />
                  </PrivateRoute>
                }
              />
            </Route>
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
          </Routes>
        </Suspense>
      </main>
    </Modal>
  );
}
