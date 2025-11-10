const express = require('express')
const winston = require('./loggers/winston')
const morganMiddleware = require('./loggers/morgan')
const cors = require('cors')
const app = express()

app.use(express.json())


app.use(morganMiddleware)

app.use(cors({
  origin: 'http://localhost:5173'
}))

app.get('/', (req, res) => {
  res.send('Notes API is running successfully on Render!');
});

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
app.get('/api/notes', (req, res) => {
  try {
    res.json(notes)
    winston.info(`'GET' api/notes - fetched data`)
  } catch (error) {
    winston.error(`'GET' api/notes - Error fetching notes from server', ${error.message}`)
    res.status(500).end()
  }
})

app.get('/api/notes/:id', (req, res) => {
  try {
    const id = req.params.id
    if(!id) {
      winston.warn(`'GET' api/notes/:id - ID is missing`)
      return res.status(400).json({error: 'ID missing'})
    }

    const note = notes.find( n => n.id === id)
    if (note){
      res.json(note)
      winston.info(`'GET' api/notes/:id - Note with ID ${id} found`)
    }else {
      res.status(404).end('invalid id')
      winston.warn(`'GET' api/notes/:id - note with ID ${id} not found`)
    }
  } catch (error) {
    res.status(500).end()
    winston.error(`'GET' api/notes/:id - Error fetching notes from server', ${error.message}`)
  }
})

app.delete('/api/notes/:id', (req, res) => {
  try {
    const id = req.params.id
    if (!id){
      winston.warn(`'DELETE' api/notes/:id - ID is missing`)
      return res.status(400).json({error: 'ID missing'})
    }

    notes = notes.filter(n => n.id !== id)
    res.status(204).end()
    winston.info(`'DELETE' api/notes/:id - note with ID ${id} deleted`)
  } catch (error) {
    res.status(500).end()
    winston.error(`'DELETE' api/notes/:id - Error deleting note with ID ${id} from server', ${error.message}`)
  }
})

app.put('/api/notes/:id', (req, res) => {
  try {
    const id = req.params.id
    const body = req.body

    if (!id) {
      winston.warn(`'PUT' /api/notes/:id - ID is missing`)
      return res.status(400).json({ error: 'ID missing' })
    }

    if (!body.content) {
      winston.warn(`'PUT' /api/notes/:id - Content is missing`)
      return res.status(400).json({ error: 'Content missing' })
    }

    const noteIndex = notes.findIndex(n => n.id === id)
    if (noteIndex === -1) {
      winston.warn(`'PUT' /api/notes/:id - Note with ID ${id} not found`)
      return res.status(404).json({ error: 'Note not found' })
    }

    // Update note fields
    const updatedNote = {
      ...notes[noteIndex],
      content: body.content,
      important: body.important ?? notes[noteIndex].important,
    }

    notes[noteIndex] = updatedNote

    winston.info(`'PUT' /api/notes/:id - Note with ID ${id} updated successfully`)
    res.status(200).json(updatedNote)
  } catch (error) {
    winston.error(`'PUT' /api/notes/:id - Error updating note with ID ${req.params.id}: ${error.message}`)
    res.status(500).json({ error: 'Server error' })
  }
})

const generatedId = () => {
  maxId = notes.length > 0 
  ? Math.max(...notes.map(n => Number(n.id)))
  : 0
  return String(maxId + 1)
}

app.post('/api/notes', (req, res) => {
  try {
    const {content, important} = req.body
    if(!content) {
      winston.warn(`POST /api/notes - Content missing`)
      return res.status(400).json({error: 'content missing'})
    }
  
    const newNote = {
      id: generatedId(),
      content: content,
      important: important ?? false
    }

    notes = notes.concat(newNote)
    res.status(201).json(newNote)
    winston.info(`New note ${content} is successfully created`)
  } catch (error) {
    winston.error(`'POST' /api/notes/ - Error creating note with ID: ${error.message}`)
    res.status(500).json({ error: 'Server error' })
  }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  winston.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});
