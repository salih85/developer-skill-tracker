const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: String,
      required: true,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Beginner',
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
)

const Skill = mongoose.model('Skill', skillSchema)
module.exports = Skill
