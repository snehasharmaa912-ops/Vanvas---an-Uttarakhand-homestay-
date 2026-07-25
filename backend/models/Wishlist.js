import mongoose from 'mongoose'
const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  stay: { type: mongoose.Schema.Types.ObjectId, ref: 'Stay', required: true },
}, { timestamps: true })
wishlistSchema.index({ user: 1, stay: 1 }, { unique: true })
export default mongoose.model('Wishlist', wishlistSchema)
