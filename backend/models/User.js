import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true, default: 'Admin' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  googleId: { type: String, default: null, index: true },
  userType: { type: String, enum: ['traveler', 'host', 'admin'], default: 'traveler' },
  role: { type: String, enum: ['admin', 'viewer'], default: 'viewer' },
  otpCodeHash: { type: String, default: null },
  otpExpires: { type: Date, default: null },
}, { timestamps: true })

export default mongoose.model('User', userSchema)
