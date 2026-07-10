import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  stay: { type: mongoose.Schema.Types.ObjectId, ref: 'Stay', required: true },
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1, default: 1 },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'declined', 'cancelled'],
    default: 'pending',
  },
  message: { type: String, trim: true, maxlength: 500, default: '' },
}, { timestamps: true })

export default mongoose.model('Booking', bookingSchema)
