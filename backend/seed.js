import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Stay from './models/Stay.js'
import staysData from './data/stays.js'

dotenv.config()

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to MongoDB')
    await Stay.deleteMany({})
    console.log('Cleared existing stays')
    const staysWithoutId = staysData.map(({ id, ...rest }) => rest)
    await Stay.insertMany(staysWithoutId)
    console.log(`Inserted ${staysWithoutId.length} stays`)
    await mongoose.disconnect()
    console.log('Done seeding, disconnected')
  } catch (err) {
    console.error('Seed error:', err)
    process.exit(1)
  }
}

seed()
