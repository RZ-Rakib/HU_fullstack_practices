const express = require('express')
const Note = require('./models/note')
const winston = require('./loggers/winston')
const morgan = require('morgan')
const app = express()
require('dotenv').config()

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms '))

app.get('/api/notes', (req, res, next) => {
    Note
      .find({})
      .then(notes => {
        res.json(notes)
      })
      .catch(error => next(error))
})

app.get('/api/notes/:id', (req, res, next) => {
    const id = req.params.id
    if(!id) {
      winston.warn(`'GET' api/notes/:id - ID missing in request`)
      return res.status(400).json({error: 'ID missing'})
    }
    
    Note
      .findById(id)
      .then(note => {
        if (note){
          res.json(note)
          winston.info(`'GET' api/notes/:id - Note with ID ${id} found`)
        }else {
          res.status(404).end('invalid id')
          winston.warn(`'GET' api/notes/:id - note with ID ${id} not found`)
        }
      })
      .catch (error => next(error))
})

app.delete('/api/notes/:id', (req, res, error) => {
    const id = req.params.id
    if (!id){
      winston.warn(`'DELETE' api/notes/:id - ID is missing`)
      return res.status(400).json({error: 'ID missing'})
    }
    Note.findByIdAndDelete(id)
      .then( result => {
        res.status(204).end()
        winston.info(`'DELETE' api/notes/:id - note with ID ${id} deleted`)
      })
      .catch(error => next(error))
})

app.put('/api/notes/:id', (req, res, next) => {
    const id = req.params.id
    const {content, important} = req.body
    
    if (!id) {
      winston.warn(`'PUT' /api/notes/:id - ID is missing`)
      return res.status(400).json({ error: 'ID missing' })
    }
    
    if (!content) {
      winston.warn(`'PUT' /api/notes/:id - Content is missing`)
      return res.status(400).json({ error: 'Content missing' })
    }
    
    Note.findById(id)
      .then( note => {
        if (!note) {
          winston.warn(`'PUT' /api/notes/:id - Note with ID ${id} not found`)
          return res.status(404).json({ error: 'Note not found' })
        }
        note.content =  content
        note.important = important ?? note.important

        return note.save().then(updatedNote => {
            winston.info(`'PUT' /api/notes/:id - Note with ID ${id} updated successfully`)
            res.status(200).json({updatedNote: `${updatedNote}` })
          })
        })
        .catch(error => next(error))
})

app.post('/api/notes', (req, res, next) => {
    const {content, important} = req.body
    if(!content) {
      winston.warn(`POST /api/notes - Content missing`)
      return res.status(400).json({error: 'content missing'})
    }
    
    const note = new Note ({
      content: content,
      important: important ?? false,
    })
    
    note
      .save()
      .then(savedNote => {
        winston.info(`New note ${savedNote.content} is successfully created and saved in database`)
        res.status(201).json(savedNote)
      })
      .catch (error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  winston.error(error.stack || error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  winston.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});
