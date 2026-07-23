import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeModeProvider } from './contexts/ThemeModeContext';
import ProtectedRoute from './components/ProtectedRoute';

import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import BookingDetail from './pages/BookingDetail';
import Calendar from './pages/Calendar';
import Hotels from './pages/Hotels';
import HotelDetail from './pages/HotelDetail';
import Chalets from './pages/Chalets';
import ChaletDetail from './pages/ChaletDetail';
import Amenities from './pages/Amenities';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Reviews from './pages/Reviews';
import Reports from './pages/Reports';
import Admins from './pages/Admins';
import Roles from './pages/Roles';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeModeProvider>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/bookings/:id" element={<BookingDetail />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/hotels" element={<Hotels />} />
                  <Route path="/hotels/:id" element={<HotelDetail />} />
                  <Route path="/chalets" element={<Chalets />} />
                  <Route path="/chalets/:id" element={<ChaletDetail />} />
                  <Route path="/amenities" element={<Amenities />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/customers/:id" element={<CustomerDetail />} />
                  <Route path="/reviews" element={<Reviews />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute requireSuperAdmin />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admins" element={<Admins />} />
                  <Route path="/roles" element={<Roles />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeModeProvider>
  );
}
