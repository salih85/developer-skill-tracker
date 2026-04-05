const Project = require('../models/Project')


const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(projects)
  } catch (error) {
    next(error)
  }
}


const createProject = async (req, res, next) => {
  try {
    const { title, description, techStack, status, link, githubUrl, imageUrl } = req.body
    if (!title || !description) {
      res.status(400)
      throw new Error('Title and description are required')
    }

    const project = await Project.create({
      user: req.user.id,
      title,
      description,
      techStack: techStack || [],
      status: status || 'In Progress',
      link,
      githubUrl,
      imageUrl,
    })

    res.status(201).json(project)
  } catch (error) {
    next(error)
  }
}


const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id })
    if (!project) {
      res.status(404)
      throw new Error('Project not found')
    }

    const { title, description, techStack, status, link, githubUrl, imageUrl } = req.body
    project.title = title ?? project.title
    project.description = description ?? project.description
    project.techStack = techStack ?? project.techStack
    project.status = status ?? project.status
    project.link = link ?? project.link
    project.githubUrl = githubUrl ?? project.githubUrl
    project.imageUrl = imageUrl ?? project.imageUrl

    const updatedProject = await project.save()
    res.json(updatedProject)
  } catch (error) {
    next(error)
  }
}


const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user.id })
    if (!project) {
      res.status(404)
      throw new Error('Project not found')
    }

    await project.deleteOne()
    res.json({ message: 'Project removed' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
}
