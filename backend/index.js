const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const statsRoutes = require('./routes/statsRoutes')
const skillRoutes = require('./routes/skillRoutes')
const journalRoutes = require('./routes/journalRoutes')
const projectRoutes = require('./routes/projectRoutes')
const questRoutes = require('./routes/questRoutes')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config()
connectDB()

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Developer Skill Tracker API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/journals', journalRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/quests', questRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
