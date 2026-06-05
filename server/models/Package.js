import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: String, required: true }, // Using String to allow formatting e.g. '₹25,000'
  imageUrl: { type: String, required: true },
  duration: { type: String }, // e.g. '5 Days / 4 Nights'
  destination: { type: String },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }
}, { timestamps: true });

// We export a function instead of a model because this model is tenant-specific
export const createPackageModel = (connection) => {
  return connection.models.Package || connection.model('Package', packageSchema);
};
