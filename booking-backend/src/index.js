import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { setSocketIO } from './utils/socket.js';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });
setSocketIO(io);

// Middleware
app.use(cors());
app.use(express.json());

// --- Routes ---
import authRoutes from './routes/auth.js';
import bookingsRoutes from './routes/bookings.js';
import driversRoutes from './routes/drivers.js';
import vehiclesRoutes from './routes/vehicles.js';
import invoicesRoutes from './routes/invoices.js';
import openMarketRoutes from './routes/openMarket.js';
import customViewsRoutes from './routes/customViews.js';
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/open-market', openMarketRoutes);
app.use('/api/custom-views', customViewsRoutes);

app.get('/', (req, res) => {
  res.send('Vendor Dashboard Backend Running');
});

// --- MongoDB Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/booking_portal';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Socket.IO Setup ---
io.on('connection', (socket) => {
  // Optional: Authenticate socket using JWT from query or headers
  const { token } = socket.handshake.auth || {};
  let vendorId = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      vendorId = decoded.vendorId;
      if (vendorId) {
        socket.join(`vendor_${vendorId}`); // Private room for vendor
        socket.join('vendors'); // All vendors
      }
    } catch (err) {
      // Invalid token: do not join rooms
    }
  }
  console.log('Vendor connected:', socket.id, vendorId ? `VendorID: ${vendorId}` : '');
  // Placeholder for socket events (e.g., booking updates)
  socket.on('disconnect', () => {
    console.log('Vendor disconnected:', socket.id);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
