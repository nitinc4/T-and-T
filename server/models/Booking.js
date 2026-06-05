import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true }, // Short friendly ID
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  tripDate: { type: Date, required: true },
  vehicleType: { type: String, required: true }, // Requested type
  amount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  bookingStatus: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  
  // Resources assigned later
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Driver is a User with role='Driver'
}, { timestamps: true });

export const createBookingModel = (connection) => connection.model('Booking', bookingSchema);
export { bookingSchema };
