const mongoose = require('mongoose')

const statSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    githubCommits: {
      type: Number,
      default: 0,
    },
    leetcodeSolved: {
      type: Number,
      default: 0,
    },
    weeklyProgress: [
      {
        date: String,
        count: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Stats = mongoose.model('Stats', statSchema)
module.exports = Stats
