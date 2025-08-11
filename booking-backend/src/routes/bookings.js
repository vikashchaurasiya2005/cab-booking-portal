import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import {
  createBooking,
  getBookings,
  getBooking,
  updateBooking,
  deleteBooking
} from '../controllers/bookingController.js';

const router = express.Router();

// Create booking (manual or platform)
router.post('/', authenticateToken, authorizeRoles('vendor', 'admin'), createBooking);

// Get all bookings (filter by status/vendor)
router.get('/', authenticateToken, authorizeRoles('vendor', 'admin'), getBookings);

// Get single booking
router.get('/:id', authenticateToken, authorizeRoles('vendor', 'admin'), getBooking);

// Update booking (accept/reject/push to open market)
router.put('/:id', authenticateToken, authorizeRoles('vendor', 'admin'), updateBooking);

// Delete booking
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteBooking);

export default router;
