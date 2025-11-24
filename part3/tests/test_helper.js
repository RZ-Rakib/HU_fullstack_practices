const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: true
  },
  {
    content: 'CSS is hard',
    important: true
  }
]

const noteInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const nonExistingId = async () => {
  const newNote = new Note({ content: 'Hello from Gym' })
  await newNote.save()
  await newNote.deleteOne()

  return newNote._id.toString()
}

module.exports = {
  initialNotes, noteInDb, nonExistingId
}