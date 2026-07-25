import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AccountLayout from './layouts/AccountLayout';

import Home from './pages/Home';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import Chalets from './pages/Chalets';
import ChaletDetail from './pages/ChaletDetail';
import BookingWizard from './pages/BookingWizard';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import AccountDashboard from './pages/AccountDashboard';
import AccountBookings from './pages/AccountBookings';
import AccountFavorites from './pages/AccountFavorites';
import AccountProfile from './pages/AccountProfile';
import AccountPassword from './pages/AccountPassword';

import Contact from './pages/Contact';
import About from './pages/About';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import { Privacy, Terms, Cookies } from './pages/Legal';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/hotels/:id" element={<HotelDetail />} />
              <Route path="/chalets" element={<Chalets />} />
              <Route path="/chalets/:id" element={<ChaletDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/book/:type/:id" element={<BookingWizard />} />
                <Route element={<AccountLayout />}>
                  <Route path="/account" element={<AccountDashboard />} />
                  <Route path="/account/bookings" element={<AccountBookings />} />
                  <Route path="/account/favorites" element={<AccountFavorites />} />
                  <Route path="/account/profile" element={<AccountProfile />} />
                  <Route path="/account/password" element={<AccountPassword />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>
  );
}
