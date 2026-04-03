const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    techStack: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'On Hold'],
      default: 'In Progress',
    },
    link: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

const Project = mongoose.model('Project', projectSchema)
module.exports = Project
