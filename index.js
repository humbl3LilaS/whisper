import { app } from './server.js'
import mongoose from 'mongoose'
import 'dotenv/config'

const PORT = process.env.PORT

try {
  await mongoose.connect(process.env.DB_URI)
  console.log('Connected to MongoDB')
  app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`)
  })
} catch (e) {
  console.error(e)
}
// ;wwak:-3ESrfGF,