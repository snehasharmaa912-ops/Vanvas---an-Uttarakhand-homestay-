import mongoose from 'mongoose'

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  budget: { type: Number },
  travelers: { type: Number },
  picks: [{
    stayId: String,
    title: String,
    location: String,
    price: Number,
    image: String,
    reason: String,
  }],
  itineraryText: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model('Trip', tripSchema)
