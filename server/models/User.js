import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will be hashed
  role: { 
    type: String, 
    enum: ['SuperAdmin', 'CompanyAdmin', 'Driver', 'Customer'], 
    required: true 
  },
  isActive: { type: Boolean, default: true },
  
  // Driver specific fields
  licenseNumber: { type: String },
  licenseExpiry: { type: Date },
  address: { type: String },
  status: { type: String, enum: ['Available', 'On Trip', 'Offline'], default: 'Available' }
}, { timestamps: true });

export const createUserModel = (connection = mongoose) => connection.model('User', userSchema);

export { userSchema };
