import mongoose from 'mongoose';

const VehicleSchema = new mongoose.Schema({
  type: String,
  plate: { type: String, required: true, unique: true },
  model: String,
  insurance: String,
  condition: String,
  available: { type: Boolean, default: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }
}, { timestamps: true });

export default mongoose.model('Vehicle', VehicleSchema);
