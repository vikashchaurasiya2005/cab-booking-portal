import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vendor from './models/Vendor.js';
import User from './models/User.js';
import Booking from './models/Booking.js';
import Driver from './models/Driver.js';
import Vehicle from './models/Vehicle.js';
import Invoice from './models/Invoice.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/booking_portal';

async function seed() {
  await mongoose.connect(MONGO_URI);
  await Booking.deleteMany({});
  await Vendor.deleteMany({});
  await User.deleteMany({});
  await Driver.deleteMany({});
  await Vehicle.deleteMany({});
  await Invoice.deleteMany({});

  // Create vendor and user
  const hashed = await bcrypt.hash('vendorpass', 10);
  const vendor = await Vendor.create({
    name: 'Acme Cabs',
    email: 'vendor@acme.com',
    password: hashed,
    phone: '9999999999',
    address: 'Acme Street',
    whitelisted: true,
    bankInfo: { accountNumber: '12345678', ifsc: 'ACME0001', bankName: 'Acme Bank', branch: 'Main' }
  });
  const user = await User.create({
    name: 'Vendor Admin',
    email: 'vendor@acme.com',
    password: hashed,
    role: 'vendor',
    vendor: vendor._id
  });

  // Create drivers
  const drivers = await Driver.insertMany([
    { name: 'John Doe', licenseNumber: 'DL1234', aadhar: '111122223333', pan: 'ABCDE1234F', phone: '9000000001', vendor: vendor._id },
    { name: 'Jane Smith', licenseNumber: 'DL5678', aadhar: '444455556666', pan: 'FGHIJ5678K', phone: '9000000002', vendor: vendor._id }
  ]);

  // Create vehicles
  const vehicles = await Vehicle.insertMany([
    { type: 'Sedan', plate: 'ABC123', model: 'Toyota Camry', insurance: 'Valid', condition: 'Good', available: true, vendor: vendor._id },
    { type: 'SUV', plate: 'XYZ789', model: 'Mahindra XUV', insurance: 'Valid', condition: 'Excellent', available: true, vendor: vendor._id }
  ]);

  // Create bookings
  const bookings = await Booking.insertMany([
    {
      bookingId: 'BK001',
      company: 'Acme Corp',
      guest: { name: 'Alice', phone: '8888888881', email: 'alice@acme.com' },
      vehicle: vehicles[0]._id,
      driver: drivers[0]._id,
      vendor: vendor._id,
      status: 'Ongoing',
      pickupTime: new Date(Date.now() + 3600 * 1000),
      dropTime: new Date(Date.now() + 7200 * 1000),
      pickupLocation: 'Acme HQ',
      dropLocation: 'Airport',
      expenses: 1200
    },
    {
      bookingId: 'BK002',
      company: 'Beta Ltd',
      guest: { name: 'Bob', phone: '8888888882', email: 'bob@beta.com' },
      vehicle: vehicles[1]._id,
      driver: drivers[1]._id,
      vendor: vendor._id,
      status: 'Completed',
      pickupTime: new Date(Date.now() - 7200 * 1000),
      dropTime: new Date(Date.now() - 3600 * 1000),
      pickupLocation: 'Station',
      dropLocation: 'Beta Office',
      expenses: 1500
    }
  ]);

  // Create invoices
  await Invoice.insertMany([
    {
      booking: bookings[0]._id,
      vendor: vendor._id,
      amount: 1200,
      status: 'Pending',
      submittedAt: new Date(),
      reportMonth: '2025-08'
    },
    {
      booking: bookings[1]._id,
      vendor: vendor._id,
      amount: 1500,
      status: 'Paid',
      submittedAt: new Date(Date.now() - 86400 * 1000),
      paidAt: new Date(Date.now() - 43200 * 1000),
      reportMonth: '2025-07'
    }
  ]);

  console.log('Seed data inserted.');
  process.exit(0);
}

seed();
