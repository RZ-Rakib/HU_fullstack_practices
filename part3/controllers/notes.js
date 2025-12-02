const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')
const logger = require('../utils/logger')
const mongoose = require('mongoose')

notesRouter.get('/', async (req, res, next) => {
  try {
    const notes = await Note
      .find({})
      .populate('user', { username: 1, name: 1 })
    return res.json(notes)

  } catch (error) {
    next(error)
  }
})

notesRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id

    if(!mongoose.Types.ObjectId.isValid(id)) {
      logger.warn('\'GET\' api/notes/:id - malformatted')
      return res.status(400).json({ error: 'malformatted id' })
    }

    const note = await Note.findById(id)

    if (note){
      logger.info(`'GET' api/notes/:id - Note with ID ${ id } found`)
      return res.json(note)
    }
    logger.warn(`'GET' api/notes/:id - note with ID ${ id } not found`)
    return res.status(404).json({ error: 'invalid id' })

  } catch (error) {
    next(error)
  }
})

notesRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id

    if (!mongoose.Types.ObjectId.isValid(id)){
      logger.warn('\'DELETE\' api/notes/:id - malformatted id')
      return res.status(400).json({ error: 'malformatted id' })
    }

    const deletedNote = await Note.findByIdAndDelete(id)

    if (!deletedNote) {
      logger.warn(`DELETE /api/notes/:id - note with ID ${id} not found`)
      return res.status(404).json({ error: 'invalid id' })
    }

    logger.info(`'DELETE' api/notes/:id - note with ID ${ id } deleted`)
    res.status(204).end()

  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const { content, important } = req.body

    const note = await Note.findById(id)

    if (!note) {
      logger.warn(`'PUT' /api/notes/:id - Note with ID ${ id } not found`)
      return res.status(404).json({ error: 'Note not found' })
    }

    note.content =  content
    note.important = important ?? note.important

    const updatedNote = await note.save()

    logger.info(`'PUT' /api/notes/:id - Note with ID ${ id } updated successfully`)
    return res.status(200).json(updatedNote)

  } catch (error) {
    next(error)
  }
})

notesRouter.post('/', async (req, res, next) => {
  try {
    const { content, important, userId } = req.body

    const user = await User.findById(userId)

    if (!user) {
      logger.warn('user id is missing')
      res.status(400).json({ error: 'user id missing or invalid' })
    }

    const note = new Note ({
      content: content,
      important: important ?? false,
      user: user.id
    })

    const savedNote = await note.save()

    user.notes = user.notes.concat(savedNote.id)
    await user.save()

    logger.info(`New note ${ savedNote.content } is successfully created and saved in database`)
    return res.status(201).json(savedNote)

  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter