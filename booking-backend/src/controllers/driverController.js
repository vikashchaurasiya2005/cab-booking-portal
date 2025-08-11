import Driver from '../models/Driver.js';
import { emitToVendor } from '../utils/socket.js';

export const createDriver = async (req, res) => {
  try {
    const driver = new Driver({ ...req.body, vendor: req.user.vendorId });
    await driver.save();
    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({ vendor: req.user.vendorId });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDriver = async (req, res) => {
  try {
    const driver = await Driver.findOne({ _id: req.params.id, vendor: req.user.vendorId });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndUpdate({ _id: req.params.id, vendor: req.user.vendorId }, req.body, { new: true });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    emitToVendor(driver.vendor, 'driver:update', driver);
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findOneAndDelete({ _id: req.params.id, vendor: req.user.vendorId });
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Driver deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
