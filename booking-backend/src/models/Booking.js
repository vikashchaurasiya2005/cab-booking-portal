import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  company: String,
  guest: {
    name: String,
    phone: String,
    email: String
  },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  status: { type: String, enum: ['Ongoing', 'Completed', 'Cancelled', 'OpenMarket'], default: 'Ongoing' },
  pickupTime: Date,
  dropTime: Date,
  pickupLocation: String,
  dropLocation: String,
  expenses: Number,
  invoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },
  openMarket: {
    pushed: { type: Boolean, default: false },
    pushedAt: Date,
    whitelistedOnlyUntil: Date
  }
}, { timestamps: true });

export default mongoose.model('Booking', BookingSchema);
