import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true, unique: true },
  email: { type: String },
  address: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const createCustomerModel = (connection) => {
  // Check if the model is already registered on this connection
  return connection.models.Customer || connection.model('Customer', customerSchema);
};

export { customerSchema };
