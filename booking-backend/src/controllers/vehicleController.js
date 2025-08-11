import Vehicle from '../models/Vehicle.js';
import { emitToVendor } from '../utils/socket.js';

export const createVehicle = async (req, res) => {
  try {
    const vehicle = new Vehicle({ ...req.body, vendor: req.user.vendorId });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ vendor: req.user.vendorId });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, vendor: req.user.vendorId });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate({ _id: req.params.id, vendor: req.user.vendorId }, req.body, { new: true });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    emitToVendor(vehicle.vendor, 'vehicle:update', vehicle);
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, vendor: req.user.vendorId });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
