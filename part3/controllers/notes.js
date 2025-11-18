const notesRouter = require('express').Router()
const Note = require('../models/note')
const logger = require('../utils/logger')

notesRouter.get('/', (req, res, next) => {
  Note
    .find({})
    .then(notes => {
      res.json(notes)
    })
    .catch(error => next(error))
})

notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id
  if(!id) {
    logger.warn('\'GET\' api/notes/:id - ID missing in request')
    return res.status(400).json({ error: 'ID missing' })
  }

  Note
    .findById(id)
    .then(note => {
      if (note){
        res.json(note)
        logger.info(`'GET' api/notes/:id - Note with ID ${ id } found`)
      }else {
        res.status(404).end('invalid id')
        logger.warn(`'GET' api/notes/:id - note with ID ${ id } not found`)
      }
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  if (!id){
    logger.warn('\'DELETE\' api/notes/:id - ID is missing')
    return res.status(400).json({ error: 'ID missing' })
  }
  Note.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
      logger.info(`'DELETE' api/notes/:id - note with ID ${ id } deleted`)
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (req, res, next) => {
  const id = req.params.id
  const { content, important } = req.body

  Note.findById(id)
    .then( note => {
      if (!note) {
        logger.warn(`'PUT' /api/notes/:id - Note with ID ${ id } not found`)
        return res.status(404).json({ error: 'Note not found' })
      }
      note.content =  content
      note.important = important ?? note.important
      return note.save().then(updatedNote => {
        logger.info(`'PUT' /api/notes/:id - Note with ID ${ id } updated successfully`)
        res.status(200).json(updatedNote)
      })
    })
    .catch(error => next(error))
})

notesRouter.post('/', (req, res, next) => {
  const { content, important } = req.body

  const note = new Note ({
    content: content,
    important: important ?? false,
  })

  note
    .save()
    .then(savedNote => {
      logger.info(`New note ${ savedNote.content } is successfully created and saved in database`)
      res.status(201).json(savedNote)
    })
    .catch (error => next(error))
})

module.exports = notesRouter