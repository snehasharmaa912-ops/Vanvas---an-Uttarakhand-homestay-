import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['traveler', 'host'], default: 'traveler' },
  role: { type: String, enum: ['admin', 'viewer'], default: 'viewer' },
}, { timestamps: true })

export default mongoose.model('User', userSchema)
