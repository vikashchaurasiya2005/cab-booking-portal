import { useEffect, useState, useMemo } from 'react';
import { api } from './api';
import { useAuth } from './AuthContext';
import {
  Paper, Table, TableHead, TableBody, TableRow, TableCell,
  Button, ButtonGroup, Typography, Alert, CircularProgress, Box
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_OPTIONS = ['All', 'Ongoing', 'Completed', 'Cancelled', 'OpenMarket'];

export default function Bookings() {
  const { socket } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [showNotif, setShowNotif] = useState(false);

  // Fetch bookings
  useEffect(() => {
    setLoading(true);
    api.get('/bookings', { params: status !== 'All' ? { status } : {} })
      .then(res => setBookings(res.data))
      .finally(() => setLoading(false));
  }, [status]);

  // Live updates
  useEffect(() => {
    if (!socket) return;
    const handleNew = (booking) => {
      setBookings(prev => [booking, ...prev.filter(b => b._id !== booking._id)]);
      setNotification('New booking received!');
      setShowNotif(true);
    };
    const handleUpdate = (booking) => {
      setBookings(prev => prev.map(b => b._id === booking._id ? booking : b));
      setNotification('Booking updated');
      setShowNotif(true);
    };
    const handleDelete = ({ id }) => {
      setBookings(prev => prev.filter(b => b._id !== id));
      setNotification('Booking deleted');
      setShowNotif(true);
    };
    socket.on('booking:new', handleNew);
    socket.on('booking:update', handleUpdate);
    socket.on('booking:delete', handleDelete);
    return () => {
      socket.off('booking:new', handleNew);
      socket.off('booking:update', handleUpdate);
      socket.off('booking:delete', handleDelete);
    };
  }, [socket]);

  // Dismiss notification
  useEffect(() => {
    if (!showNotif) return;
    const t = setTimeout(() => setShowNotif(false), 2500);
    return () => clearTimeout(t);
  }, [showNotif]);

  const filtered = useMemo(() => {
    if (status === 'All') return bookings;
    return bookings.filter(b => b.status === status);
  }, [bookings, status]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Typography variant="h4" fontWeight={700} color="primary.main" mb={3}>
        Bookings
      </Typography>
      <Box mb={2} display="flex" alignItems="center" gap={2}>
        <ButtonGroup variant="contained" color="primary">
          {STATUS_OPTIONS.map(opt => (
            <Button
              key={opt}
              onClick={() => setStatus(opt)}
              sx={{ fontWeight: status === opt ? 700 : 400, bgcolor: status === opt ? 'primary.dark' : 'primary.main' }}
            >
              {opt}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
      <AnimatePresence>
        {showNotif && notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ marginBottom: 16 }}
          >
            <Alert severity="info" variant="filled">{notification}</Alert>
          </motion.div>
        )}
      </AnimatePresence>
      <Paper elevation={4} sx={{ p: 2, borderRadius: 3, bgcolor: 'background.paper' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.light' }}>
                <TableCell>ID</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Guest</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Pickup</TableCell>
                <TableCell>Drop</TableCell>
                <TableCell>Expenses</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(b => (
                <TableRow
                  key={b._id}
                  sx={{
                    '&:hover': { bgcolor: 'primary.50' },
                    transition: 'background 0.2s',
                  }}
                >
                  <TableCell>{b.bookingId}</TableCell>
                  <TableCell>{b.company}</TableCell>
                  <TableCell>{b.guest?.name}</TableCell>
                  <TableCell>{b.vehicle?.model || '-'}</TableCell>
                  <TableCell>{b.driver?.name || '-'}</TableCell>
                  <TableCell>{b.status}</TableCell>
                  <TableCell>
                    {b.pickupLocation} <br />
                    {b.pickupTime && new Date(b.pickupTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {b.dropLocation} <br />
                    {b.dropTime && new Date(b.dropTime).toLocaleString()}
                  </TableCell>
                  <TableCell>{b.expenses}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </motion.div>
  );
}
