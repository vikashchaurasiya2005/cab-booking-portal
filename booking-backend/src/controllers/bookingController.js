import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import { emitToVendor, emitToAllVendors } from '../utils/socket.js';

export const createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    // Emit to vendor and all vendors (for open market)
    emitToVendor(booking.vendor, 'booking:new', booking);
    if (booking.status === 'OpenMarket') emitToAllVendors('booking:openMarket', booking);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { status, vendorId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (vendorId) filter.vendor = vendorId;
    const bookings = await Booking.find(filter)
      .populate('vehicle driver vendor invoice');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle driver vendor invoice');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Emit update event
    emitToVendor(booking.vendor, 'booking:update', booking);
    if (booking.status === 'OpenMarket') emitToAllVendors('booking:openMarket', booking);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    // Emit delete event
    emitToVendor(booking.vendor, 'booking:delete', { id: req.params.id });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
