import mongoose from 'mongoose'

const staySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  tags: { type: [String], default: [] },
  host: { type: String, required: true },
  eco: { type: Boolean, default: false },
  image: { type: String, default: '' },
}, { timestamps: true })

export default mongoose.model('Stay', staySchema)
