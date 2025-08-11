import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import LoginPage from './LoginPage';
import { AuthProvider, useAuth } from './AuthContext';
import './App.css';

// Placeholder pages for each section
import Bookings from './Bookings';
import Drivers from './Drivers';
import Vehicles from './Vehicles';
import Invoices from './Invoices';
import OpenMarket from './OpenMarket';
import CustomViews from './CustomViews';

function RequireAuth({ children }) {
  const { token } = useAuth();
  const location = useLocation();
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            <Route index element={<Navigate to="/bookings" replace />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="open-market" element={<OpenMarket />} />
            <Route path="custom-views" element={<CustomViews />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
