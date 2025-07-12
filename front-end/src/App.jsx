import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import MyList from './pages/MyList';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import AdminDashboard from './pages/AdminDashboard';
function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </>
  );
}
export default App;
