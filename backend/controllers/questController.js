const Quest = require('../models/Quest')


const getQuests = async (req, res, next) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let quests = await Quest.find({ 
      user: req.user.id, 
      date: { $gte: today } 
    })

  
    if (quests.length === 0) {
      const defaultQuests = [
        { title: 'Code Warrior', description: 'Make at least 3 commits today', points: 15 },
        { title: 'Brain Power', description: 'Solve 1 LeetCode problem', points: 20 },
        { title: 'Journalist', description: 'Write a journal entry about what you learned', points: 10 }
      ]
      
      quests = await Quest.insertMany(
        defaultQuests.map(q => ({ ...q, user: req.user.id, date: today }))
      )
    }

    res.json(quests)
  } catch (error) {
    next(error)
  }
}


const updateQuest = async (req, res, next) => {
  try {
    const quest = await Quest.findOne({ _id: req.params.id, user: req.user.id })
    if (!quest) {
      res.status(404)
      throw new Error('Quest not found')
    }

    quest.completed = !quest.completed
    const updatedQuest = await quest.save()
    res.json(updatedQuest)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getQuests,
  updateQuest,
}
