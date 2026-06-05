import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  gstNumber: { type: String },
  address: { type: String },
  planType: { type: String, enum: ['Starter', 'Professional', 'Enterprise'], default: 'Starter' },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true },
  appConfig: { type: Object, default: {} },
  razorpayKeyId: { type: String },
  razorpayKeySecret: { type: String }
}, { timestamps: true });

export default mongoose.model('Company', companySchema);
