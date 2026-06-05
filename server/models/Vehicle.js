import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  vehicleType: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  seatingCapacity: { type: Number, required: true },
  insuranceExpiry: { type: Date, required: true },
  permitExpiry: { type: Date, required: true },
  status: { type: String, enum: ['Available', 'In Trip', 'Maintenance'], default: 'Available' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const createVehicleModel = (connection) => connection.model('Vehicle', vehicleSchema);
export { vehicleSchema };
