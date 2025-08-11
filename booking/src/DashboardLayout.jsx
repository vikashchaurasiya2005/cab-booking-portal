import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import './DashboardLayout.css';
import { useAuth } from './AuthContext';
import { Button } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -30, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2>Vendor Dashboard</h2>
        <nav>
          <ul>
            <li><Link to="/bookings">Bookings</Link></li>
            <li><Link to="/drivers">Drivers</Link></li>
            <li><Link to="/vehicles">Vehicles</Link></li>
            <li><Link to="/invoices">Invoices</Link></li>
            <li><Link to="/open-market">Open Market</Link></li>
            <li><Link to="/custom-views">Custom Views</Link></li>
          </ul>
        </nav>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          sx={{ mt: 4, borderRadius: 2 }}
          fullWidth
        >
          Logout
        </Button>
      </aside>
      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ height: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
